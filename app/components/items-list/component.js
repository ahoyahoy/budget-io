import Ember from 'ember'
import config from 'ember-get-config'
import computed, { filter, filterBy, sort, mapBy, max, min, union } from 'ember-computed-decorators'

const {
  Component
} = Ember

const createSpecialItem = (type, date, params) => {
  const heights = {
    'day-header': 39,
    'month-header': 56,
    'special-first': 30,
    'special-today': 0,
  }
  const addTime = {
    'day-header': 10,
    'month-header': 0,
    'special-first': 0,
    'special-today': 5,
  }
  return Ember.Object.create({
    type,
    day: date.format(config.DB_DATE_FORMAT),
    timestamp: date.add(addTime[type], 'minutes').unix(),
    date: date,
    width: 400,
    height: heights[type],
    ...params
  })
}

export default Component.extend({
  tagName: 'section',

  @computed('items.[]', 'scenario')
  itemsByScenario(items, scenario) {
    if (scenario) {
      return items.filter(i => {
        return $.inArray(i.get('scenario.id'), scenario.get('dependency')) > -1
      })
    }
    else {
      return []
    }
  },

  @mapBy('itemsByScenario', 'timestamp')
  dates,

  @max('dates')
  maxDate,

  @min('dates')
  minDate,

  @computed('minDate', 'maxDate')
  datesRange(min, max) {
    min = $.isNumeric(min) ? min : 0
    max = $.isNumeric(max) ? max : 0
    return moment.range(moment.unix(min), moment.unix(max))
  },

  @computed('datesRange')
  months(range) {
    const months = []
    range.by('month', m => {
      const month = createSpecialItem('month-header', m.startOf('month'), {
        serviceRef: this
      })
      month.setProperties({
        items: Ember.computed.filterBy('serviceRef.itemsByScenario', 'month', m.format('YYYY-MM')),
        enabledItems: Ember.computed.filterBy('items', 'enabled', true),
        values: Ember.computed.mapBy('enabledItems', 'sum'),
        sum: Ember.computed.sum('values')
      })
      months.pushObject(month)
    })
    return months
  },

  @computed('datesRange')
  days(range) {
    const days = []
    range.by('days', d => {
      const day = createSpecialItem('day-header', d.startOf('day'), {
        serviceRef: this
      })
      day.setProperties({
        items: Ember.computed.filterBy('serviceRef.itemsByScenario', 'day', d.format('YYYY-MM-DD')),
        enabledItems: Ember.computed.filterBy('items', 'enabled', true),
        values: Ember.computed.mapBy('enabledItems', 'sum'),
        sum: Ember.computed.sum('values'),
      })
      days.pushObject(day)
    })
    return days
  },

  @filter('days', day => {
    return day.get('items.length') > 0
  })
  filledDays,

  @computed
  specialItems () {
    const items = []
    const specials = [
      ['special-first', moment(1).startOf('day')],
      ['special-today', moment().startOf('day').add(1, 'min')]
    ]
    specials.forEach(i => items.push(createSpecialItem(...i)))
    return items
  },

  @union('filledDays', 'months', 'specialItems', 'itemsByScenario')
  allItems,

  sortingItemsDesc: ['timestamp'],
  @sort('allItems', 'sortingItemsDesc')
  sortedItems,

  

})
