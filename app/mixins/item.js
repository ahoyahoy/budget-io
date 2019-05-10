import Ember from 'ember'
import config from 'ember-get-config'
import { plusPeriod } from '../utils/date-manipulate'

const {
    Mixin,
    computed,
    observer
} = Ember

export default Mixin.create({
  makeInstances () {
		if (!this.get('instances')) {
			this.set('instances', [])
		}
		const enabled = this.get('enabled')
		const repeat = this.get('repeat')

		if (enabled && repeat && repeat !== 'none') {
			const n = parseInt(repeat.slice(0,1)) // 1m, 1w, ...
			const period = repeat.slice(-1)
			const to = moment(this.get('budget.to'), config.DB_DATE_FORMAT)

			let date = this.get('date').clone()
			date = plusPeriod(period, n, date)
			while (date <= to) {
				this.cloneItem(period, date.format(config.DB_DATE_FORMAT))
				date = plusPeriod(period, n, date)
			}
		}
	},

	clearInstances () {
		this.get('instances').forEach((instance) => {
			instance.destroy()
			this.get('instancesRef').removeObject(instance)
		})
		this.get('instances').clear()
	},

	splitItem () {/*
		this.clone((clon) => {
			clon.setProperties({
				
			})
			this.get('itemsArray').pushObject(clon)
		})
		*/
	},

	deleteItem () {
		this.clearInstances()
		this.destroyRecord().then(() => {
			this.get('budget').save()
		})
	},

	cloneItem(period, day) {
		const item = Ember.Object.create({
      type: 'item',
			instance: this,
			day,
			month: day.slice(0, -3),
			timestamp: moment(day, config.DB_DATE_FORMAT).add(1, 'hours').unix(),
			date: moment(day, config.DB_DATE_FORMAT),
			show: computed.oneWay('instance.show'),
			title: computed.oneWay('instance.title'),
			category: computed.oneWay('instance.category'),
			scenario: computed.oneWay('instance.scenario'),
			sum: computed.oneWay('instance.sum'),
			enabled: true, //computed.oneWay('instance.enabled'),
			pos: computed.oneWay('instance.pos'),
			width: 400,
			height: 23
		})
		/*
		this.setProperties({
			isInstance: true // TODO - nema to byt hasInstances
		})
		*/
		this.get('instances').pushObject(item) // at muzu smazat instance
		this.get('instancesRef').pushObject(item) // at to mam mezi vsema items
	},

	instanceNeedRefresh: observer('repeat', 'day', 'enabled', 'budget.from', 'budget.to', function () {
		this.clearInstances()
		this.makeInstances()
	})
})
