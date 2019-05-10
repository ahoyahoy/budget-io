import Ember from 'ember'
import config from 'ember-get-config'
import computed, { filter, filterBy, sort, mapBy, max, min, union } from 'ember-computed-decorators'
import ItemMixin from '../mixins/item'
import arrayToObject from '../utils/arrayToObject'
import { debounce } from '../utils/run-decorators'

const {
  Service,
  observer,
  inject,
} = Ember


const cloneObj = obj => {
  return JSON.parse(JSON.stringify(obj))
}

export default Service.extend({
  store: inject.service(),

  budget: null,
  items: [],
  instances: [],

  @filterBy('items', 'enhanced', undefined)
  nonEnhancedItems,

  @mapBy('items', 'id')
  itemsIds,

  autoEnhancerAndUpdater: observer('items.[]', function () {
    this.enhanceItems(this.get('nonEnhancedItems'))
    Ember.run.next(() => {
      this.destroyDeletedItems()
    })
  }),

  enhanceItems (items) {
    items.forEach(i => {
      i.setProperties({
        budget: this.get('budget'),
        width: 400,
        height: 23,
        type: 'item',
        instancesRef: this.get('instances'),
        enhanced: true,
      })
      i.reopen(ItemMixin)
      i.makeInstances()
    })
  },

  destroyDeletedItems () {
    const ids = this.get('itemsIds')
    const items = this.get('store').peekAll('item')

    // TODO BLOST, MAZALO TO PAK ITEMY PRI ZMENE BUDGETU, PROTOZE BYLA JINA DELKA ATD
    /*
    if (ids.length !== items.get('length')) {
      items.forEach(i => {
        const id = i.get('id')
        
        if ($.inArray(id, ids) < 0) {
          i.clearInstances()
          i.destroyRecord()
        }
      })
    }
    */
  },
  
  @filterBy('items', 'enabled', true)
  enabledItems,

  @union('items', 'instances')
  itemsAndInstances,

  sortingItemsDesc: ['timestamp'],
  @sort('itemsAndInstances', 'sortingItemsDesc')
  sortedItemsAndInstances,

  @filterBy('sortedItemsAndInstances', 'enabled', true)
  enabledSortedItemsAndInstances,

  @computed('budget.{from,to}')
  budgetRange(from, to) {
    return moment.range(moment(from, 'YYYY-MM-DD'), moment(to, 'YYYY-MM-DD'))
  },

  cumulatedItemsDaily: [],

  watcher: Ember.observer(
    'enabledSortedItemsAndInstances.[]',
    'enabledSortedItemsAndInstances.@each.sum',
    'enabledSortedItemsAndInstances.@each.day',
    'enabledSortedItemsAndInstances.@each.scenario',
    'enabledSortedItemsAndInstances.@each.category',
    'budget.scenario.[]',
    'budget.scenario.@each.extend',
    function () {
      this.makeCumulatedItemsDaily()
    }
  ),

  @debounce(500)
  makeCumulatedItemsDaily () {
    const range = this.get('budgetRange')
    const items = this.get('enabledSortedItemsAndInstances')
    const scenario = this.get('budget.scenario')

    if (range && scenario && scenario.get) {
      console.time('cumulatedItemsDaily')

      // vytvorim objekty, do kterych budu ukladat value a zaroven z nich cist extendovani
      //const scenarioObj = arrayToObject('id', scenario)
      const scenarioObjWithValue = scenario.map(s => {
        return {
          scenario: s.id,
          value: 0,
          extend: s.get('dependency')
        }
      })

      // vytvorim dny
      const itemDays = {}
      range.by('days', day => {
        itemDays[day.format('YYYY-MM-DD')] = {
          date: day,
          values: cloneObj(scenarioObjWithValue)
        }
      })
      console.log('YYYYY', range)
      const firstItemDay = itemDays[Object.keys(itemDays)[0]]

      // zapisu do nich hodnoty a pripisu je i do extendovanych...
      items.forEach(item => {
        const s = item.get('scenario')
        let d = itemDays[item.get('day')]
        if (typeof d === 'undefined' && item.get('date') < firstItemDay.date) {
           d = firstItemDay
        }
        if (typeof d !== 'undefined') {
          d.values.forEach(scenarioVals => {
            if (scenarioVals.scenario === s.get('id') || $.inArray(s.get('id'), scenarioVals.extend) > -1) {
              scenarioVals.value += item.get('sum')
            }
          })
        }
      })

      // uz vyrobim finalni data
      const data = {}
      const cumulatedValues = {}
      
      scenario.forEach(s => {
        cumulatedValues[s.get('id')] = 0
        data[s.get('id')] = []
      })

      Object.entries(itemDays).map(([x, day]) => {
        day.values.forEach(v => {
          cumulatedValues[v.scenario] += v.value
          data[v.scenario].push({
            x: day.date.unix() * 1000,
            y: cumulatedValues[v.scenario],
          })
        })
      })

      const cumulatedItems = Object.entries(data).map( ([key, data]) => {
        return {
          key,
          data
        }
      })

      console.timeEnd('cumulatedItemsDaily')
      this.set('cumulatedItemsDaily', cumulatedItems)
    }
  }
})
