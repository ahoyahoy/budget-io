import Ember from 'ember'
import computed, { bool, union } from 'ember-computed-decorators'

const {
  Component,
  observer,
  run,
  inject,
} = Ember

export default Component.extend({
  //tagName: 'md-input-container',
  classNames: 'cat-select'.w(),

  store: inject.service(),

  init () {
    this._super(...arguments)

    this.selectValueOrFirst()
  },

  @union('itemsToPrepend', 'items', 'itemsToAppend')
  content,

  @computed('newItemEnabled')
  itemsToAppend(newItemEnabled) {
    const items = []
    if (newItemEnabled) {
      items.pushObject(Ember.Object.create({
        type: 'special',
        title: 'New!!'
      }))
    }
    return items
  },

  @computed('noneItemEnabled')
  itemsToPrepend(noneItemEnabled) {
    const items = []
    if (noneItemEnabled) {
      items.unshiftObject(Ember.Object.create({
        title: 'None',
        id: 'none',
      }))
    }
    return items
  },
/*
  contentDidChanged: observer('content', function() {
    this.selectValueOrFirst()
  }),*/

  selectValueOrFirst() {
    const value = this.get('value')
    const content = this.get('content')
    if (value) {
      this.set('selected', value)
      run.next(() => {
        this.sendAction('update', value)
      })
    }
    else {
      const minLength = this.get('newItemEnabled') ? 1 : 0
      if (content.get('length') > minLength) {
        this.set('selected', content[0])
        run.next(() => {
          this.sendAction('update', content[0])
        })
      }
    }
  },

  actions: {
    update (item) {
      if (item.get('title') === 'New!!') {
        this.set('showDialog', true)
      }
      else {
        this.set('selected', item)
        this.sendAction('update', item)
      }
    },

    saveNewItem (item) {
      item = JSON.parse(JSON.stringify(item))
      const modelName = this.get('modelName')

      this.get('store')
        .createRecord(modelName, item)
        .save()
        .then((record) => {
          const budget = this.get('budget')
          this.get('items').pushObject(record)
          this.set('selected', record)
          budget.save()
          // TODO pokud failne save, melo by se to zas vyhodit
        })
    }
  }
})