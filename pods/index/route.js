import Ember from 'ember'

const {
	Route
} = Ember

export default Route.extend({
  session: Ember.inject.service(),

	beforeModel () {
		this.get('session.user').then((user) => {
      this.transitionTo('budget', user.get('lastBudget'))
    })
	}
})
