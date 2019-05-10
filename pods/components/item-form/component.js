import Ember from 'ember'
import _ from 'lodash/lodash'

const {
	Component,
	inject: {service},
} = Ember

export default Component.extend({
	session: service(),
	store: service(),

	init () {
		console.log('_____INIT_____')
		this._super(...arguments)
	},

	today: moment().format('YYYY-MM-DD'),

	repeats: [
		{ id: 'none', title: 'none' },
		{ id: '1d', title: 'daily' },
		{ id: '1w', title: 'weekly' },
		{ id: '1m', title: 'monthly' },
		{ id: '1y', title: 'yearly' }
	],

	repeatItem: Ember.computed('item', function () {
		const item = this.get('item')
		const repeats = this.get('repeats')

		if (item) {
			return _.filter(repeats, { id: item.get('repeat') })[0]
		}
		else {
			return null
		}
	}),

	currentValue: 1,

	actions: {
		addItem() {
			var newItem = this.get('store').createRecord('item', {
				sum: this.get('sum'),
				title: this.get('title'),
                scenario: this.get('scenario'),
                category: this.get('category'),
                show: true,
                day: this.get('day'),
				repeat: this.get('repeat.id'),
                owner: this.get('session.uid')
			})
			newItem.save().then((c) => {
                const budget = this.get('budget')
                budget.get('items').pushObject(c)
                budget.save().then(() => {
                    this.set('title', '')
                })
            })
		},
		saveItem() {
			const item = this.get('item')
			const repeat = this.get('repeatItem')
			if (repeat) {
				item.set('repeat', repeat.id)
			}
			item.setProperties({
				sum: this.get('sum'),
				title: this.get('title'),
				day: this.get('day')
			})
			item.save().then(() => {
				this.sendAction('done')
			})
		},
		setCat(cat, val) {
			const item = this.get('item')
			if (item) {
				item.set(cat, val)
			}
			else {
				this.set(cat, val)
			}
		}
	}
})