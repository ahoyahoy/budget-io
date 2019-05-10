import Ember from "ember";
import _ from "lodash/lodash";
import moment from "moment";

const {
  Component,
  Mixin,
  inject: { service },
  computed,
  observer
} = Ember;

export default Component.extend({
  divs: [],
  makeData: observer(
    "items.@each.sum",
    "items.@each.enabled",
    "items.@each.day",
    "budget.categories.@each.show",
    _.debounce(
      function() {
        const items = this.get("items");
        const days = {};
        const data = [];

        if (items) {
          console.time('days')
          items.forEach(item => {
            if (
              item.get("enabled") &&
              (item.get("category.show") || item.get("instance.category.show"))
            ) {
              const timestamp = moment(item.get("day")).unix();
              const sum = item.get("sum");

              if (typeof days[timestamp] === "undefined") {
                days[timestamp] = 0;
              }
              days[timestamp] += Number(sum);
            }
          });
          console.timeEnd('days')

          const from = moment(this.get("budget.from"));
          const to = moment(this.get("budget.to"));
          const range = moment.range(from, to);
          let lastValue = 0;
          console.time('days2')
          range.by("days", function(m) {
            const day = moment.unix(m.unix()).startOf("day").unix(); //TODO zkontrolovat, jestli je to tak debilne potreba jeste
            if (typeof days[day] !== "undefined") {
              lastValue += Number(days[day]);
            }
            data.push({
              date: m.add(12, "hours"),
              value: lastValue
            });
          });
          console.timeEnd('days2')
          this.set("data", data);
        }
      },
      100
    )
  ),

  chartId: "chartdiv",

  createChart: observer(
    "data",
    _.debounce(
      function() {
        var chart = AmCharts.makeChart(this.get("chartId"), {
          type: "serial",
          theme: "none",
          dataProvider: this.get("data"),
          addClassNames: true,
          valueAxes: [
            {
              gridColor: "#FFFFFF",
              inside: true,
              gridAlpha: 0.2,
              dashLength: 0
            }
          ],
          gridAboveGraphs: true,
          startDuration: 0,
          graphs: [
            {
              id: "g1",
              balloon: {
                drop: true,
                adjustBorderColor: false,
                color: "#ffffff"
              },
              lineThickness: 2,
              title: "red line",
              useLineColorForBulletBorder: true,
              valueField: "value",
              balloonText: "<span style='font-size:18px'>[[value]]</span>"
            }
          ],
          chartCursor: {
            pan: true,
            valueLineEnabled: true,
            valueLineBalloonEnabled: true,
            cursorAlpha: 1,
            cursorColor: "#258cbb",
            limitToGraph: "g1",
            valueLineAlpha: 0.2,
            valueZoomable: true
          },
          categoryField: "date",
          categoryAxis: {
            parseDates: true,
            dashLength: 1,
            minorGridEnabled: true
          },
          trendLines: [
            {
              finalDate: "2012-01-11 12",
              finalValue: 19,
              initialDate: "2012-01-02 12",
              initialValue: 10,
              lineColor: "#CC0000"
            }
          ]
        });
        this.set("chart", chart);

        setTimeout(
          () => {
            console.log("ddadadadadada", chart.plotAreaWidth);
            this.set("chartWidth", chart.plotAreaWidth);
          },
          10
        );

        chart.addListener("changed", event => {
          if (!isNaN(event.index)) {
            const timestamp = chart.chartData[event.index].time / 1000;
            this.sendAction("chartMouseMove", timestamp);
          }
        });
      },
      10
    )
  ),

  cursorPosDidChange: observer("cursor", function() {
    const hoverChart = this.get("hoverChart");
    const chartId = this.get("chartId");
    if (hoverChart !== chartId) {
      const cursorPos = this.get("cursor");
      this.get("chart").chartCursor.showCursorAt(cursorPos);
    }
  }),

  mouseEnter() {
    this.set("hoverChart", this.get("chartId"));
  },

  actions: {
    test() {
    }
  }
});
