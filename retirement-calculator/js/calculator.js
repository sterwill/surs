function getData() {
	var data = {}

	data.age_joined = parseInt($('#age_joined').val());
	data.starting_salary = $('#start_salary').spinner("value");
	data.age_retired = parseInt($('#age_retired').val());
	data.state_match = $('#state_match').spinner("value");

	data.annual_salary_increase = $('#annual_salary_increase').spinner("value");
	data.age_death = parseInt($('#age_death').val());
	data.personal_contribution = $('#personal_contribution').spinner("value");
	data.surs_net_earnings = $('#surs_net_earnings').spinner("value");
	data.annual_retirement_increase = $('#annual_retirement_increase').spinner("value");

	return data;
}

function validateAllInputs() {
	$('div#problems').hide();
	$('ul#problems').empty();

	var data = getData();

	var problems = [];

	var min_age = 10;
	var min_salary = 2000;
	var min_age_retired = 10;
	var min_age_death = 10;

	if (data.age_joined < min_age) {
		problems.push("The age you joined SURS must be at least " + min_age);
	}
	if (data.starting_salary < min_salary) {
		problems.push("Your starting salary must be at least " + min_salary);
	}
	if (data.age_retired < min_age_retired) {
		problems.push("Your retirement age must be at least " + min_age_retired);
	}
	if (data.age_retired <= data.age_joined) {
		problems.push("Your age at retirement must be greater than the age you joined SURS");
	}
	if (data.state_match < 0 || data.state_match > 100) {
		problems.push("The state match percentage must be between 0% and 100%");
	}

	if (data.age_death < min_age_death) {
		problems.push("Your age at death must be at least " + min_age_death);
	}
	if (data.age_death <= data.age_retired) {
		problems.push("Your age at death must be greater than your retirement age");
	}

	if (problems.length > 0) {
		$('div#problems').show();
		for ( var i = 0; i < problems.length; i++) {
			var li = $('<li>');
			li.text(problems[i]);
			li.appendTo($('ul#problems'));
		}
	}
}