import Ember from 'ember'

const {
  Component
} = Ember

export default Component.extend({
  actions: {
    submit () {
      this.set('submited', true)
      this.sendAction('submit')
    },

    cancel () {
      this.sendAction('cancel', 'cancel')
    },
  }
})
