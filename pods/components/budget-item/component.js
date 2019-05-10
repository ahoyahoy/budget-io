import Ember from 'ember'

const {
	Component,
    computed,
    observer
} = Ember

export default Ember.Component.extend({
    classNames: ['budget-item'],
    classNameBindings: ['item.enabled:enabled:disabled', 'item.show:show:hidden', 'item.instance:is-instance'],
    //classNameBindings: ['item.showClass:show:hidden'],
    //attributeBindings: ['categoryColor:style'],

    editable: false,

    isEnabledDidChange: observer('item.enabled', function () {
        const enabled = this.get('item.enabled')
        const instance = this.get('item.instance')
        if (!instance) {
            this.send('save')
        }
    }),
/*
    categoryColor: computed('item.category.color', function () {
        const color = this.get('item.category.color')
        return `border-left-color: ${color}`
    }),
*/
    actions: {
        edit() {
            this.set('editable', true)
            this.set('item.height', 300)
            console.log('__c', this.get('item.itemsRef'))
            this.get('item.itemsRef').pushObject(Ember.Object.create({
                type: 'special-empty',
                width: 333,
                height: 1
            }))
        },
        done() {
            this.set('editable', false)
        },
        destroy() {
            this.get('item').destroyRecord().then(() => {
                this.get('budget').save()
            })
        },
        save() {
            this.set('editable', false)
            this.get('item').save()
        }
    }
})