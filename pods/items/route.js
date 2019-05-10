import Ember from 'ember';

const {
	Route
} = Ember;

export default Route.extend({
	titleToken: 'Test Firebase',
    session: Ember.inject.service(),

	model () {
		return this.store.query('budget', {
			orderBy: 'owner/',
            equalTo: this.get('session.uid')
		});
        /*return this.store.query('budget', {
			orderBy: 'share/' + this.get('session.uid'),
            equalTo: true
		});*/
	}
});