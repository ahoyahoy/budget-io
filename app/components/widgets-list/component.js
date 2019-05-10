import Ember from 'ember'
import computed, { sort } from 'ember-computed-decorators'

const {
  Component,
	inject: {service},
} = Ember

export default Component.extend({
  tagName: 'section',

	store: service(),

	classNameBindings: ['dragging'],
  
  sortingWidgetsDesc: ['position'],
  @sort('budget.widgets', 'sortingWidgetsDesc')
	sortedWigets,

	newSettings: {},
	types: [
		{ title: 'Graph', id: 'graph' },
		{ title: 'Timeline', id: 'timeline' },
	],

  actions: {
		dragStarted(item) {
      this.set('dragging', true)
    },

    dragStopped(item) {
      this.set('dragging', false)
    },

		reorderItems (itemModels, draggedModel) {
			let i = 0
			itemModels.forEach(item => {
				item.set('position', i++)
				item.save()
			})
		},

    closeDialog (reason) {
      this.set('showDialog', false)
    },

		dialog () {
			this.set('showDialog', true)
		},

		saveNewItem () {
      const newType = this.get('newType')
      const newItemSettings = this.get('newSettings')
			const sortedWigets = this.get('sortedWigets')
			const settings = JSON.parse(JSON.stringify(newItemSettings))
			const item = {
				type: newType.id,
				position: sortedWigets.get('length') + 1,
				settings,
			}
      this.get('store')
        .createRecord('widget', item)
        .save()
        .then((record) => {
          const budget = this.get('budget')
          budget.get('widgets').pushObject(record)
          budget.save()
          // TODO pokud failne save, melo by se to zas vyhodit
        })
			this.send('closeDialog', 'done')
    },

	}
})
