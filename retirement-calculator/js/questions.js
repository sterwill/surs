function getInput() {
	// All inputs are strings to avoid using Javascript numbers in calculations
	var input = {}
	input.ageJoined = $('#age_joined').val();
	input.ageRetired = $('#age_retired').val();
	input.ageDeath = $('#age_death').val();
	input.startingSalary = parseDollars($('#start_salary').val());
	input.stateContribution = parsePercent($('#state_contribution').val());
	input.annualSalaryIncrease = parsePercent($('#annual_salary_increase').val());
	input.sursNetEarnings = parsePercent($('#surs_net_earnings').val());
	return input;
}

function validate(input) {
	var problems = [];

	// We can use Javascript numbers for validation
	var min_age = 10;
	var min_salary = 1000;
	var max_salary = 106800;
	var min_age_retired = 55;

	if (parseInt(input.ageJoined) < min_age) {
		problems.push("The age the employee joined SURS must be at least " + min_age);
	}
	if (parseInt(input.startingSalary) < min_salary) {
		problems.push("Employee's starting salary must be at least " + min_salary);
	}
	if (parseInt(input.startingSalary) > max_salary) {
		problems.push("Employee's starting salary must be at most " + max_salary);
	}
	if (parseInt(input.ageRetired) < min_age_retired) {
		problems.push("Employee's retirement age must be at least " + min_age_retired);
	}
	if (parseInt(input.ageRetired) <= input.ageJoined) {
		problems.push("Employee's age at retirement must be greater than the age employee joined SURS");
	}
	if (parseInt(input.ageDeath) <= input.ageRetired) {
		problems.push("Employee's age at death must be greater than employee's retirement age");
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
		$('div#table').stop().fadeTo('fast', 1);

		var output = calculate(input);

		var tbody = $('table#results tbody');
		tbody.empty();

		for ( var i = 0; i < output.years.length; i++) {
			var year = output.years[i];

			if (year.age == parseInt(input.ageRetired)) {
				// Insert an additional information row
				makeRetirementYearInfoRow(year, output).appendTo(tbody);
			}

			makeYearRow(input, year).appendTo(tbody);
		}

	} else {
		$('div#table').stop().fadeTo('slow', .25);
	}
}

function tier1Table() {
	// From SURS Traditional Benefit Member Guide
	// (http://surs.org/pdfs/mem_guide/Guide-TRD.pdf),
	// "2.2% General Formula Table (Tier I)"

	// Strings are used instead of Javascript numbers for convenient use with
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
 * Gets string value of the annuity rate as a percentage (like '79.20') for the
 * specified years of service and retirement age for a Tier 1 employee.
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

function roundingMode() {
	return MathContext.prototype.ROUND_HALF_EVEN;
}

function mathContext() {
	return new MathContext(16, MathContext.prototype.PLAIN, false, roundingMode());
}

function bd(value) {
	return new BigDecimal(value);
}

function calculate(input) {
	var output = {};

	// Use this context in all operations
	var mc = mathContext();

	var zero = bd('0');
	var one = bd('1');
	var negativeOne = bd('-1');
	var oneHundred = bd('100');

	// Set by law to 8%
	var employeeContribution = bd('.08');
	// Set by law to 3%
	var annualRetirementIncrease = bd('1.03');
	// Salaray increases after this value are done at 3% by law
	var maxPensionableSalary = bd('106800');
	var maxPensionableSalaryIncrease = bd('1.03');

	// Ages can stay a Javascript number
	var ageJoined = parseInt(input.ageJoined);
	var ageRetired = parseInt(input.ageRetired);
	var ageDeath = parseInt(input.ageDeath);

	// Convert the inputs strings to BigIntegers
	var startingSalary = bd(input.startingSalary);
	var annualSalaryIncrease = bd(input.annualSalaryIncrease).divide(oneHundred, mc).add(one, mc);
	var stateContribution = bd(input.stateContribution).divide(oneHundred, mc);
	var sursNetEarnings = bd(input.sursNetEarnings).divide(oneHundred, mc);

	output.yearsOfService = ageRetired - ageJoined;

	output.annuityRate = bd(getTier1AnnuityRate(output.yearsOfService, ageRetired)).divide(oneHundred, mc);

	output.finalAverageEarnings = zero;
	output.finalAverageEarningsYears = 0;

	output.years = []
	for ( var y = 0; y <= ageDeath - ageJoined; y++) {
		thisYear = {};
		thisYear.age = ageJoined + y;

		if (y === 0) {
			thisYear.salary = startingSalary;
			thisYear.annuity = zero;
			thisYear.employeeContribution = thisYear.salary.multiply(employeeContribution, mc);
			thisYear.stateContribution = thisYear.salary.multiply(stateContribution, mc);
			thisYear.sursEarnings = zero;
			thisYear.retirementFundBalance = thisYear.employeeContribution.add(thisYear.stateContribution, mc);

		} else {
			lastYear = output.years[y - 1];
			if (thisYear.age < ageRetired) {
				thisYear.annuity = zero;

				var salaryIncrease;
				if (lastYear.salary.compareTo(maxPensionableSalary) > 0) {
					salaryIncrease = annualSalaryIncrease
				}
				thisYear.salary = lastYear.salary.multiply(annualSalaryIncrease, mc);
				thisYear.employeeContribution = thisYear.salary.multiply(employeeContribution, mc);
				thisYear.stateContribution = thisYear.salary.multiply(stateContribution, mc);
				thisYear.sursEarnings = lastYear.retirementFundBalance.multiply(sursNetEarnings, mc);
				thisYear.retirementFundBalance = lastYear.retirementFundBalance.add(thisYear.employeeContribution, mc)
						.add(thisYear.stateContribution, mc).add(thisYear.sursEarnings, mc);
			} else {
				thisYear.salary = zero;
				thisYear.employeeContribution = zero;
				thisYear.stateContribution = zero;

				if (thisYear.age === ageRetired) {
					output.finalAverageEarnings = output.finalAverageEarnings.divide(
							bd(output.finalAverageEarningsYears + ''), mc);

					thisYear.annuity = output.finalAverageEarnings.multiply(output.annuityRate, mc);
					thisYear.sursEarnings = lastYear.retirementFundBalance.multiply(sursNetEarnings, mc);
					thisYear.retirementFundBalance = lastYear.retirementFundBalance.add(thisYear.sursEarnings, mc)
							.subtract(thisYear.annuity, mc);
				} else {
					thisYear.annuity = lastYear.annuity.multiply(annualRetirementIncrease, mc);
					thisYear.sursEarnings = lastYear.retirementFundBalance.multiply(sursNetEarnings, mc);
					thisYear.retirementFundBalance = lastYear.retirementFundBalance.add(thisYear.sursEarnings, mc)
							.subtract(thisYear.annuity, mc);

					// If the balance went negative after surs earnings, the
					// state makes up the difference
					if (thisYear.retirementFundBalance.compareTo(zero) < 0) {
						thisYear.stateContribution = thisYear.retirementFundBalance.multiply(negativeOne, mc);
						thisYear.retirementFundBalance = zero;
					}
				}
			}
		}

		// Sum the last four working years' salaries
		if (thisYear.age >= ageRetired - 4 && thisYear.age < ageRetired) {
			output.finalAverageEarnings = output.finalAverageEarnings.add(thisYear.salary, mc);
			output.finalAverageEarningsYears++;
		}

		output.years.push(thisYear);
	}

	return output;
}