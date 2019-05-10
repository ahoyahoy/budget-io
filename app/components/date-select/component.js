import Ember from 'ember'

const {
  Component,
  computed,
  run,
} = Ember

export default Component.extend({
  tagName: 'md-input-container',
  classNames: 'date-input md-input-has-value',

  init() {
    this._super(...arguments)
    run.next(() => {
      this.sendAction('update', this.get('value'))
    })
  },

  actions: {
    change(d) {
      const date = moment(d).format('YYYY-MM-DD')
      run.next(() => {
        this.sendAction('update', date)
      })
    }
  }
})
