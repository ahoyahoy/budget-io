import Ember from 'ember'

const {
  Component,
  run,
} = Ember

export default Component.extend({
  tagName: 'section',

  init () {
    this._super(...arguments)

    if (!this.get('item')) {
      this.set('item', Ember.Object.create({}))
    }
  },

  actions: {
    close (reason) {
      this.set('showDialog', false)
    },

    formSubmit () {
      this.sendAction('saveItem', this.get('item'))
      this.send('close')

      run.next(() => {
        this.set('item', null)
      })
    },
  }
})
