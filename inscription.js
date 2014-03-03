var inscription = (function() {
    var inscription = {};
    inscription.subjects = [];
    inscription.alternatives = [];
    inscription.availableTurns = {
        m: true,
        t: true,
        n: true
    };
    inscription.availableDays = {
        Lu: true,
        Ma: true,
        Mi: true,
        Ju: true,
        Vi: true,
        Sa: true
    };
    inscription.availableTurnsInDays = {
        Lu: { m: true, t: true, n: true },
        Ma: { m: true, t: true, n: true },
        Mi: { m: true, t: true, n: true },
        Ju: { m: true, t: true, n: true },
        Vi: { m: true, t: true, n: true },
        Sa: { m: true, t: true, n: true }  
    }

    inscription.generateAlternatives = function() {
        inscription.alternatives = [];
        var subjectsToProcess = inscription.subjects;
        var currentAlternative = [];

        function processNextSubject () {
            var currentSubject = subjectsToProcess.pop();
            for (var i = 0; i < currentSubject.schedules.length; i++) {
                if(scheduleMeetsFilters(currentSubject.schedules[i])){
                    currentAlternative.push({
                        subject: currentSubject, 
                        schedule: currentSubject.schedules[i]
                    });
                    if(subjectsToProcess.length){
                        processNextSubject();
                    } else {
                        inscription.alternatives.push(currentAlternative.slice());
                    }   
                    currentAlternative.pop();
                }
            }

            subjectsToProcess.push(currentSubject);
        }

        function scheduleMeetsFilters (schedule) {
            return schedule.active &&
                scheduleIsUniqueInCurrentAlternative(schedule) && 
                scheduleIsInAvailableTurns(schedule) &&
                scheduleIsInAvailableDays(schedule) &&
                scheduleIsInAvailableTurnsInDays(schedule);
        }

        function scheduleIsUniqueInCurrentAlternative (schedule) {

            if (currentAlternative.length) {
                var currentDays = getCurrentAlternativeDays();
                for(var i = 0; i < currentDays.length; i++){
                    var day = currentDays[i];
                    for(var j = 0; j < schedule.days.length; j++){
                        var scheduleDay = schedule.days[j];
                        if(day.name === scheduleDay.name && day.turn === scheduleDay.turn ){
                            return false;
                        }
                    }
                }
            }

            return true;
        }

        function getCurrentAlternativeDays () {
            var currentDays = [];
            for (var i = 0; i < currentAlternative.length; i++) {
                currentDays = currentDays.concat(currentAlternative[i].schedule.days);
            }
            return currentDays;
        }

        function scheduleIsInAvailableTurns (schedule) {
            for (var i = 0; i < schedule.days.length; i++) {
                if(!inscription.availableTurns[schedule.days[i].turn]) {
                    return false;
                }
            }
            return true;
        }

        function scheduleIsInAvailableDays (schedule) {
            for (var i = 0; i < schedule.days.length; i++) {
                if(!inscription.availableDays[schedule.days[i].name]) {
                    return false;
                }
            }
            return true;
        }

        function scheduleIsInAvailableTurnsInDays (schedule) {
            for (var i = 0; i < schedule.days.length; i++) {
                var day = schedule.days[i].name;
                var turn = schedule.days[i].turn;
                if(!inscription.availableTurnsInDays[day][turn]) {
                    return false;
                }
            };
            return true;
        }

        if (subjectsToProcess.length) {
            processNextSubject();
        }
    };

    inscription.storageKey = "_alternativity";

    inscription.persist = function() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.subjects));
    };

    inscription.loadFromStorage = function() {
        this.subjects = this.fromStorage();
    };

    inscription.isPersisted = function() {
        return !!this.fromStorage();
    };
    
    inscription.fromStorage = function() {
        return JSON.parse(localStorage.getItem(this.storageKey));
    };

    inscription.findSubjectByName = function(subjectName) {
        inscription.subjects.forEach(function(subject) {
            if (subject.name === subjectName) {
                return subject;
            }
        });
        return new Subject();
    };

    return inscription;
})();
