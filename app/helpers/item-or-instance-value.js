import Ember from 'ember';

const { Helper } = Ember;

export function itemOrInstanceValue([item, key]) {
    if (item.get('instance')) {
        return item.get('instance').get(key);
    }
    else {
        return item.get(key);
    }
}

export default Helper.helper(function (params) {
	return itemOrInstanceValue(params);
});
