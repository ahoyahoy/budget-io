import Ember from 'ember';

const { Helper } = Ember;

export function unixDate([timestamp]) {
	return moment.unix(timestamp);
}

export default Helper.helper(function (params) {
	return unixDate(params);
});
