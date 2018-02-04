$(document).ready(function () {
    var d = new Date();

    var nD = 3;
    var nH = "12:00 AM";


    var currDay = d.getDay();
    var currHour = d.getHours();
    var currMin = d.getMinutes();
    var notifyDay
    var notifyHour
    var notifyMin

    

    function toMilitary() {
        notifyMin = nH.substr(3, 2);
        notifyHour = nH.substr(0, 2);
        notifyMin = Number(notifyMin);
        

        if (nH.substr(6, 2) == "AM") {
            notifyHour = Number(notifyHour);
            if (notifyHour == 12) {
                notifyHour = 0;
            }
            else {
                notifyHour = notifyHour;
            }
        }
        else if (nH.substr(6, 2) == "PM") {
            notifyHour = Number(notifyHour);
            if (notifyHour == 12) {
                notifyHour = notifyHour;
            }
            else {
                notifyHour = notifyHour + 12;
            }
        }

    }
    toMilitary()


    function alertDismissed() {
        // do something
    }

    //actual message function
    function notify() {
        navigator.notification.alert(
            "The event " +  + " is about to start",  // message
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
       

        //console.log(currDay + " " + currHour + " " + currMin + " " + notifyDay + " " + notifyHour + " " + notifyMin);

        var timeTimer = setTimeout(checkTime, 500);
    };

    function updateTime() {
        var test = new Date();

        currDay = test.getDay();
        currHour = test.getHours();
        currMin = test.getMinutes();
        var updateTimeTimer = setTimeout(updateTime, 500);
    }
    checkTime();
    updateTime();


    function populateEventTimeChecker() {
        var newListHtml2 = "";
        for (var i = 0; i < eventKeysTwo.length; i++) {
            newListHtml2 += eventObjsTwo[i].startTime + ","
            //window.alert(eventKeys[i]);
        }
        console.log(newListHtml2)
    }




    $("#userLogBtn").click(function () {
        var eventsRef = database.ref("events");
        eventsRef.orderByChild("text").on("value", function (snapshot) {
            //Clear the local arrays
            eventKeysTwo = [];
            eventObjsTwo = [];

            //snapshot.forEach is a firebase method
            snapshot.forEach(function (data) {

                eventKeysTwo.push(data.key);
                eventObjsTwo.push(data.val());

            });
            populateEventTimeChecker();
        });
    });

});
