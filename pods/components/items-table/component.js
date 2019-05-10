import Ember from 'ember';
import ColumnDefinition from 'ember-table/models/column-definition';

export default Ember.Component.extend({
	tableColumns: Ember.computed(function() {
		var dateColumn = ColumnDefinition.create({
			savedWidth: 150,
			textAlign: 'text-align-left',
			headerCellName: 'Date',
			getCellContent: function(row) {
				return moment.unix(row.get('timestamp'));
			}
		});
		var sumColumn = ColumnDefinition.create({
			savedWidth: 100,
			headerCellName: 'Sum',
			getCellContent: function(row) {
				return row.get('sum').toFixed(2);
			}
		});
		return [dateColumn, sumColumn];
	}),

	tableContent: Ember.computed('items', 'items.@each.show', function() {
		const items = this.get('items');
		const x = items.filter((item) => {
			console.log('>', item.get('show'))
			return item.get('show');
		});
		console.log('x',x);
		return x;
	})
});
