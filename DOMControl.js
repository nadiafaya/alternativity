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
		inscription.persist();
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
				Lu: document.getElementById('Lu').checked,
				Ma: document.getElementById('Ma').checked,
				Mi: document.getElementById('Mi').checked,
				Ju: document.getElementById('Ju').checked,
				Vi: document.getElementById('Vi').checked,
				Sa: document.getElementById('Sa').checked
			};

			inscription.availableDays = days;
			inscription.generateAlternatives();
			foundAlternativesController.generateDOM();
		});
	});

	// Filter days and turns
	var switchGlobalAndAdvancedFiltersButton = document.getElementById('switchGlobalAndAdvancedFilters');
	switchGlobalAndAdvancedFiltersButton.addEventListener('click', function() {
		// Toggle global filters
		toggleFilter('globalFilters');
		// Toggle advanced filter
		toggleFilter('advancedFilters');
		// Switch button text
		var button = switchGlobalAndAdvancedFiltersButton;
		var oldText = button.innerText;
		button.innerText = button.dataset.backuptext;
		button.dataset.backuptext = oldText;
	});

	var toggleFilter = function(filterId) {
		var filter = document.getElementById(filterId);
		if (filter.classList.contains('hidden')) {
			filter.classList.remove('hidden');
		} else {
			filter.classList.add('hidden');
		}
	};

	//Advanced filter
	var dayAndTurnCheckboxes = document.querySelectorAll('.alternatives .filters.daysAndTurns input');
	Array.prototype.forEach.call(dayAndTurnCheckboxes, function(dayAndTurnCheckbox) {
		dayAndTurnCheckbox.addEventListener('change', function() {
			var day = dayAndTurnCheckbox.dataset.day;
			var turn = dayAndTurnCheckbox.dataset.turn;
			inscription.availableTurnsInDays[day][turn] = dayAndTurnCheckbox.checked;
			inscription.generateAlternatives();
			foundAlternativesController.generateDOM();
		});
	});

	// Load the subjects stored on local storage
	if(inscription.isPersisted()) {
		inscription.loadFromStorage();
		inscription.subjects.forEach(function(subject) {
			// remove persisted subject colors
			subjectColors.getColor();
			foundSubjectsController.addSubject(subject);
		});
		inscription.generateAlternatives();
		foundAlternativesController.generateDOM();			
	}
});
