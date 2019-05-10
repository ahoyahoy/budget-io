import Ember from 'ember'
import config from 'ember-get-config'
import { filterBy } from 'ember-computed-decorators'
import ScenarioMixin from '../mixins/scenario'

const {
  Service,
  observer,
  inject,
  on,
} = Ember

export default Service.extend({
  store: inject.service(),

  budget: null,

  @filterBy('scenario', 'enhanced', undefined)
  nonEnhancedScenario,

  autoEnhancerAndUpdater: on('init', observer('budget.scenario.[]', function () {
    console.log('DEP2', this.get('nonEnhancedScenario'))
    this.enhanceScenario(this.get('nonEnhancedScenario'))
  })),

  enhanceScenario (scenario) {
    scenario.forEach(s => {
      s.reopen(ScenarioMixin)
      s.setProperties({
        allScenario: scenario,
        enhanced: true,
      })
    })
  },
})
