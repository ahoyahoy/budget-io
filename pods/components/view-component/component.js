import Ember from 'ember';
import _ from 'lodash/lodash';
import moment from 'moment';

const {
	Component,
	Mixin,
	inject: {service},
	computed,
	observer
} = Ember;

export default Component.extend({
	sortingWidgetsDesc: ['position'],
	sortedWigets: computed.sort('budget.widgets', 'sortingWidgetsDesc'),

	actions: {
		showCursorAt (timestamp) {
			const date = moment.unix(timestamp).add(12, 'hours').toDate()
			Ember.run.next(() => {
				this.set('cursor', date)
			})
		},

		xx () {
			this.set('showDialog', true)
		},

		closeDialog () {
			this.set('showDialog', false)
		},

		reorderItems(itemModels, draggedModel) {
			let i = 0
			itemModels.forEach(item => {
				item.set('position', i++)
				item.save()
			})
		}
	}
});