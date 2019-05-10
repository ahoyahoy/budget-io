import Ember from 'ember'   

const { Helper } = Ember

export function dateFromTimestamp([timestamp, format]) {
    if (format) {
        return moment.unix(timestamp).format(format)
    }
    else {
        return moment.unix(timestamp)
    }
}

export default Helper.helper(function (params) {
	return dateFromTimestamp(params)
})
