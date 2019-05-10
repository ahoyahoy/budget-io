import Ember from 'ember';
import _ from 'lodash/lodash';

const {
	Component,
    computed,
    observer
} = Ember;

export default Component.extend({
    store: Ember.inject.service(),

    init () {
		this._super(...arguments);
	},

    content: computed('data', 'items', function () {
        const data = this.get('data');
        const items = this.get('items');
        return data.get(items);
    }),
    
    valueStorage: null,
    focused: false,

    valueDidChange: observer('selectedBudget', function () {
        const val = this.get('selectedBudget');
        const itemName = this.get('item');
        const focused = this.get('focused');
        if (val && val.get('id')) {
            this.set('valueStorage', val);
            this.sendAction('select-item', itemName, val);
        }
        else if (!focused) {
            this.set('selectedBudget', this.get('valueStorage'));
            this.sendAction('select-item', itemName, this.get('valueStorage'));
        }
    }),

    actions: {
        blur() {
            this.set('focused', false);
        },
        focus() {
            this.set('focused', true);
        },
        create(title) {
            const item = this.get('item');
            const newCategory = this.get('store').createRecord(item, {
                title,
				color: 'red'
            });
            newCategory.save().then((c) => {
                const data = this.get('data');
                const items = this.get('items');
                data.get(items).pushObject(c);
                data.save().then(() => {
                    this.set('selectedBudget', c);
                });
            });
        }
    }
});