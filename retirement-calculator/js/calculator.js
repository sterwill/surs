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

function calculate() {
	var input = getInput();

	if (validate(input)) {
		$('table#results').stop().fadeTo('fast', 1);

		var output = calculateOutput(input);

		var tbody = $('table#results tbody');
		tbody.empty();

		for ( var i = 0; i < output.years.length; i++) {
			var year = output.years[i];

			var tr = $('<tr>');
			tr.appendTo(tbody);

			var tdAge = $('<td>');
			tdAge.appendTo(tr);
			tdAge.text(year.age);

			var tdSalary = $('<td>');
			tdSalary.appendTo(tr);
			tdSalary.text(formatDollars(year.salary));

			var tdAnnuity = $('<td>');
			tdAnnuity.appendTo(tr);
			tdAnnuity.text(formatDollars(year.annuity));

			var tdEmployeeContribution = $('<td>');
			tdEmployeeContribution.appendTo(tr);
			tdEmployeeContribution.text(formatDollars(year.employeeContribution));

			var tdStateContribution = $('<td>');
			tdStateContribution.appendTo(tr);
			tdStateContribution.text(formatDollars(year.stateContribution));

			var tdSursEarnings = $('<td>');
			tdSursEarnings.appendTo(tr);
			tdSursEarnings.text(formatDollars(year.sursEarnings));

			var tdRetirementFundBalance = $('<td>');
			tdRetirementFundBalance.appendTo(tr);
			tdRetirementFundBalance.text(formatDollars(year.retirementFundBalance));
		}

	} else {
		$('table#results').stop().fadeTo('slow', .25);
	}
}

function calculateOutput(input) {
	var output = {};
	output.years = []

	output.years.push({
		"age" : 1,
		"salary" : 2,
		"annuity" : 3,
		"employeeContribution" : 4,
		"stateContribution" : 5,
		"sursEarnings" : 6,
		"retirementFundBalance" : 7
	})

	return output;
}

function formatDollars(value) {
	var regex = /(\d+)(\d{3})/;
	var result = ((isNaN(value) ? 0 : Math.abs(value)).toFixed(2)) + '';

	while (regex.test(result) && options.group) {
		result = result.replace(regex, '$1,$2');
	}

	return (value < 0 ? '-' : '') + '$' + result;
}
