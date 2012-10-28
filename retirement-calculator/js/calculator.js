function getInput() {
	// All inputs are strings to avoid using Javascript numbers in calculations
	var input = {}
	input.ageJoined = $('#age_joined').val();
	input.ageRetired = $('#age_retired').val();
	input.ageDeath = $('#age_death').val();
	input.startingSalary = parseDollars($('#start_salary').val());
	input.employeeContribution = parsePercent($('#employee_contribution').val());
	input.stateContribution = parsePercent($('#state_contribution').val());
	input.annualSalaryIncrease = parsePercent($('#annual_salary_increase').val());
	input.sursNetEarnings = parsePercent($('#surs_net_earnings').val());
	input.annualRetirementIncrease = parsePercent($('#annual_retirement_increase').val());
	return input;
}

function fadeToggle(jObject, visible, duration, easing, callback) {
	if (jObject.is(':visible') != visible) {
		jObject.fadeToggle(duration, easing, callback);
	}
}

function validate(input) {
	var problems = [];

	// We can use Javascript numbers for validation
	var min_age = 10;
	var min_salary = 2000;
	var min_age_retired = 55;

	if (parseInt(input.ageJoined) < min_age) {
		problems.push("The age you joined SURS must be at least " + min_age);
	}
	if (parseInt(input.startingSalary) < min_salary) {
		problems.push("Your starting salary must be at least " + min_salary);
	}
	if (parseInt(input.ageRetired) < min_age_retired) {
		problems.push("Your retirement age must be at least " + min_age_retired);
	}
	if (parseInt(input.ageRetired) <= input.ageJoined) {
		problems.push("Your age at retirement must be greater than the age you joined SURS");
	}
	if (parseInt(input.ageDeath) <= input.ageRetired) {
		problems.push("Your age at death must be greater than your retirement age");
	}

	if (problems.length > 0) {
		fadeToggle($('div#problems'), true, 'slow');
		$('ul#problems').empty();
		for ( var i = 0; i < problems.length; i++) {
			var li = $('<li>');
			li.text(problems[i]);
			li.appendTo($('ul#problems'));
		}
	} else {
		fadeToggle($('div#problems'), false, 'fast');
	}

	return problems.length === 0;
}

function recalculate() {
	var input = getInput();

	if (validate(input)) {
		$('table#results').stop().fadeTo('fast', 1);

		var output = calculate(input);

		var tbody = $('table#results tbody');
		tbody.empty();

		for ( var i = 0; i < output.years.length; i++) {
			var year = output.years[i];

			var tr = $('<tr>');
			if (year.age >= parseInt(input.ageRetired)) {
				tr.addClass('in-retirement');
			}

			var tdAge = $('<td>');
			tdAge.text(year.age);
			tdAge.appendTo(tr);

			var tdSalary = $('<td>');
			tdSalary.text(formatDollars(year.salary));
			tdSalary.appendTo(tr);

			var tdAnnuity = $('<td>');
			tdAnnuity.text(formatDollars(year.annuity));
			tdAnnuity.appendTo(tr);

			var tdEmployeeContribution = $('<td>');
			tdEmployeeContribution.text(formatDollars(year.employeeContribution));
			tdEmployeeContribution.appendTo(tr);

			var tdStateContribution = $('<td>');
			tdStateContribution.text(formatDollars(year.stateContribution));
			tdStateContribution.appendTo(tr);

			var tdSursEarnings = $('<td>');
			tdSursEarnings.text(formatDollars(year.sursEarnings));
			tdSursEarnings.appendTo(tr);

			var tdRetirementFundBalance = $('<td>');
			tdRetirementFundBalance.text(formatDollars(year.retirementFundBalance));
			tdRetirementFundBalance.appendTo(tr);

			tr.appendTo(tbody);
		}

	} else {
		$('table#results').stop().fadeTo('slow', .25);
	}
}

function tier1Table() {
	// From SURS Traditional Benefit Member Guide
	// (http://surs.org/pdfs/mem_guide/Guide-TRD.pdf),
	// "2.2% General Formula Table (Tier I)"

	// Strings are used instead of Javascript numbers for accurate math with
	// BigDecimal

	// Key is years of service, columns are for age groups:
	// 62, 60+, 59, 58, 57, 56, 55
	var table = {
		5 : [ '11.00', '0', '0', '0', '0', '0', '0' ],
		6 : [ '13.20', '0', '0', '0', '0', '0', '0' ],
		7 : [ '15.40', '0', '0', '0', '0', '0', '0' ],
		8 : [ '0', '17.60', '16.54', '15.49', '14.43', '13.38', '12.32' ],
		9 : [ '0', '19.80', '18.61', '17.42', '16.24', '15.05', '13.86' ],
		10 : [ '0', '22.00', '20.68', '19.36', '18.04', '16.72', '15.40' ],
		11 : [ '0', '24.20', '22.75', '21.30', '19.84', '18.39', '16.94' ],
		12 : [ '0', '26.40', '24.82', '23.23', '21.65', '20.06', '18.48' ],
		13 : [ '0', '28.60', '26.88', '25.17', '23.45', '21.74', '20.02' ],
		14 : [ '0', '30.80', '28.95', '27.10', '25.26', '23.41', '21.56' ],
		15 : [ '0', '33.00', '31.02', '29.04', '27.06', '25.08', '23.10' ],
		16 : [ '0', '35.20', '33.09', '30.98', '28.86', '26.75', '24.64' ],
		17 : [ '0', '37.40', '35.16', '32.91', '30.67', '28.42', '26.18' ],
		18 : [ '0', '39.60', '37.22', '34.85', '32.47', '30.10', '27.72' ],
		19 : [ '0', '41.80', '39.29', '36.78', '34.28', '31.77', '29.26' ],
		20 : [ '0', '44.00', '41.36', '38.72', '36.08', '33.44', '30.80' ],
		21 : [ '0', '46.20', '43.43', '40.66', '37.88', '35.11', '32.34' ],
		22 : [ '0', '48.40', '45.50', '42.59', '39.69', '36.78', '33.88' ],
		23 : [ '0', '50.60', '47.56', '44.53', '41.49', '38.46', '35.42' ],
		24 : [ '0', '52.80', '49.63', '46.46', '43.30', '40.13', '36.96' ],
		25 : [ '0', '55.00', '51.70', '48.40', '45.10', '41.80', '38.50' ],
		26 : [ '0', '57.20', '53.77', '50.34', '46.90', '43.47', '40.04' ],
		27 : [ '0', '59.40', '55.84', '52.27', '48.71', '45.14', '41.58' ],
		28 : [ '0', '61.60', '57.90', '54.21', '50.51', '46.82', '43.12' ],
		29 : [ '0', '63.80', '59.97', '56.14', '52.32', '48.49', '44.66' ],
		30 : [ '0', '66.00', '62.04', '58.08', '54.12', '50.16', '46.20' ],
		31 : [ '0', '68.20', '64.11', '60.02', '55.92', '51.83', '47.74' ],
		32 : [ '0', '70.40', '66.18', '61.95', '57.73', '53.50', '49.28' ],
		33 : [ '0', '72.60', '68.24', '63.89', '59.53', '55.18', '50.82' ],
		34 : [ '0', '74.80', '74.80', '74.80', '74.80', '74.80', '74.80' ],
		35 : [ '0', '77.00', '77.00', '77.00', '77.00', '77.00', '77.00' ],
		36 : [ '0', '79.20', '79.20', '79.20', '79.20', '79.20', '79.20' ],
		37 : [ '0', '80.00', '80.00', '80.00', '80.00', '80.00', '80.00' ]
	};

	return table;
}

/**
 * Gets string value of the annuity rate for the specified years of service and
 * retirement age for a Tier 1 employee.
 */
function getTier1AnnuityRate(yearsOfService, retirementAge) {
	if (yearsOfService < 5) {
		return '0';
	}
	if (yearsOfService > 37) {
		yearsOfService = 37;
	}

	var line = tier1Table()[yearsOfService];

	switch (retirementAge) {
	case 55:
		return line[6];
	case 56:
		return line[5];
	case 57:
		return line[4];
	case 58:
		return line[3];
	case 59:
		return line[2];
	case 62:
		return line[0];
	default:
		return line[1];
	}

}

function mathContext() {
	// DECIMAL64 specifies HALF_EVEN rounding
	return new window.MathContext.DECIMAL64();
}

function bd(value) {
	return new window.BigDecimal(value + '', mathContext()).setScale(8, window.RoundingMode.HALF_EVEN());
}

function calculate(input) {
	var output = {};

	// Use this context in all operations
	var mc = mathContext();

	var zero = bd('0');
	var one = bd('1');
	var oneHundred = bd('100');

	// Ages can stay a Javascript number
	var ageJoined = parseInt(input.ageJoined);
	var ageRetired = parseInt(input.ageRetired);
	var ageDeath = parseInt(input.ageDeath);

	// Convert the inputs strings to BigIntegers
	var startingSalary = bd(input.startingSalary);
	var annualSalaryIncrease = bd(input.annualSalaryIncrease).divide(oneHundred, mc).add(one, mc);
	var employeeContribution = bd(input.employeeContribution).divide(oneHundred, mc);
	var stateContribution = bd(input.stateContribution).divide(oneHundred, mc);
	var sursNetEarnings = bd(input.sursNetEarnings).divide(oneHundred, mc);
	var annualRetirementIncrease = bd(input.annualRetirementIncrease).divide(oneHundred, mc).add(one, mc);

	output.finalAverageEarnings = zero;
	output.finalAverageEarningsYears = 0;

	output.years = []
	for ( var y = 0; y <= ageDeath - ageJoined; y++) {
		yearData = {};
		yearData.age = ageJoined + y;

		if (y === 0) {
			yearData.salary = bd(startingSalary);
			yearData.annuity = zero;
			yearData.employeeContribution = yearData.salary.multiply(employeeContribution, mc);
			yearData.stateContribution = yearData.salary.multiply(stateContribution, mc);
			yearData.sursEarnings = zero;
			yearData.retirementFundBalance = yearData.employeeContribution.add(yearData.stateContribution, mc);

		} else {
			lastYearData = output.years[y - 1];
			if (yearData.age < ageRetired) {
				yearData.annuity = zero;
				yearData.salary = lastYearData.salary.multiply(annualSalaryIncrease, mc);
				yearData.employeeContribution = yearData.salary.multiply(employeeContribution, mc);
				yearData.stateContribution = yearData.salary.multiply(stateContribution, mc);
				yearData.sursEarnings = lastYearData.retirementFundBalance.multiply(sursNetEarnings, mc);
				yearData.retirementFundBalance = lastYearData.retirementFundBalance.add(yearData.employeeContribution,
						mc).add(yearData.stateContribution, mc).add(yearData.sursEarnings, mc);
			} else {

			}
		}

		// Sum the last four working years' salaries
		if (yearData.age >= ageRetired - 4 && yearData.age < ageRetired) {
			output.finalAverageEarnings = output.finalAverageEarnings.add(yearData.salary, mc);
			output.finalAverageEarningsYears++;
		}

		output.years.push(yearData);
	}

	output.finalAverageEarnings = output.finalAverageEarnings.divide(bd(output.finalAverageEarningsYears + ''), mc)
			+ '';

	return output;
}

/**
 * Formats a BigDecimal as an integer.
 */
function formatInteger(value) {
	return value.setScale(0, window.RoundingMode.HALF_EVEN()) + '';
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