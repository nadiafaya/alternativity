var inscription = (function() {
    var inscription = {};
    inscription.subjects = [];
    inscription.alternatives = [];
    inscription.pickedAlternatives = [];
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
    };
    inscription.availableHoursInDays = {
        Lu: { m: [true, true, true, true, true, true, true], t: [true, true, true, true, true, true, true], n: [true, true, true, true, true, true] },
        Ma: { m: [true, true, true, true, true, true, true], t: [true, true, true, true, true, true, true], n: [true, true, true, true, true, true] },
        Mi: { m: [true, true, true, true, true, true, true], t: [true, true, true, true, true, true, true], n: [true, true, true, true, true, true] },
        Ju: { m: [true, true, true, true, true, true, true], t: [true, true, true, true, true, true, true], n: [true, true, true, true, true, true] },
        Vi: { m: [true, true, true, true, true, true, true], t: [true, true, true, true, true, true, true], n: [true, true, true, true, true, true] },
        Sa: { m: [true, true, true, true, true, true, true], t: [true, true, true, true, true, true, true], n: [true, true, true, true, true, true] }
    };

    inscription.generateAlternatives = function() {
        inscription.alternatives = [];
        var subjectsToProcess = inscription.subjects;
        var currentAlternative = [];
        var currentAvailability = JSON.parse( JSON.stringify( inscription.availableHoursInDays ) ); // copy object

        function processNextSubject () {
            var currentSubject = subjectsToProcess.pop();
            var optionalRound = currentSubject.isOptional || false;
            for (var i = 0; i < currentSubject.schedules.length + optionalRound; i++) {
                var schedule = {
                    active: true,
                    days: []
                };
                
                if (i != currentSubject.schedules.length) {
                    schedule = currentSubject.schedules[i];
                }

                if(scheduleMeetsFilters(schedule)){
                    markScheduleAsBusy(schedule);
                    currentAlternative.push({
                        subject: currentSubject, 
                        schedule: schedule
                    });
                    if(subjectsToProcess.length){
                        processNextSubject();
                    } else {
                        var finalAlternative = {};
                        finalAlternative.schedules = currentAlternative.slice();
                        addPickedStatusFromStorage(finalAlternative);
                        inscription.alternatives.push(finalAlternative);
                    }   
                    currentAlternative.pop();
                    markScheduleAsAvailable(schedule);
                }
            }

            subjectsToProcess.push(currentSubject);
        }

        function scheduleMeetsFilters (schedule) {
            return schedule.active &&
                scheduleFitsAlternative(schedule) &&
                scheduleIsInAvailableTurns(schedule) &&
                scheduleIsInAvailableDays(schedule) &&
                scheduleIsInAvailableTurnsInDays(schedule);
        }

        function scheduleFitsAlternative (schedule) {
            for(var i = 0; i < schedule.days.length; i++){
                var day = schedule.days[i];
                for (var h = day.startHour; h < day.endHour + 1; h++){
                    if (!currentAvailability[day.name][day.turn][h]) {
                        return false;
                    }
                }
            }
            return true;
        }

        function markScheduleAsBusy (schedule) {
            for(var i = 0; i < schedule.days.length; i++){
                var day = schedule.days[i];
                for (var h = day.startHour; h < day.endHour + 1; h++){
                    currentAvailability[day.name][day.turn][h] = false;
                }
            }
        }

        function markScheduleAsAvailable (schedule) {
            for(var i = 0; i < schedule.days.length; i++){
                var day = schedule.days[i];
                for (var h = day.startHour; h < day.endHour + 1; h++){
                    currentAvailability[day.name][day.turn][h] = true;
                }
            }
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

        function addPickedStatusFromStorage (alternative) {
            if (inscription.pickedAlternatives) {
                for (var i = 0; i < inscription.pickedAlternatives.length; i++) {
                    var picked = inscription.pickedAlternatives[i];
                    var pickedCopy = { schedules: picked.schedules };
                    if (alternativesAreEqual(alternative, pickedCopy)) {
                        alternative.pickedNumber = picked.pickedNumber;
                        return;
                    }
                }
            }
        }

        function alternativesAreEqual (alt1, alt2) {
            return JSON.stringify(alt1) == JSON.stringify(alt2);
        }

        function removeSubjectsWithNoSchedules () {
            subjectsToProcess = subjectsToProcess.filter(function(subject) {
                return subject.schedules.some(function(schedule) {
                    return schedule.active;
                });
            });
        }

        removeSubjectsWithNoSchedules();

        if (subjectsToProcess.length) {
            processNextSubject();
        }
    };

    function findStoragePickedAlternative (alternative) {
        if (inscription.pickedAlternatives) {
            for (var i = 0; i < inscription.pickedAlternatives.length; i++) {
                var picked = inscription.pickedAlternatives[i];
                var pickedCopy = { schedules: picked.schedules };
                var alternativeCopy = { schedules: alternative.schedules };
                if (JSON.stringify(pickedCopy) == JSON.stringify(alternativeCopy)) {
                    return picked;
                }
            }
        }
        return;
    }

    inscription.subjectsStorageKey = "_alternativity_subjects";
    inscription.pickedAlternativesStorageKey = "_alternativity_picked_alternatives";

    inscription.persistSubjects = function() {
        localStorage.setItem(this.subjectsStorageKey, JSON.stringify(this.subjects));
    };

    inscription.persistPickedAlternatives = function() {
        for (var i = 0; i < this.alternatives.length; i++) {
            var alternative = this.alternatives[i];
            var pickedAlternative = findStoragePickedAlternative(alternative);
            if (alternative.pickedNumber){
                if (pickedAlternative) {
                    pickedAlternative.pickedNumber = alternative.pickedNumber;
                } else {
                    this.pickedAlternatives.push(this.alternatives[i]);
                }
            }

            if (!alternative.pickedNumber && pickedAlternative) {
                var index = this.pickedAlternatives.indexOf(pickedAlternative);
                this.pickedAlternatives.splice(index, 1);
            }
        };
        localStorage.setItem(this.pickedAlternativesStorageKey, JSON.stringify(this.pickedAlternatives));
    };

    inscription.loadFromStorage = function() {
        this.subjects = this.subjectsFromStorage() || [];
        this.subjects.forEach(function(subject) {
            subject.schedules.forEach(function(schedule) {
               schedule.days.forEach(function(day) {
                   if (day.startHour === undefined)
                       day.startHour = 1;
                   if (day.endHour === undefined)
                       day.endHour = 5;
               });
           });
        });
        this.pickedAlternatives = this.alternativesFromStorage() || [];
    };

    inscription.isPersisted = function() {
        return !!this.subjectsFromStorage();
    };
    
    inscription.subjectsFromStorage = function() {
        return JSON.parse(localStorage.getItem(this.subjectsStorageKey));
    };

    inscription.alternativesFromStorage = function() {
        return JSON.parse(localStorage.getItem(this.pickedAlternativesStorageKey));
    };

    return inscription;
})();
