import Ember from 'ember'
import computed, { bool } from 'ember-computed-decorators'

const o = (obj) => Ember.Object.create(obj)

const {
  Component,
  inject: {service},
  observer,
  run,
  A
} = Ember

export default Component.extend({
  tagName: 'section',
  classNames: 'item-form-section'.w(),

  session: service(),
  store: service(),

  item: Ember.Object.create({}),
  showDialog: false,
  showForm: false,

  @bool('editItem')
  isEditing,

  itemEditObserver: observer('budget.editItem', function () {
    const editItem = this.get('budget.editItem')
    const origin = this.get('budget.editItemOrigin')
    if (editItem) {
      this.get('item').setProperties({
        sum: editItem.get('sum'),
        title: editItem.get('title'),
        scenario: editItem.get('scenario'),
        category: editItem.get('category'),
        day: editItem.get('day'),
        repeat: editItem.get('repeat'),
        instance: editItem.get('instance'),
        deleteItem: editItem.deleteItem,
        //item: editItem,
      })
      console.log('ORI', origin)
      this.setProperties({
        editItem,
        origin: '#'+origin,
      })
      this.get('budget').set('editItem', null)
      this.send('show')
    }
  }),

  createItem () {
    const i = this.get('item')
    const item = {
      sum: parseFloat(i.get('sum')),
      title: i.get('title'),
      scenario: i.get('scenario'),
      category: i.get('category'),
      show: true,
      day: i.get('day'),
      repeat: i.get('repeat.id'),
      owner: this.get('session.uid'),
    }

    console.log('XXX', this.get('store'), item)
    
    this.get('store')
      .createRecord('item', item)
      .save().then((record) => {
        const budget = this.get('budget')
        budget.get('items').pushObject(record)
        budget.save().then(() => {
          this.setProperties({
            submited: false,
          })
        })
        this.send('close', 'done')
      })
    
  },

  updateItem () {
    const item = this.get('item')
    const editItem = this.get('editItem')
    editItem.setProperties({
      sum: parseFloat(item.get('sum')),
      title: item.get('title'),
      scenario: item.get('scenario'),
      category: item.get('category'),
      day: item.get('day'),
      repeat: item.get('repeat.id'),
    })
    editItem.save()
    this.send('close', 'done')
  },

  resetForm () {
    this.setProperties({
      sum: '',
      title: '',
      scenario: null,
      category: null,
      day: this.get('today'),
      repeat: 'none',
    })
  },

  actions: {
    show () {
      this.set('showDialog', true)
      run.later(() => {
        this.setProperties({
          showForm: true,
          showFormDiv: true,
        })
      }, 200)
    },
    
    close (reason) {
      //this.resetForm()

      this.setProperties({
        showFormDiv: false,
      })

      run.later(() => {
        this.setProperties({
          item: Ember.Object.create({}),
          editItem: null,
          showForm: false,
          showDialog: false,
          submited: false,
        })
      }, 200)
    },

    submit () {
      this.set('submited', true)
      if (this.get('isEditing')) {
        this.updateItem()
      }
      else {
        this.createItem()
      }
    },
    
		delete() {
      this.send('close')
      run.next(() => {
			  this.get('editItem').deleteItem()
      })
		},
  }
})
