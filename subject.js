var subjectColors = {
    availableColors: ['#75CAEB', '#A01CFF', '#FF851B', '#28B62C','#158CBA', '#FF4136'],
    getColor: function() {
        if (this.availableColors.length) {
            return this.availableColors.pop();
        } else{
            // random color
            return '#'+Math.floor(Math.random()*16777215).toString(16);
        }
    }
};

var Day = function (params) {
    this.name = params.name || ''; // Lu,Ma,Mi,Ju,Vi,Sá
    this.turn = params.turn || ''; // m, t, n
};

var Schedule = function () {
    this.days = [];
    this.active = true;
};

var Subject = function (params) {
    var subject = {}; 
    var schedulesText = cleanAccents(params.schedules); // Esto es por "Sábado"
    subject.name = params.name || '';
    subject.shortName = makeShortName();
    subject.color = subjectColors.getColor();
    subject.schedules = [];
    subject.isOptional = params.isOptional || false;
    subject.errorLog = "";

    function parseSchedulesText () {
        var lines = schedulesText.match(/.+/gm);
        if (!lines || !lines.length) {
            logError("No se pudo encontrar ningún horario. Ingresá los horarios en el campo 'Horarios de materia'");
            return;
        } 
        for (var i = 0; i < lines.length; i++) {
            var schedule = new Schedule();
            var parsedDays = lines[i].match(/(Lu|Ma|Mi|Ju|Vi|Sa)\s*\((m|t|n)\)/g); // Lu(m)
            if (!parsedDays || !parsedDays.length) {
                logError();
                return;
            }
            for (var j = 0; j < parsedDays.length; j++) {
                var dayName = parsedDays[j].match(/Lu|Ma|Mi|Ju|Vi|Sa/g);
                var dayTurn = parsedDays[j].match(/m|t|n/g);
                if (!dayName || !dayName.length || !dayTurn || !dayTurn.length) {
                    logError();
                    return;
                };
                var day = new Day({
                    name: dayName[0],
                    turn: dayTurn[0]
                });
                schedule.days.push(day);
            }
            subject.schedules.push(schedule);
        }
    }

    function logError (message) {
        subject.errorLog = message || "Hubo un error al leer los horarios. Ingresá los horarios con la forma 'Lu(n) 0:5'";
    }

    function cleanAccents (text) {
        if (text) {
            return fixSIGAsBadAccents(text)
                .replace(/\u00E1/g, 'a')
                .replace(/\u00E9/g, 'e')
                .replace(/\u00ED/g, 'i')
                .replace(/\u00F3/g, 'o')
                .replace(/\u00FA/g, 'u')
                .replace(/\u00FA/g, 'u');
        } else{
            return '';
        }
    }

    function fixSIGAsBadAccents(string){
        return decodeURIComponent(escape(string));
    }

    function makeShortName () {
        var accentTranslations = {
            'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
            'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U'
        };
        var cleanName = subject.name.replace(/[á,é,í,ó,ú,Á,É,Í,Ó,Ú]/g, function(match){ 
            return accentTranslations[match];
        });
        return cleanName.match(/\b(\w)|[A-Z]/g).join('').toUpperCase();
    }

    parseSchedulesText();
    return subject;
};
