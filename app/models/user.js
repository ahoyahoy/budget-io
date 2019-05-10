import Model from 'ember-data/model'
import Store from 'ember-data/store'
import attr from 'ember-data/attr'
import { belongsTo, hasMany } from 'ember-data/relationships'
import Ember from 'ember'

const {
    computed,
    observer
} = Ember

export default Model.extend({
	uid: attr('string'),
    name: attr('string'),
    email: attr('string'),
    lastBudget: attr('string'),

    autoSave: observer('lastBudget', function () {
        this.save()
    }),
})
