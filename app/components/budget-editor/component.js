import Ember from 'ember'

const {
  Component
} = Ember

export default Component.extend({
  tagName: 'section',
  classNames: ''.w(),

  init () {
    this._super(...arguments)

    Ember.run.next(() => {
      $('.item-form-section').first().eq(0).scrollToFixed({ marginTop: 10 })
    })
  }
})
