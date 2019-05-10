import Ember from 'ember'
import { debounce } from '../../utils/run-decorators'

const {
  Component,
  observer,
  run,
} = Ember

export default Component.extend({
  tagName: 'section',

  chartId: 'chartdiv-timeline-axis',

  init() {
    this._super(...arguments)
    run.next(() => {
      const elementId = this.get('element').id
      this.$().find('.graph-container').bind('mousemove touchmove touchstart', function (e) {
        var chart,
          point,
          i,
          event;
        
        for (i = 0; i < Highcharts.charts.length; i = i + 1) {
          chart = Highcharts.charts[i];
          event = chart.pointer.normalize(e.originalEvent); // Find coordinates within the chart
          point = chart.series[0].searchPoint(event, true); // Get the hovered point

          if (point) {
            point.highlight(e);
          }
        }
      })
    })
  },

  makeData: Ember.on('init', observer('budget.from', 'budget.to', function () {
    const from = this.get('budget.from')
    const to = this.get('budget.to')
    const range = moment.range(from, to)
    const data = []

    range.by('days', function (m) {
      data.push({
        x: m.add(12, 'hours').unix() * 1000,
        y: 0
      })
    })

    this.set('data', [{
        data
    }])
    this.createChart()
  })),

  @debounce(10)
createChart() {
  const data = this.get('data')
  console.log('dataxx', data)
  const chart = Highcharts.chart(`chartdiv-timeline-axis`, {
    credits: {
      enabled: false
    },
    legend: {
      enabled: false
    },
    chart: {
      zoomType: 'x'
    },
    title: {
      text: null,
    },
    xAxis: {
      crosshair: true,
      type: 'datetime',
      //tickInterval: 7 * 24 * 3600 * 1000, // one week
      tickWidth: 0,
      gridLineWidth: 1,
      //opposite: true,
      events: {
        //setExtremes: syncExtremes
      },
    },
    yAxis: {
      title: {
        text: null,
      },
      labels: {
        align: 'left',
        x: 0,
        y: -2
      }
    },
    tooltip: {
      shared: true,
      crosshairs: true,
      animation: false,
      split: true,
      distance: 30,
      padding: 5,
    },
    series: data
  })
},
})
