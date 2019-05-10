import Ember from 'ember'
import _ from 'lodash/lodash'
import moment from 'moment'

const {
	Component,
	Mixin,
	inject: {service},
	computed,
	observer
} = Ember

export default Component.extend({
	divs: [],
	makeData: Ember.on('init', observer('budget.from', 'budget.to', function () {
        const budget = this.get('budget')
        const from = budget.get('from')
        const to = budget.get('to')
		const range = moment.range(from, to)
		const data = []

        range.by('days', function(m) {
            const day = moment.unix(m.unix()).startOf('day').unix() //TODO zkontrolovat, jestli je to tak debilne potreba jeste
            data.push({
                date: m.add(12, 'hours'),
                value: 0
            })
        })

        this.set('data', data)
	})),

    chartId: 'chartdiv-timeline-axis',

	createChart: observer('data', _.debounce(function () {
		var chart = AmCharts.makeChart(this.get('chartId'), {
			"type": "serial",
			"theme": "none",
			"dataProvider": this.get('data'),
			addClassNames: true,
			"valueAxes": [{
				"gridColor":"#FFFFFF",
				"inside": true,
				"gridAlpha": 0.2,
				"dashLength": 0
			}],
			"gridAboveGraphs": true,
			"startDuration": 0,
			"graphs": [{
				"id": "g1",
				"balloon":{
					"drop":true,
					"adjustBorderColor":false,
					"color":"#ffffff"
				},
				"lineThickness": 2,
				"title": "red line",
				"useLineColorForBulletBorder": true,
				"valueField": "value",
				"balloonText": "<span style='font-size:18px'>[[value]]</span>" 
			}],
			"chartCursor": {
				"pan": true,
				"valueLineEnabled": true,
				"valueLineBalloonEnabled": true,
				"cursorAlpha":0,
				"cursorColor":"#258cbb",
				"limitToGraph":"g1",
				"valueLineAlpha":0.2,
				"valueZoomable":true
			},
			"categoryField": "date",
			"categoryAxis": {
				"parseDates": true,
				"dashLength": 1,
				"minorGridEnabled": true
			},
			"trendLines": [{
				"finalDate": "2012-01-11 12",
				"finalValue": 19,
				"initialDate": "2012-01-02 12",
				"initialValue": 10,
				"lineColor": "#CC0000"
			}]
		})
		this.set('chart', chart)

		setTimeout(() => {
			console.log('ddadadadadada', chart.plotAreaWidth)
			this.set('chartWidth', chart.plotAreaWidth)
		}, 10)

        chart.addListener('changed', (event) => {
            if (!isNaN(event.index)) {
                const timestamp = chart.chartData[event.index].time/1000
                this.sendAction('chartMouseMove', timestamp, )
            }
        })
	}, 10)),

	cursorPosDidChange: observer('cursor', function () {
		const hoverChart = this.get('hoverChart')
		const chartId = this.get('chartId')
		if (hoverChart !== chartId) {
			const cursorPos = this.get('cursor')
			this.get('chart').chartCursor.showCursorAt(cursorPos)
		}
	}),

    mouseEnter () {
        this.set('hoverChart', this.get('chartId'))
    },

	actions: {
	}
})