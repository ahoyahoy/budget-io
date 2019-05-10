import Ember from 'ember'
import computed, { alias, oneWay } from 'ember-computed-decorators'

const {
  Component,
  inject,
  observer,
  run,
} = Ember

export default Component.extend({
  tagName: 'section',

  store: inject.service(),
  session: inject.service(),
  router: inject.service(),

  @oneWay('session.uid')
  owner,

  @alias('session.user')
  user,

  @computed('owner')
  newBudget (owner) {
    return {
      owner
    }
  },

  @computed
  budgets () {
    return this.get('store').query('budget', {
      orderBy: 'owner/',
      equalTo: this.get('owner')
    })
  },


  actions: {
    newBudget () {
      this.set('showDialog', true)
    },

    closeDialog (action) {
      if (action === 'create') {
        var budget = this.get('store').createRecord('budget', this.get('newBudget'))
        budget.save().then((b) => {
          this.send('changeBudget', b.id) // change route
        })
      }
      this.set('showDialog', false)
    }
  }
})
