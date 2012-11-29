/**
 * Gets the current page's query parameters as an object (map).
 */
function getQueryParams() {
	var pairs = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	var params = []
	for ( var i = 0; i < pairs.length; i++) {
		var pair = pairs[i].split('=');
		var key = decodeURIComponent(pair[0]);
		var value = decodeURIComponent(pair[1]);
		params.push(key);
		params[key] = value;
	}
	return params;
}

/**
 * Makes a query string from the properties in the specified object (map).
 */
function makeQueryString(map) {
	var query = '';
	for ( var key in map) {
		if (query.length > 0) {
			query += '&';
		}
		query += encodeURIComponent(key) + '=' + encodeURIComponent(map[key]);
	}
	return query;
}

/**
 * Toggles the visibility of a jQuery object.
 */
function fadeToggle(jObject, visible, duration, easing, callback) {
	if (jObject.is(':visible') != visible) {
		jObject.fadeToggle(duration, easing, callback);
	}
}

/**
 * Formats a BigDecimal as a number.
 */
function formatNumber(value, scale) {
	return parseFloat(value.setScale(scale, roundingMode()));
}

/**
 * Formats a BigDecimal as an integer.
 */
function formatInteger(value) {
	return value.setScale(0, roundingMode()) + '';
}

/**
 * Formats a BigDecimal as a percentage.
 */
function formatPercent(value) {
	return value.multiply(bd('100')).setScale(2, roundingMode()) + '%';
}

/**
 * Formats a BigDecimal as a dollar string like '$1,000.00'.
 */
function formatDollars(value, points) {
	// return value + '';
	if (points === null) {
		points = 0;
	}

	var regex = /(\d+)(\d{3})/;
	var result = ((isNaN(value) ? 0 : Math.abs(value)).toFixed(points)) + '';

	while (regex.test(result)) {
		result = result.replace(regex, '$1,$2');
	}

	return (value < 0 ? '-' : '') + '$' + result;
}

/**
 * Function adapted from http://www.reignwaterdesigns.com/ad/tidbits/ordinal/.
 * Copyright Addam Driver 2008.
 */
function formatOrdinalHtml(num) {
	var modOneHundred = num % 100;
	var modTen = num % 10;
	var ord;

	if ((modOneHundred - modTen) == 10) {
		ord = 'th';
	} else {
		switch (modTen) {
		case 1:
			ord = 'st';
			break;
		case 2:
			ord = 'nd';
			break;
		case 3:
			ord = 'rd';
			break;
		default:
			ord = 'th';
			break;
		}
	}
	return num + '<sup>' + ord + '<\/sup>';
}

/**
 * Parses a string like '$1,000.00" into a string like '1000.00' for BigDecimal
 * to consume.
 */
function parseDollars(value) {
	return value.replace('$', '').replace(',', '');
}

/**
 * Parses a string like '5.25%' into a string like '5.25' for BigDecimal to
 * consume.
 */
function parsePercent(value) {
	return value.replace("%", '');
}