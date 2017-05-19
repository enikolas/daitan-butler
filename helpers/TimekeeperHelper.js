const Nightmare = require('nightmare');

function removeLeadingZero(numberAsString) {
    return numberAsString.replace(/^0/g, '');
}

function addLeadingZero(numberAsString) {
    return numberAsString.length === 1 ? `0${numberAsString}` : numberAsString;
}

class TimekeeperHelper {
    constructor(user, logTime) {
        this.username = user.username;
        this.password = user.password;

        const dateSplited = logTime.date.split('-');
        this.year = dateSplited[0];
        this.month = addLeadingZero(dateSplited[1]);
        this.day = dateSplited[2];

        const arrivedTimeSplitted = logTime.arrivedTime.split(':');
        this.arrivedHour = removeLeadingZero(arrivedTimeSplitted[0]);
        this.arrivedMinute = removeLeadingZero(arrivedTimeSplitted[1]);

        const workedTimeSplitted = logTime.workedTime.split(':');
        this.workedHour = removeLeadingZero(workedTimeSplitted[0]);
        this.workedMinute = removeLeadingZero(workedTimeSplitted[1]);
    }

    logTime(myCallback) {
        const nightmare = Nightmare({ show: false });

        nightmare
            .goto(process.env.TIMEKEEPER_URL)
            .insert('input[name=auth_user]', this.username)
            .insert('input[name=auth_pw]', this.password)
            .click('input[type=submit]')
            .wait(2000)
            .goto(`${process.env.TIMEKEEPER_URL}/dispatch.php?atknodetype=timereg.newhours&atkaction=admin&atklevel=-1&atkprevlevel=0&`)
            // Date
            .wait('select#diai')
            .select('select#diai', this.day)
            .wait('select#mesi')
            .select('select#mesi', this.month)
            .wait('select#anoi')
            .select('select#anoi', this.year)
            // Arrived Time
            .wait('select#timehH')
            .select('select#timehH', this.arrivedHour)
            .wait('select#timemH')
            .select('select#timemH', this.arrivedMinute)
            // Worked Time
            .wait('select#timeh')
            .select('select#timeh', this.workedHour)
            .wait('select#timem')
            .select('select#timem', this.workedMinute)
            // Log Work Time
            .wait('#timereg_insert input[type=submit]')
            .click('#timereg_insert input[type=submit]')
            // Select the date again, in case the page gets crazy and get load the today date
            .wait('select#diai')
            .select('select#diai', this.day)
            .wait('select#mesi')
            .select('select#mesi', this.month)
            .wait('select#anoi')
            .select('select#anoi', this.year)
            // Log Lunch Time
            .wait('input#startBreak6')
            .type('input#startBreak6', '1200')
            .wait('input#endBreak6')
            .type('input#endBreak6', '1300')
            .wait('#formSixHoursBreak input[type=submit]')
            .click('#formSixHoursBreak input[type=submit]')
            .wait('#formSixHoursBreak input[type=submit]')
            .end(() => myCallback());
    }
}

module.exports = TimekeeperHelper;
