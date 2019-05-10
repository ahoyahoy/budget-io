import Ember from 'ember';

const {
	Controller,
	inject: {service},
} = Ember;

export default Controller.extend({
    session: Ember.inject.service(),

	actions: {
		createItem() {
			var newItem = this.store.createRecord('item', {
				title: this.get('title'),
                category: this.get('category'),
                show: true,
                timestamp: new Date().getTime(),
                author: this.get('session.uid'),
                share: [this.get('session.uid')]
			});
			newItem.save();
		}
	}
});