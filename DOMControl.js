// DOM Events
document.addEventListener("DOMContentLoaded", function(){
	
	// Close panel
	var closeButtons = document.querySelectorAll('.closePanel');
	Array.prototype.forEach.call(closeButtons, function(button) {
		button.addEventListener('click', function() {
			var target = document.querySelector(button.dataset.target);
			var show = target.classList.contains('hidden');
			if (show) {
				target.classList.remove('hidden');
				button.classList.add('chevron-up');
			} else {
				target.classList.add('hidden');
				button.classList.remove('chevron-up');
			}
		});
	});
	
	// Add subject
	var addSubjectButton = document.querySelector('#addSubject');
	addSubjectButton.addEventListener("click", function() {

		var subjectName = document.querySelector('#subjectName');
		var subjectSchedules = document.querySelector('#subjectSchedules');
		
		// Clear errors
		subjectName.classList.remove('hasError');
		subjectSchedules.classList.remove('hasError');

		// Validate empty fields
		if (!subjectName.value) {
			subjectName.classList.add('hasError');
			return;
		}

		if (!subjectSchedules.value) {
			subjectSchedules.classList.add('hasError');
			return;
		}

		// Add subject
		var newSubject = new Subject({
			name: subjectName.value,
			schedules: subjectSchedules.value
		});

		// Add to DOM
		foundSubjectsController.addSubject(newSubject);

		// Empty form
		subjectName.value = "";
		subjectSchedules.value = "";

		// Start process
		inscription.subjects.push(newSubject);
		inscription.generateAlternatives();
		foundAlternativesController.generateDOM();
	});

	// Filter turns
	var turnCheckboxes = document.querySelectorAll('.alternatives .filters.turns input');
	Array.prototype.forEach.call(turnCheckboxes, function(turnCheckbox) {
		turnCheckbox.addEventListener('change', function() {
			var turns = {
				m: document.getElementById('m').checked,
				t: document.getElementById('t').checked,
				n: document.getElementById('n').checked
			};

			inscription.availableTurns = turns;
			inscription.generateAlternatives();
			foundAlternativesController.generateDOM();
		});
	});

	//Filter Days
	var dayCheckboxes = document.querySelectorAll('.alternatives .filters.days input');
	Array.prototype.forEach.call(dayCheckboxes, function(dayCheckbox) {
		dayCheckbox.addEventListener('change', function() {
			var days = {
				Lu: document.querySelector('.alternatives .filters.days input#Lu').checked,
				Ma: document.querySelector('.alternatives .filters.days input#Ma').checked,
				Mi: document.querySelector('.alternatives .filters.days input#Mi').checked,
				Ju: document.querySelector('.alternatives .filters.days input#Ju').checked,
				Vi: document.querySelector('.alternatives .filters.days input#Vi').checked,
				Sa: document.querySelector('.alternatives .filters.days input#Sa').checked
			};

			inscription.availableDays = days;
			inscription.generateAlternatives();
			foundAlternativesController.generateDOM();
		});
	});

	// Filter days and turns
	var filterDaysAndTurnsButton = document.getElementById('filterDaysAndTurns');
	filterDaysAndTurnsButton.addEventListener('click', function() {
		// Mostrar filtro de días y turnos
	});
});
