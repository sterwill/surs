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
	
	return problems;
}
