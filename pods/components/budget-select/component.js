import Ember from 'ember'

const {
	Component,
    computed,
    observer,
    inject: { service },
    run
} = Ember

export default Component.extend({
    store: service(),
    session: service(),
    router: service(),

    owner: computed.oneWay('session.uid'),
    user: computed.alias('session.user'),

    newBudget: computed('owner', function () {
        return {
            owner: this.get('owner')
        }
    }),


    budgets: computed(function() {
        return this.get('store').query('budget', {
			orderBy: 'owner/',
            equalTo: this.get('owner')
		})
    }),

    budgetsDidLoaded: observer('budgets', function () {
        this.set('selectedBudget', this.get('budgets').get('firstObject'))
    }),
/*
    selectedBudgetDidChange: observer('selectedValue', function () {
        const selectedValue = this.get('selectedValue')
        if (selectedValue.id === 'new') {
            this.send('newBudget')
            return { title: 'PIC' }
        }
        else if (selectedValue.id === 'import') {
            console.log('import')
        }
        else {
            run.next(() => {
                this.set('selectedBudget', selectedValue)
            })
        }
        console.log('selectedValue', selectedValue)
    }),
/*
    datesDidChange: observer('selectedBudget.from', 'selectedBudget.to', function () {
        console.log('>>>', this.get('selectedBudget'))
        this.get('selectedBudget').save()
    }),
*/
    actions: {
        newBudget () {
            this.set('showDialog', true)
        },

        closeDialog(action) {

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
