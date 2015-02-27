var updates = (function(){
	var updates = {};
	var updatesStorageKey = '_alternativity_updates';
	var allUpdates = [
		{
			id: 1,
			html: '<h4>Actualización</h4><p>Ahora Alternativity tiene en cuenta el horario de las materias, de manera que puedes agregar dos materias en un mismo día y turno pero cuyas horas no se superpongan. <br> Por ejemplo: <br> materia 1  Lu(m) 0:2 <br> materia 2  Lu(m) 3:5 <br><br> Si encontras algún problema con las alternativas o materias cargadas anteriormente, intentá volver a crearlas.</p>'
		}
	];
	updates.missing = [];

	updates.saveMissingUpdates = function() {
		localStorage.setItem(updatesStorageKey, JSON.stringify(allUpdates));
	};

	var init = function() {
		if (!firstTimeRunning()) {
			// if app existed => check saved updates
			var savedUpdates = JSON.parse(localStorage.getItem(updatesStorageKey)) || [];
			// 	compare saved updates with all update list
			updates.missing = allUpdates.filter(function(update){
				return savedUpdates.every(function(savedUpdate){
					return savedUpdate.id != update.id
				});
			})
		}
	};

	var firstTimeRunning = function() {
		return !localStorage.getItem(inscription.subjectsStorageKey);
	};

	init();

	return updates;
})();