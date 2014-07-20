var foundSubjectsController = (function() {
	var foundSubjectsController = {};
	var foundSubjectList = [];

	foundSubjectsController.addSubject = function(subject) {
		var foundSubject = new FoundSubject(subject);
		foundSubjectList.push(foundSubject);
	};

	foundSubjectsController.unSelectListItems = function() {
		for (var i = 0; i < foundSubjectList.length; i++) {
			foundSubjectList[i].subjectListItem.unselect();
		}
	};

	foundSubjectsController.hideTables = function() {
		for (var i = 0; i < foundSubjectList.length; i++) {
			foundSubjectList[i].subjectScheduleTable.hideTable();
		}
	};

	foundSubjectsController.removeFromList = function(foundSubject) {
		var foundSubjectIndex = foundSubjectList.indexOf(foundSubject);
		foundSubjectList.splice(foundSubjectIndex, 1);
	};

	foundSubjectsController.selectFirstSubject = function() {
		if (foundSubjectList.length) {
			foundSubjectList[0].subjectListItem.select();
			foundSubjectList[0].subjectScheduleTable.showTable();
		}
	};

	return foundSubjectsController;
})();

var FoundSubject = function(subject) {
	this.subject = subject;
	this.subjectScheduleTable = new SubjectScheduleTable(subject);
	this.subjectListItem = new SubjectListItem(this);
};

var SubjectScheduleTable = function(subject) {
	subject = subject || new Subject();
	var table = {};

	var init = function() {
		cloneTableFromDummy();
		addSubjectName();
		makeTableRows();
	};

	var cloneTableFromDummy = function() {
		var dummyTable = document.querySelector('.viewSchedule.dummy');
		table = dummyTable.cloneNode(true); //deep
		table.classList.remove('dummy');
		table.setAttribute('rel', subject.name);
		table.querySelector('tr.subjectSchedulesView').remove();
		document.querySelector('.subjectView').appendChild(table);
	};

	var addSubjectName = function() {
		var subjectTitle = 	table.querySelector('.subjectTitle');
		subjectTitle.innerText = subject.name;
	};

	var makeTableRows = function() {
		for (var i = 0; i < subject.schedules.length; i++) {
			new SubjectScheduleTableRow(table, subject.schedules[i]);
		}
	};

	this.showTable = function() {
		table.style.display = 'block';
	};

	this.hideTable = function() {
		table.style.display = 'none';
	};

	this.remove = function() {
		table.remove();
	};

	init();
};

var SubjectScheduleTableRow = function(table, schedule) {
	var scheduleTableRow = {};
	var row = {};

	var init = function() {
		createRow();
		fillRowWithDays();
		attachOnOffSelectorEvents();
	};

	var createRow = function() {
		var dummyTableRow = document.querySelector('.viewSchedule.dummy tr.subjectSchedulesView');
		row = dummyTableRow.cloneNode(true); // deep
		table.querySelector('tbody').appendChild(row);
	};

	var fillRowWithDays = function() {
		for (var i = 0; i < schedule.days.length; i++) {
			var day = schedule.days[i];
			var dayField = row.querySelector('td[class^="'+day.name+'"]');
			dayField.classList.add('info');
			dayField.innerText = day.turn;
		}
	};

	var attachOnOffSelectorEvents = function() {
		var onOffButtons = row.querySelectorAll('.onOff span');
		Array.prototype.forEach.call(onOffButtons, function(onOffButton) {
			onOffButton.addEventListener('click', onOnOffButtonClick);
		});
	};

	function onOnOffButtonClick () {
		var sibling = this.classList.contains('on')? this.nextElementSibling: this.previousElementSibling;
		toggleOnOffButton(sibling);
		toggleOnOffButton(this);
		switchScheduleActiveness();
		inscription.generateAlternatives();
		foundAlternativesController.generateDOM();
	}

	function toggleOnOffButton (button) {
		if (button.classList.contains('active')) {
			button.classList.remove('active');
			button.classList.add('inactive');
		} else {
			button.classList.remove('inactive');
			button.classList.add('active');
		}
	}

	function switchScheduleActiveness () {
		var onButton = row.querySelector('.onOff .on');
		var onButtonIsActive = onButton.classList.contains('active');
		schedule.active = onButtonIsActive;
		if (onButtonIsActive) {
			row.classList.remove('inactive');
		} else {
			row.classList.add('inactive');
		}
	}

	init();
	return scheduleTableRow;
};

var SubjectListItem = function(foundSubject) {
	var subjectListItem = {};
	var listItem = {};

	var init = function() {
		createListItem();
		createRemoveButton();
		listItem.addEventListener('click', onListItemClick);
		listItem.click();
	};

	var createListItem = function() {
		listItem = document.createElement('a');
		listItem.id = foundSubject.subject.name.replace(/\s/g, '');
		listItem.classList.add('list-group-item');
		listItem.setAttribute('href', 'javascript: void(0)');
		listItem.innerText = foundSubject.subject.name;
		var subjectItemList = document.querySelector('.subjectList .list-group');
		subjectItemList.appendChild(listItem);
		var emptyText = subjectItemList.querySelector('.empty-text');
		if (emptyText) {
			emptyText.remove();	
		}
	};

	var createRemoveButton = function() {
		var removeButton = document.createElement('span');
		removeButton.classList.add('removeSubjectButton');
		removeButton.innerText = 'x';
		listItem.appendChild(removeButton);
		removeButton.addEventListener('click', onRemoveButtonClicked);
	};

	var onRemoveButtonClicked = function(event) {
		event.stopPropagation();
		if (confirm('¿Estás seguro que querés eliminar esta materia?')) {
			removeSubjectFromInscription();
			removeSubjectFromFoundSubjects();
			reGenerateFoundAlternatives();
		}
	};

	var onListItemClick = function() {
		// Unhighlight others
		foundSubjectsController.unSelectListItems();
		// Highlight item
		subjectListItem.select();
		// Hide other tables
		foundSubjectsController.hideTables();
		// Show this table
		foundSubject.subjectScheduleTable.showTable();
	};

	var removeSubjectFromInscription = function() {
		var subjectIndex = inscription.subjects.indexOf(foundSubject.subject);
		inscription.subjects.splice(subjectIndex, 1);
		inscription.generateAlternatives();
		inscription.persistSubjects();
	};

	var removeSubjectFromFoundSubjects = function() {
		listItem.remove();
		foundSubject.subjectScheduleTable.remove();
		var subjectItemList = document.querySelector('.subjectList .list-group');
		var remainingSubjectListItems = subjectItemList.querySelectorAll('.list-group-item');
		if (!remainingSubjectListItems.length) {
			var emptyText = document.createElement('div');
			emptyText.classList.add('empty-text');
			emptyText.innerText = 'No hay materias';
			subjectItemList.appendChild(emptyText);
		}
		foundSubjectsController.removeFromList(foundSubject);
		foundSubjectsController.selectFirstSubject();
	};

	var reGenerateFoundAlternatives = function() {
		foundAlternativesController.generateDOM();
	};


	subjectListItem.select = function() {
		listItem.classList.add('active');
	};

	subjectListItem.unselect = function() {
		listItem.classList.remove('active');
	};

	init();
	return subjectListItem;
};
