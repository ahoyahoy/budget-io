import Ember from 'ember';
import _ from 'lodash/lodash';
import moment from 'moment';

const {
	Component,
	inject: {service},
	computed,
	observer
} = Ember;

const computePos = function (item, day) {
    const from = moment(item.get('budget.from')).unix()
    const to = moment(item.get('budget.to')).unix()
    const timestamp = moment(day).unix()
    const max = to - from
    return 100 * ( (timestamp - from) / max )
}

export default Component.extend({
	classNames: 'timeline-item'.w(),
	classNameBindings: ['item.instance:is-instance', 'item.enabled:enabled:disabled'],

	posDidChange: observer('item.pos', function () {
		const item = this.get('item')
		let pos = item.get('pos')
		if (item.get('instance')) {
			const day = item.get('instance.day')
			pos = computePos(item, day)
		}
		this.$().css('left', pos + '%')
	}),

	didRender () {
		const item = this.get('item')
		const grid = this.get('grid')
		const from = moment(this.get('from'))
		
		let pos = item.get('pos')
		if (item.get('instance')) {
			pos = computePos(item.get('instance'), item.get('day'))
		}
		this.set('title', item.get('title') || item.get('instance.title'))
		
		this.$()
			.css('left', pos + '%')
			.data('item', item)
			.draggable({
				axis: 'x',
				containment: 'parent',
				//grid: [grid, grid], //TODO!!!!!!!!
				stop: function() {
					const $this = $(this)
					const left = $this.position().left
					const pos = Math.round(left / grid)
					const timestamp = pos *24*60*60 + from.unix()
					const day = moment.unix(timestamp).format('YYYY-MM-DD')
					$this.data('item').set('day', day)
					$this.data('item').save()
				}
			})
			.on('mouseover', () => {
				const timestamp = moment(this.get('item.day')).unix()
				this.sendAction('mouseOver', timestamp)
			})
	}
});