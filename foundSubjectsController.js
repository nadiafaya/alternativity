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

	var makeTableRows = function() {
		var dummyTableRow = document.querySelector('.viewSchedule.dummy tr.subjectSchedulesView');
		for (var i = 0; i < subject.schedules.length; i++) {
			var row = cloneTableRowFromDummy(dummyTableRow);
			fillTableRowWithDays(row, subject.schedules[i]);
		}
	};

	var cloneTableRowFromDummy = function(dummyTableRow) {
		var row = dummyTableRow.cloneNode(true); // deep
		table.querySelector('tbody').appendChild(row);
		return row;
	};

	var fillTableRowWithDays = function(row, schedule) {
		for (var i = 0; i < schedule.days.length; i++) {
			var day = schedule.days[i];
			var dayField = row.querySelector('td[class^="'+day.name+'"]');
			dayField.classList.add('info');
		}
	};

	this.showTable = function() {
		table.style.display = 'table';
	};

	this.hideTable = function() {
		table.style.display = 'none';
	};

	this.remove = function() {
		table.remove();
	};

	init();
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
		removeSubjectFromInscription();
		removeSubjectFromFoundSubjects();
		reGenerateFoundAlternatives();
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
	};

	var removeSubjectFromFoundSubjects = function() {
		listItem.remove();
		foundSubject.subjectScheduleTable.remove();
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
