$(document).ready(function () {
    var d = new Date();

    var currDay = d.getDay();
    var currHour = d.getHours();
    var currMin = d.getMinutes();
    var currSec = d.getSeconds();
    var notifyDay = 4;
    var notifyHour = 2;
    var notifyMin = 20;

    var repeatBool = true;

    

    function alertDismissed() {
        // do something
    }

    function notify() {
        navigator.notification.alert(
            "test",  // message
            alertDismissed,         // callback
            'Main Message',            // title
            'Ok'                  // buttonName
        );
        navigator.notification.beep(1);
    };


    function checkTime() {
        if (currDay == notifyDay && currHour == notifyHour && currMin == notifyMin) {
            notify();
        };
       

        console.log(currDay + " " + currHour + " " + currMin + " " + notifyDay + " " + notifyHour + " " + notifyMin + " " + currSec);

        var timeTimer = setTimeout(checkTime, 500);
    };

    function updateTime() {
        var test = new Date();

        currDay = test.getDay();
        currHour = test.getHours();
        currMin = test.getMinutes();
        currSec = test.getSeconds();

        var updateTimeTimer = setTimeout(updateTime, 500);
    }

    checkTime();
    updateTime();



});
