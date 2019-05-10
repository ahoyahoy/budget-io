import Ember from 'ember'

var get = Ember.get,
    arrayComputed = Ember.arrayComputed

    
export default function(dependentKey, eachKey,  groupBy){
  return Ember.computed(dependentKey, eachKey, function(){
    var ret = Ember.A()

    this.get(dependentKey).forEach(function(item){
      var key = groupBy(item)
      var group = ret.findBy('key', key) || Ember.Object.create({key: key, count: 0, items: Ember.A()})
      if(!ret.contains(group)) {
        ret.pushObject(group)
      }

      group.incrementProperty('count')
      group.items.pushObject(item)
    })

    return ret
  })
}