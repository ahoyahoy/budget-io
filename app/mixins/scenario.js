import Ember from 'ember'
import config from 'ember-get-config'
import arrayToObject from '../utils/arrayToObject'
import { debounce } from '../utils/run-decorators'

const {
    Mixin,
    observer,
} = Ember

export default Mixin.create({

  @debounce(300)
  makeDependency () {
    const scenario = this.get('allScenario')
    const scenarioObj = arrayToObject('id', scenario)

    const getExtends = function (scenario, ext = []) {
      const e = scenario.get('extend')
      if (e && typeof e !== 'undenfined' && e !== '') {
        ext.push(e)
        getExtends(scenarioObj[e], ext)
      }
      return ext
    }

    scenario.forEach(s => {
      const ext = getExtends(s)
      s.set('dependency', [s.id, ...ext])
      console.log('[s.id, ...ext DEP ]', [s.id, ...ext])
    })
  },

	instanceNeedRefresh: observer(
    'allScenario.[]',
    'allScenario.@each.extend',
    function () {
      this.makeDependency()
	  }
  )
})
