import Ember from 'ember'
import currentlyLoadingMixin from '../mixins/currently-loading'

const {
	Route,
	inject,
	run,
} = Ember

export default Route.extend(currentlyLoadingMixin, {
	session: inject.service(),
	items: inject.service(),

	model (params) {
		return this.store.find('budget', params.id)
	},

	actions: {
		editItem (editItem, editItemOrigin) {
			this.controllerFor('budget').get('model').setProperties({
				editItem,
				editItemOrigin,
			})
		},

		changeBudget (id) {
			run.next(() => {
				this.set('session.user.lastBudget', id)
				this.transitionTo('budget', id)
			})
		}
	}
})