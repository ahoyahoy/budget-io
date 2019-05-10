import Ember from 'ember'
import groupBy from '../../../utils/group-by'

const {
	Component,
    computed,
    observer
} = Ember

export default Ember.Component.extend({
    groupedContent: groupBy('data.[]', 'data.@each.sum', function(item){
        return item.get('day')
    }),

    groups: computed('groupedContent.@each.items.[]', function() {
        const groupedContent = this.get('groupedContent')
        groupedContent.map((group) => {
            const items = group.get('items')
            const showCount = items.filter(item => item.get('show'))
            group.set('showCount', showCount.length)
        })
        return groupedContent
    })
})