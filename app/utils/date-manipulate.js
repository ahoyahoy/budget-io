const plusPeriod = function (period, n, date) {
	const periods = {
		d: 'days',
		w: 'weeks',
		m: 'months',
		y: 'years'
	}
	if (periods[period]) {
		return date.add(periods[period], n)
	}
	else {
		return false
	}
}

export {
  plusPeriod
}
