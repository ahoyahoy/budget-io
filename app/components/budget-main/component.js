import Ember from 'ember'

const {
  Component,
  inject
} = Ember

export default Component.extend({
  tagName: 'section',
  id: 'budget-main',
  classNames: 'flex-auto layout-row'.w(),

  itemsService: inject.service('items'),
  scenarioService: inject.service('scenario'),

  init() {
    this._super(...arguments)
  },

  xxxx: Ember.on('init', Ember.observer('budget', function () {
    const itemsService = this.get('itemsService')
    const scenarioService = this.get('scenarioService')
    const budget = this.get('budget')

    budget.get('scenario').then(scenario => {
      console.log('DEP', scenario)
      scenarioService.setProperties({
        budget,
        scenario
      })

      budget.get('items').then(items => {
        itemsService.setProperties({
          budget,
          items
        })
      })
    })
  })),

  //allItems: Ember.computed.alias('itemsService.sortedItems'),
  items: Ember.computed.alias('itemsService.sortedItemsAndInstances'),
  cumulatedItemsDaily: Ember.computed.alias('itemsService.cumulatedItemsDaily'),

})
