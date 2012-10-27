function getInput() {
	var input = {}

	input.age_joined = parseInt($('#age_joined').val());
	input.starting_salary = $('#start_salary').spinner("value");
	input.age_retired = parseInt($('#age_retired').val());
	input.state_match = $('#state_match').spinner("value");

	input.annual_salary_increase = $('#annual_salary_increase').spinner("value");
	input.age_death = parseInt($('#age_death').val());
	input.employee_contribution = $('#employee_contribution').spinner("value");
	input.surs_net_earnings = $('#surs_net_earnings').spinner("value");
	input.annual_retirement_increase = $('#annual_retirement_increase').spinner("value");

	return input;
}

function fadeToggle(jObject, visible, duration, easing, callback) {
	if (jObject.is(':visible') != visible) {
		jObject.fadeToggle(duration, easing, callback);
	}
}

function validate(input) {
	var problems = [];

	var min_age = 10;
	var min_salary = 2000;
	var min_age_retired = 10;
	var min_age_death = 10;

	if (input.age_joined < min_age) {
		problems.push("The age you joined SURS must be at least " + min_age);
	}
	if (input.starting_salary < min_salary) {
		problems.push("Your starting salary must be at least " + min_salary);
	}
	if (input.age_retired < min_age_retired) {
		problems.push("Your retirement age must be at least " + min_age_retired);
	}
	if (input.age_retired <= input.age_joined) {
		problems.push("Your age at retirement must be greater than the age you joined SURS");
	}
	if (input.state_match < 0 || input.state_match > 100) {
		problems.push("The state match percentage must be between 0% and 100%");
	}
	if (input.age_death < min_age_death) {
		problems.push("Your age at death must be at least " + min_age_death);
	}
	if (input.age_death <= input.age_retired) {
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

	return problems.length == 0;
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
			if (year.age >= input.age_retired) {
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

	// Key is years of service, columns are for age groups:
	// 62, 60+, 59, 58, 57, 56, 55
	var table = {
		5 : [ 11.00, 0, 0, 0, 0, 0, 0 ],
		6 : [ 13.20, 0, 0, 0, 0, 0, 0 ],
		7 : [ 15.40, 0, 0, 0, 0, 0, 0 ],
		8 : [ 0, 17.60, 16.54, 15.49, 14.43, 13.38, 12.32 ],
		9 : [ 0, 19.80, 18.61, 17.42, 16.24, 15.05, 13.86 ],
		10 : [ 0, 22.00, 20.68, 19.36, 18.04, 16.72, 15.40 ],
		11 : [ 0, 24.20, 22.75, 21.30, 19.84, 18.39, 16.94 ],
		12 : [ 0, 26.40, 24.82, 23.23, 21.65, 20.06, 18.48 ],
		13 : [ 0, 28.60, 26.88, 25.17, 23.45, 21.74, 20.02 ],
		14 : [ 0, 30.80, 28.95, 27.10, 25.26, 23.41, 21.56 ],
		15 : [ 0, 33.00, 31.02, 29.04, 27.06, 25.08, 23.10 ],
		16 : [ 0, 35.20, 33.09, 30.98, 28.86, 26.75, 24.64 ],
		17 : [ 0, 37.40, 35.16, 32.91, 30.67, 28.42, 26.18 ],
		18 : [ 0, 39.60, 37.22, 34.85, 32.47, 30.10, 27.72 ],
		19 : [ 0, 41.80, 39.29, 36.78, 34.28, 31.77, 29.26 ],
		20 : [ 0, 44.00, 41.36, 38.72, 36.08, 33.44, 30.80 ],
		21 : [ 0, 46.20, 43.43, 40.66, 37.88, 35.11, 32.34 ],
		22 : [ 0, 48.40, 45.50, 42.59, 39.69, 36.78, 33.88 ],
		23 : [ 0, 50.60, 47.56, 44.53, 41.49, 38.46, 35.42 ],
		24 : [ 0, 52.80, 49.63, 46.46, 43.30, 40.13, 36.96 ],
		25 : [ 0, 55.00, 51.70, 48.40, 45.10, 41.80, 38.50 ],
		26 : [ 0, 57.20, 53.77, 50.34, 46.90, 43.47, 40.04 ],
		27 : [ 0, 59.40, 55.84, 52.27, 48.71, 45.14, 41.58 ],
		28 : [ 0, 61.60, 57.90, 54.21, 50.51, 46.82, 43.12 ],
		29 : [ 0, 63.80, 59.97, 56.14, 52.32, 48.49, 44.66 ],
		30 : [ 0, 66.00, 62.04, 58.08, 54.12, 50.16, 46.20 ],
		31 : [ 0, 68.20, 64.11, 60.02, 55.92, 51.83, 47.74 ],
		32 : [ 0, 70.40, 66.18, 61.95, 57.73, 53.50, 49.28 ],
		33 : [ 0, 72.60, 68.24, 63.89, 59.53, 55.18, 50.82 ],
		34 : [ 0, 74.80, 74.80, 74.80, 74.80, 74.80, 74.80 ],
		35 : [ 0, 77.00, 77.00, 77.00, 77.00, 77.00, 77.00 ],
		36 : [ 0, 79.20, 79.20, 79.20, 79.20, 79.20, 79.20 ],
		37 : [ 0, 80.00, 80.00, 80.00, 80.00, 80.00, 80.00 ]
	};

	return table;
}

function calculate(input) {
	var output = {};
	output.years = []

	for ( var i = 24; i < 100; i++) {
		output.years.push({
			"age" : i,
			"salary" : 2,
			"annuity" : 3,
			"employeeContribution" : 4,
			"stateContribution" : 5,
			"sursEarnings" : 6,
			"retirementFundBalance" : 7
		});
	}

	return output;
}

function formatDollars(value, points) {
	if (points == null) {
		points = 0;
	}

	var regex = /(\d+)(\d{3})/;
	var result = ((isNaN(value) ? 0 : Math.abs(value)).toFixed(points)) + '';

	while (regex.test(result) && options.group) {
		result = result.replace(regex, '$1,$2');
	}

	return (value < 0 ? '-' : '') + '$' + result;
}
