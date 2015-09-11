app.factory('Schedule', function(){

 	var Schedule = function(scheduleText){
		this.days = parseTextIntoDays(scheduleText);
		this.active = true;
	};

	Schedule.prototype.isValid = function() {
		return this.days.length && this.days.every(function(day) {
			return day.isValid();
		});
	};

	var Day = function (params) {
	    this.name = params && params.name || ''; // Lu,Ma,Mi,Ju,Vi,Sá
	    this.turn = params && params.turn || ''; // m, t, n
	    this.startHour = params && params.startHour || 1;
	    this.endHour = params && params.endHour || 5;
	};

	Day.prototype.isValid = function() {
		return !!this.name && !!this.turn && this.startHour >= 0 && this.startHour <= 5 && this.endHour >= 1 && this.endHour <=6;
	};

	var parseTextIntoDays = function(text) {
	    var daysText = text.replace(/\w\d+/,"").trim().split(/\s+/);
	    return daysText.map(function(dayText) {
	    	var parsedDay = /(Lu|Ma|Mi|Ju|Vi|Sa)\s*\((m|t|n)\)(\d):(\d)/g.exec(dayText);
            if (parsedDay) {
	            return new Day({
	                name: parsedDay[1],
	                turn: parsedDay[2],
	                startHour: parseInt(parsedDay[3], 10),
	                endHour: parseInt(parsedDay[4], 10)
	            });
            } else {
            	return new Day();
            }
	    });
	};

	return (Schedule);
});