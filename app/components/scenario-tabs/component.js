import Ember from 'ember'
import computed, { sort } from 'ember-computed-decorators'

const {
  Component,
  observer,
  on,
  run,
} = Ember

export default Component.extend({
  tagName: 'section',

  classNameBindings: ['dragging'],

  sortingScenarioDesc: ['position'],
  @sort('budget.scenario', 'sortingScenarioDesc')
  sortedScenario,

  budgetDidChange: on('init', observer('budget', function () {
    console.log('x')
    run.next(() => {
      this.set('selected', this.get('sortedScenario').get('firstObject'))
    })
  })),

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

    selectScenario (scenario) {
      console.log('>>>', scenario.get('dependency'))
      this.set('selected', scenario)
    }
  }

})
