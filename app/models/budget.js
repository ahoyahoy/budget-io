import Model from 'ember-data/model'
import Store from 'ember-data/store'
import attr from 'ember-data/attr'
import computed, { oneWay } from 'ember-computed-decorators'
import { hasMany } from 'ember-data/relationships'

export default Model.extend({
	title: attr('string'),
  owner: attr('string'),
  items: hasMany('item', { async: true }),
  categories: hasMany('category', { async: true }),
  scenario: hasMany('scenario', { async: true }),
  widgets: hasMany('widget', { async: true }),
  from: attr('string'),
  to: attr('string'),

  @computed('from', 'to')
  range(from, to) {
    console.log('momomo', moment.range(from, to))
    return moment.range(from, to)
  },

  autoSave: Ember.observer('from', 'to', function () {
      this.save()
  }),
})
