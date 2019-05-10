import Ember from 'ember'
import computed, { bool } from 'ember-computed-decorators'

const o = (obj) => Ember.Object.create(obj)

const {
  Component,
  run,
  A
} = Ember

export default Component.extend({
  classNames: "my-form".w(),

  today: moment().format('YYYY-MM-DD'),

  repeats: A([
    o({ id: 'none', title: 'none' }),
    o({ id: '1d', title: 'daily' }),
    o({ id: '1w', title: 'weekly' }),
    o({ id: '1m', title: 'monthly' }),
    o({ id: '1y', title: 'yearly' })
  ]),

  @bool('item.instance')
  isInstance,
  
/*
  repeatItem: Ember.computed('item', function () {
    const item = this.get('item')
    const repeats = this.get('repeats')

    if (item) {
      return _.filter(repeats, { id: item.get('repeat') })[0]
    }
    else {
      return null
    }
  }),
*/
  actions: {
    submit () {
      this.set('submited', true)
      this.sendAction('submit')
    },

    delete () {
      this.sendAction('delete')
    },

    cancel () {
      this.sendAction('cancel', 'cancel')
    },
  }
})
