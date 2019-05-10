import Ember from 'ember';
import _ from 'lodash/lodash';
import moment from 'moment';

const {
	Component,
	inject: {service},
	computed,
	observer
} = Ember;

export default Component.extend({
    makeData: observer('items', _.debounce(function () {
		// create a DataSet with items
        var items = new vis.DataSet({
            start: new Date(2010, 7, 15),
            end: new Date(2010, 8, 2),  // end is optional
            content: [
                {id: 1, content: 'Editable', editable: true, start: '2010-08-23'},
                {id: 2, content: 'Editable', editable: true, start: '2010-08-23T23:00:00'},
                {id: 3, content: 'Read-only', editable: false, start: '2010-08-24T16:00:00'}
            ]
        });

        var container = document.getElementById('timelinediv');
        var options = {
            editable: true,
            zoomable: false
        };

        var timeline = new vis.Timeline(container, items, options);

    }, 1000))

});