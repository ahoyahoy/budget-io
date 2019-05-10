import Ember from 'ember'
import computed, { bool } from 'ember-computed-decorators'

const {
  Component
} = Ember

export default Component.extend({
  classNameBindings: ['enabled:enabled:disabled', 'isInstance', 'isHoverDay:is-hover-day'],

  @computed('hoverDay', 'item.{day}')
  isHoverDay (hover, day) {
    console.log('___D_D_D', hover, day)
    return hover === day
  },

  @bool('item.enabled')
  enabled,

  @bool('item.instance')
  isInstance,

  @computed('scenario', 'item')
  isDependency(scenario, item) {
    return scenario.get('id') !== item.get('scenario').get('id')
  },
  
  mouseEnter () {
    this.set('hoverDay', this.get('item.day'))
  },
})
