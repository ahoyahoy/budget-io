import Model from 'ember-data/model'
import attr from 'ember-data/attr'
import { belongsTo, hasMany } from 'ember-data/relationships'
import Ember from 'ember'

const {
    computed
} = Ember

export default Model.extend({
	timestamp: attr('number'),
    budget: belongsTo('budget', { async: true }),
    items: computed.filter('budget.items.@each.timestamp', function (item) {
        const d = moment.unix(item.get('timestamp')).startOf('month')
        return d.unix() === this.get('timestamp')
    }),
    showCount: computed.filterBy('items', 'show', true)
})
