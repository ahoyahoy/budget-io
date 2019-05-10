import Ember from 'ember'

const {
	Component,
    computed
} = Ember

export default Component.extend({
    init () {
        this._super(...arguments)
        this.sendAction('update', this.get('value'))
    },

    actions: {
        change(d) {
            const date = moment(d).format('YYYY-MM-DD')
            this.sendAction('update', date)
        }
    }
})
