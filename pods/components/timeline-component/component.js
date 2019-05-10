import Ember from 'ember';

const {
	Component,
	computed,
	observer
} = Ember;

export default Ember.Component.extend({
	classNames: 'timeline-component'.w(),

	grid: computed('budget.from', 'budget.to', 'chartWidth', function () {
		const chartWidth = this.get('chartWidth');
		if (chartWidth) {
			const from = moment(this.get('budget.from'))
			const to = moment(this.get('budget.to'))
			const range = moment.range(from, to)
			let days = 0;
			range.by('day', () => {
				days++
			});
			const day = chartWidth / days
			return (chartWidth - day) / (days - 1) // protoze kurzor dne je v pulce, takze musim dve pulky na zacatku a na konci odecist
		}
		else {
			return null
		}
		
	}),

	widthDidChange: Ember.on('init', observer('width', 'grid', function () {
		Ember.run.next(() => {
			const width = this.get("width");
			const grid = this.get("grid");
			this.$().css("width", width - 5 + "px");
			console.log("g", grid);
			this.$().find("div").first().css({
				"margin-left": grid / 2,
				"margin-right": grid / 2
			});

		})
	})),

	filteredItems: computed.filter('items', function (item) {
		const category = this.get('category')
		return (item.get('enabled') && (item.get('category.id') === category || item.get('instance.category.id') === category))
	}),

	mouseEnter () {
        this.set('hoverChart', 'timeline')
    },

	actions: {
		itemMouseOver(pos) {
			this.sendAction('timelineItemMouseOver', pos)
		}
	}
});