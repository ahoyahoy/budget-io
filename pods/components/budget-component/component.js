import Ember from 'ember'
import _ from 'lodash/lodash'
import Month from '../../../models/month'


const {
	Component,
	Mixin,
	inject: {service},
	computed,
	observer
} = Ember

const plusPeriod = function (period, n, day) {
	const periods = {
		d: 'days',
		w: 'weeks',
		m: 'months',
		y: 'years'
	}
	if (periods[period]) {
		return moment(day).add(periods[period], n).format('YYYY-MM-DD')
	}
	else {
		return false
	}
}
/*
const each_async = function(ary, fn, delay = 1) {
    let i = 0
    const iter = function () {
        fn(ary[i], i)
        if (++i < ary.length) {
			setTimeout(iter, delay)
		}
    }
	iter(arguments)
}
*/
const ItemMixin = {
	makeInstances() {
		this.set('instances', [])
		const repeat = this.get('repeat')
		if (repeat && repeat !== 'none') {
			const n = parseInt(repeat.slice(0,1))
			const period = repeat.slice(-1)
			const to = moment(this.get('budget.to'))
			let day = this.get('day')
			day = plusPeriod(period, n, day)

			while (moment(day) <= to) {
				this.cloneItem(period, n, day)
				day = plusPeriod(period, n, day)
			}
		}
	},
	clearInstances() {
		this.get('instances').forEach((instance) => {
			instance.destroy()
			this.get('itemsRef').removeObject(instance)
		})
		this.set('instances', [])
	},
	splitItem() {/*
		this.clone((clon) => {
			clon.setProperties({
				
			})
			this.get('itemsArray').pushObject(clon)
		})
		*/
	},
	cloneItem(period, n, day) {
		let nItem = Ember.Object.create({
			instance: this,
			day,
			timestamp: moment(day).unix(),
			date: moment(day),
			show: computed.oneWay('instance.show'),
			title: computed.oneWay('instance.title'),
			category: computed.oneWay('instance.category'),
			scenario: computed.oneWay('instance.scenario'),
			//showClass: computed.oneWay('instance.showClass'),
			sum: computed.oneWay('instance.sum'),
			enabled: computed.oneWay('instance.enabled'),
			pos: computed.oneWay('instance.pos'),
			width: 333,
			height: 118
		})
		this.setProperties({
			isInstance: true
		})
		this.get('instances').pushObject(nItem) // at muzu smazat instance
		this.get('itemsRef').pushObject(nItem) // at to mam mezi vsema items
	},

	instanceNeedChange: observer('repeat', 'day', function () {
		this.clearInstances()
		this.makeInstances()
	})
}

export default Component.extend({
	tagName: 'section',
	store: Ember.inject.service(),
	items: [],
	months: [],
	sortingItemsDesc: ['timestamp'],
	sortedItems: computed.sort('allItems', 'sortingItemsDesc'),
	allItems: Ember.computed.union('months', 'specialItems', 'items'),
	specialItems: [
		{
			type: 'special-first',
			timestamp: moment(1).unix(),
			width: 333,
			height: 200
		},
		{
			type: 'special-empty',
			width: 333,
			height: 20
		},
		{
			type: 'special-today',
			day: moment().startOf('day').format('YYYY-MM-DD'),
			timestamp: moment().startOf('day').unix(),
			date: moment().startOf('day'),
			width: 333,
			height: 50
		}
	],
	monthsMaker: Ember.on('init', Ember.observer('budget.from', 'budget.to',function () {
		const budget = this.get('budget')
		const from = moment(budget.get('from'))
        const to = moment(budget.get('to'))
        const range = moment.range(from, to)
        const months = []
		console.time('months1')
		range.by('month', m => {
			const month = Ember.Object.create({
				type: 'month-header',
                day: m.startOf('month').format('YYYY-MM-DD'),
				timestamp: m.startOf('month').unix(),
				date: m.startOf('month'),
                component: this,
				width: 333,
				height: 50
            })
			month.setProperties({
				items: computed.filter('component.items.@each.day', function (item) {
					if (item.get('type') === 'item') {
						const itemMonth = item.get('date').startOf('month').format('YYYY-MM-DD')
						return itemMonth === this.get('day')
					}
					else {
						return false
					}
				}),
				show: computed.filterBy('items', 'show', true)
			})
			months.pushObject(month)
		})
		console.timeEnd('months1')
		this.set('months', months)
	})),
	filteredItems: computed.filter('budget.items.[]', 'budget.items.@each.enabled', item => {
		const enabled = item.get('enabled')
		return enabled
	}),
    itemsMaker: Ember.on('init', Ember.observer('filteredItems', _.debounce(function () {
		const budget = this.get('budget')
		this.set('items', [])
		const tmpItems = []
		console.time('items1')
		this.get('filteredItems').forEach((item) => {
			item.reopen(ItemMixin)
			item.setProperties({
				budget,
				width: 333,
				height: 118,
				type: 'item',
				itemsRef: this.get('items'),
			})
			tmpItems.pushObject(item)
			item.makeInstances()
		})
		console.timeEnd('items1')
		this.set('items', tmpItems)
	}, 100))),

})
