import Model from 'ember-data/model'
import attr from 'ember-data/attr'
import computed, { oneWay } from 'ember-computed-decorators'
import { belongsTo } from 'ember-computed-decorators/ember-data'

const computePos = function (item, day) {
    const from = moment(item.get('budget.from'), 'YYYY-MM-DD').unix()
    const to = moment(item.get('budget.to'), 'YYYY-MM-DD').unix()
    const timestamp = moment(day).unix()
    const max = to - from
    return 100 * ( (timestamp - from) / max )
}

export default Model.extend({
	sum: attr('number'),
	title: attr('string'),
    enabled: attr('boolean', { defaultValue: true }),
    repeat: attr('string'),
	day: attr('string'),

    @belongsTo category,
    @belongsTo scenario,
    
    @computed('day')
    date (day) {
        return moment(day)
    },

    @computed('day')
    month (day) {
        return day.slice(0, -3)
    },
    
    @computed('date')
    timestamp (date) {
        return date.add(1, 'hours').unix()
    },
    
    @computed('day', 'budget.{from,to}')
    percentil (day) {
        return computePos(this, day)
    },

    @oneWay('category.show')
    show,
})
