// DOM Events
document.addEventListener("DOMContentLoaded", function(){
	
	// Switch page
	var navButtons = document.querySelectorAll('.navbar .navbar-button');
	Array.prototype.forEach.call(navButtons, function(button) {
		button.addEventListener('click', function() {
			// remove active nav button
			document.querySelector('.navbar-button.active').classList.remove('active');
			// add active nav button
			button.classList.add('active');
			// hide current page
			document.querySelector('.page.active').classList.remove('active');
			// show new page
			document.querySelector(button.dataset.page).classList.add('active');
		});
	});

	// openModal
	var modalButtons = document.querySelectorAll('.triggerModal');
	Array.prototype.forEach.call(modalButtons, function(button) {
		button.addEventListener('click', function() {
			var modalSelector = button.dataset.modal;
			var modal = document.querySelector(modalSelector);
			modal.style.display = 'block';
		});
	});

	// closeModal
	var closeModalButtons = document.querySelectorAll('.closeModal');
	Array.prototype.forEach.call(closeModalButtons, function(button) {
		button.addEventListener('click', function() {
			var modalSelector = button.dataset.modal;
			var modal = document.querySelector(modalSelector);
			modal.style.display = 'none';
		});
	});

	// escapeModal
	document.body.addEventListener('keydown', function(event) {
		if (event.keyCode == 27) {
			Array.prototype.forEach.call(closeModalButtons, function(button) {
				button.click();
			});
		};
	});
	
	// Add subject
	var addSubjectButton = document.querySelector('#addSubject');
	addSubjectButton.addEventListener("click", function() {

		var subjectName = document.querySelector('#subjectName');
		var subjectSchedules = document.querySelector('#subjectSchedules');
		var errorMessages = document.querySelector('.errorMessages');
		var subjectIsOptional = document.querySelector('#addSubjectForm #subjectOptional .on').classList.contains('active');
		
		// Clear errors
		subjectName.classList.remove('hasError');
		subjectSchedules.classList.remove('hasError');
		errorMessages.textContent = '';

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
			schedules: subjectSchedules.value,
			isOptional: subjectIsOptional
		});

		// Check for errors
		if (newSubject.errorLog) {
			subjectSchedules.classList.add('hasError');
			errorMessages.textContent = newSubject.errorLog;
			return;
		};

		// Add to DOM
		foundSubjectsController.addSubject(newSubject);

		// Empty form
		subjectName.value = "";
		subjectSchedules.value = "";

		// Start process
		inscription.subjects.push(newSubject);
		inscription.generateAlternatives();
		foundAlternativesController.generateDOM();
		inscription.persistSubjects();

		// Close modal
		var closeButton = document.querySelector('#addSubjectForm .closeModal');
		closeButton.click();
	});

	// Attach on/off in add subject form
	var optionalSubjectButtonContainer = document.querySelector('#addSubjectForm #subjectOptional');
	onOff.attachOnOffSelectorEvents(optionalSubjectButtonContainer, function() {});

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
		var oldText = button.textContent;
		button.textContent = button.dataset.backuptext;
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

	// Show picked alternatives
	var showOnlyPickedButton = document.querySelector('.alternatives #showPickedAlternatives');
	showOnlyPickedButton.addEventListener('click', function() {
		var isActive = showOnlyPickedButton.classList.contains('active');
		if (isActive) {
			showOnlyPickedButton.classList.remove('active');
			showOnlyPickedButton.textContent = "Mostrar solo las elegidas";
			foundAlternativesController.showAllAlternatives();
		} else {
			showOnlyPickedButton.classList.add('active');
			showOnlyPickedButton.textContent = "Mostrar todas";
			foundAlternativesController.showOnlyPickedAlternatives();
		}
	});

  // Show full info
  var showFullInfoButton = document.querySelector('.alternatives #showFullInfo');
  showFullInfoButton.addEventListener('click', function() {
    var isActive = showFullInfoButton.classList.contains('active');
    if (isActive) {
      showFullInfoButton.classList.remove('active');
      showFullInfoButton.textContent = "Ver materias extendidas";
      foundAlternativesController.showCompactInfo();
    } else {
      showFullInfoButton.classList.add('active');
      showFullInfoButton.textContent = "Ver materias compactadas";
      foundAlternativesController.showFullInfo();
    }
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

var onOff = (function() {
	onOff = {};

	var onOffActive = function(button) {
		return button.classList.contains('active');
	};

	var toggleOnOffButton = function(button) {
		if (onOffActive(button)) {
			button.classList.remove('active');
			button.classList.add('inactive');
		} else {
			button.classList.remove('inactive');
			button.classList.add('active');
		}
	}

	onOff.attachOnOffSelectorEvents = function(onOffContainer, onOnOffChange) {
		var onOffButtons = onOffContainer.querySelectorAll('.onOff span');
		Array.prototype.forEach.call(onOffButtons, function(onOffButton) {
			onOffButton.addEventListener('click', function() {
				var sibling = this.classList.contains('on')? this.nextElementSibling: this.previousElementSibling;
				var onButton = this.classList.contains('on')? this : sibling;
				toggleOnOffButton(this);
				toggleOnOffButton(sibling);
				onOnOffChange(onOffActive(onButton));
			});
		});

	};

	return onOff;
})();
