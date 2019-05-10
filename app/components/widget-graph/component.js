import Ember from 'ember'
import computed from 'ember-computed-decorators'
import arrayToObject from '../../utils/arrayToObject'
import { debounce } from '../../utils/run-decorators'

const {
  Component,
  run,
} = Ember

// Override the reset function, we don't need to hide the tooltips and crosshairs.
Highcharts.Pointer.prototype.reset = function () {
  return undefined
}

// Highlight a point by showing tooltip, setting hover state and draw crosshair
Highcharts.Point.prototype.highlight = function (event) {
  this.onMouseOver() // Show the hover marker

  let r = []
  this.series.chart.series.forEach(s => {
    r.push(s.data[this.category])
  })

  //this.series.chart.tooltip.refresh(r); // Show the tooltip
  this.series.chart.xAxis[0].drawCrosshair(event, this) // Show the crosshair
}

export default Component.extend({
  tagName: 'section',

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

  createChart() {
    const elementId = this.get('element').id
    const data = this.get('items')

    console.log('D', data)

    const chart = Highcharts.chart(`${elementId}-graph-container`, {
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
        //split: true,
        distance: 30,
        padding: 5,
      },
      series: data
    })

    this.setProperties({ chart })
  },

  @debounce(100)
  updateChart() {
    const chart = this.get('chart')
    const data = this.get('items')
    const dataObj = arrayToObject('key', data)
    const updated = []
    if (chart) {
      chart.series.forEach(s => {
        const key = s.options.key
        if (dataObj[key]) {
          s.setData(dataObj[key].data)
          updated.push(key)
        }
        else {
          series.remove()
        }
      })
      data.forEach(s => {
        if ($.inArray(s.key, updated) < 0) {
          chart.addSeries(s)
        }
      })
    }
    else {
      this.createChart()
    }
  },

  dataDidChange: Ember.observer('items.[]', function () {
    run.next(() => {
      this.updateChart()
    })
  })


})
