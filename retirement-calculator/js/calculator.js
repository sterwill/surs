function getInput() {
	var input = {}

	input.age_joined = parseInt($('#age_joined').val());
	input.starting_salary = $('#start_salary').spinner("value");
	input.age_retired = parseInt($('#age_retired').val());
	input.state_match = $('#state_match').spinner("value");

	input.annual_salary_increase = $('#annual_salary_increase').spinner("value");
	input.age_death = parseInt($('#age_death').val());
	input.personal_contribution = $('#personal_contribution').spinner("value");
	input.surs_net_earnings = $('#surs_net_earnings').spinner("value");
	input.annual_retirement_increase = $('#annual_retirement_increase').spinner("value");

	return input;
}

function validate() {
	$('div#problems').hide();
	$('ul#problems').empty();

	var input = getInput();

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
		$('div#problems').show();
		for ( var i = 0; i < problems.length; i++) {
			var li = $('<li>');
			li.text(problems[i]);
			li.appendTo($('ul#problems'));
		}
	}
}

calculate()
{
	var input = getInput();
	
	
}