import Ember from 'ember';
import _ from 'lodash/lodash';

const {
	Component,
    computed,
    observer
} = Ember;

export default Component.extend({
    classNames: 'item'.w(),

    editable: false,

    isShowDidChange: observer('item.show', function () {
        this.send('save');
    }),

    actions: {
        edit() {
            this.set('editable', true);
        },
        done() {
            this.set('editable', false);
        },
        destroy() {
            this.get('item').destroyRecord().then(() => {
                this.get('budget').save();
            });
        },
        save() {
            this.set('editable', false);
            this.get('item').save();
        }
    },

    colors: [
        { value:'#f44336', title:'Red' },
        { value:'#e91e63', title:'Pink' },
        { value:'#9c27b0', title:'Purple' },
        { value:'#673ab7', title:'Deep Purple' },
        { value:'#3f51b5', title:'Indigo' },
        { value:'#2196f3', title:'Blue' },
        { value:'#03a9f4', title:'Light Blue' },
        { value:'#00bcd4', title:'Cyan' },
        { value:'#009688', title:'Teal' },
        { value:'#4caf50', title:'Green' },
        { value:'#8bc34a', title:'Light Green' },
        { value:'#cddc39', title:'Lime' },
        { value:'#ffeb3b', title:'Yellow' },
        { value:'#ffc107', title:'Amber' },
        { value:'#ff9800', title:'Orange' },
        { value:'#ff5722', title:'Deep Orange' },
        { value:'#795548', title:'Brown' },
        { value:'#9e9e9e', title:'Grey' },
        { value:'#607d8b', title:'Blue Grey' },
    ],
    colorItem: Ember.computed('item.color', function () {
		const item = this.get('item');
		const colors = this.get('colors');
        console.log('!KILLER', colors, item, item.toJSON(), item.get('color'), _.filter(colors, { id: item.get('color') }));

		if (item) {
			return _.filter(colors, { id: item.get('color') })[0];
		}
		else {
			return null;
		}
	}),
    colorDidChange: observer('colorItem', function() {
        const color = this.get('colorItem.id');
        const item = this.get('item');
        item.set('color', color);
        item.save();
    })
});