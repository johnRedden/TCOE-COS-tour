$(document).ready(function () {
    
    $("#surveyOut").show();
    $("#surveyLink").hide();
    $("#surveyNotTime").hide();
    
    // QR Code Login Proceedure
    $("#userQRlogBtn").click(function () {
        loginScan();
    });

    // Reg. Number Login Proceedure
    $("#userLogBtn").click(function () {

        if ($(this).html() === "logout") {
            //trigger refresh... hack.
            loggedIn = false;
            location.reload();
            return;
        }
        
        //get the number from the input box
        var userRegNum = ($("#userRegNumber").val());

        // call database to get information about participant with particular reg. number
        var ref = database.ref("participants");
        ref.orderByChild("registrationNumber").equalTo(userRegNum).once('value')
            .then(function (dataSnapshot) {
                //console.log(dataSnapshot.val());
                if (dataSnapshot.val() == null) {
                    $("#logMessage").html("Registration number not found.");
                    $("#userRegNumber").focus();
                    return;
                }
                // handle read data.
                dataSnapshot.forEach(function (data) {
                    //TODO: Fix this for goodness sake!  Hopefully, there is only one.
                    participantKey = data.key;
                    participantObj = data.val();
                    loginParticipant();

                });

            });
        
    });
  
    function loginScan() {
        //cordova takes care of business!
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                if (!result.cancelled) {
                    //only want QR code scanner functionality
                    if (result.format == "QR_CODE") {

                        var ref = database.ref("participants/" + result.text);
                        ref.once('value').then(function (dataSnapshot) {
                            participantKey = dataSnapshot.key;
                            participantObj = dataSnapshot.val();
                            loginParticipant();
                        });

                    }
                }
            },
            function (error) {
                alert("Scanning failed: " + error);
            }
        );
    };

    function loginParticipant() {
        loggedIn = true;
        $("#locationMessage").hide();
        var loginMessage = "Hi " + participantObj.firstName + ", enjoy the day.";
        $("#logQRmessage").hide();
        $("#userQRlogBtn").hide();
        $("#logMessage").html(loginMessage);
        $("#userRegNumber").hide();
        $("#userLogBtn").html("logout");


        //TODO: trigger dialog close

        // Firebase mainMessage listener (realtime database!)
        // Only if logged in.
        var messageRef = database.ref('mainMessage');
        messageRef.on('value', function (snapshot) {
            //console.log(snapshot.val().surveyURL);
            $("#appMessage").html(snapshot.val().message);
            $("#surveyLink").attr("src", snapshot.val().surveyURL);

            if ((snapshot.val().surveyView == "on") && (loggedIn == true) ) {
                $("#surveyOut").hide();
                $("#surveyLink").show();
                $("#surveyNotTime").hide();
            } else if (snapshot.val().surveyView == "off") {
                $("#surveyOut").hide();
                $("#surveyLink").hide();
                $("#surveyNotTime").show();
            }

            function alertDismissed() {
                // do something
            }

            navigator.notification.alert(
                snapshot.val().message,  // message
                alertDismissed,         // callback
                'Main Message',            // title
                'Ok'                  // buttonName
            );
            navigator.notification.beep(1);

        });

        

        // Firebase participant listener  (everything about the participant)
        var myRef = database.ref('participants/' + participantKey);
        myRef.on('value', function (snapshot) {
            //console.log(snapshot.val());
            $(".myDialog").html(snapshot.val().firstName);
            $(".myScore").html(snapshot.val().score);
            $("#scoreMessage").html("Your current score is: " + snapshot.val().score + ". Scan more locations to gain points!"); //score modal message
            participantObj = snapshot.val(); //holds everything offline in participantObj
            var visitedObj = participantObj.visitedLocations;

            //populate visited list in app
            $("#visitedLocationList").html("");
            var newVListHtml = "";

            for (key in visitedObj) {
                visitedLocationKeys.push(key);
                //console.log(key);
                //console.log(visitedObj[key]);
                newVListHtml += "<li class='found' id='" + key + "' data-icon='check'><a href='#dialogLocationHint' class='visited'>" + visitedObj[key] + "</a></li>";
            }
            $("#visitedLocationList").html(newVListHtml);
            $("#visitedLocationList").listview().listview("refresh");            

            populateLocationList();

            $(".found").each(function () {
                $(this).click(function () {
                    // Changing hint for visited locations
                    var t = $(this).attr('id');
                    var ind = visitedLocationKeys.indexOf(t);
                    //window.alert(visitedObj[t]);
                    $("#Hint").text("You've already found " + visitedObj[t]);
                });
            });
            
        });

    
        //Firebase locations listener
        //Also, listen for new locations real time
        var locationsRef = database.ref("locations");
        locationsRef.orderByChild("text").on("value", function (snapshot) {
            //Clear the local arrays
            locationKeys = [];
            locationObjs = [];
            //snapshot.forEach is a firebase method
            snapshot.forEach(function (data) {
                
                var alreadyFound = visitedLocationKeys.indexOf(data.key);
                if (alreadyFound < 0) { //not found yet
                    //console.log("The " + data.key + " text is " + data.val().text);
                    locationKeys.push(data.key);  //easy solution using an array
                    locationObjs.push(data.val());  // the actual location objects
                 }

            });
            populateLocationList();

        });
    

        var eventsRef = database.ref("events");
        eventsRef.orderByChild("text").on("value", function (snapshot) {
            //Clear the local arrays
            eventKeys = [];
            eventObjs = [];

            //snapshot.forEach is a firebase method
            snapshot.forEach(function (data) {

                eventKeys.push(data.key);
                eventObjs.push(data.val());

            });
            populateEventList();
        });
    };


    function populateEventList() {
        //$("#eventList").html("");
        var newListHtml = "";
        var registration = "ok";
        var checked = "";
        for (var i = 0; i < eventKeys.length; i++) {
            newListHtml += "<li><label for='" + eventObjs[i].text + "'><h3>" + eventObjs[i].text + "      <span class='ui-mini'>Start Time: " + eventObjs[i].startTime + "</span></h3><p>" + eventObjs[i].description + "</p></label><input type='checkbox' id='" + eventObjs[i].text + "'></li>";       
            //window.alert(eventKeys[i]);
        }
        $("#eventList").append(newListHtml).trigger("create");
    }



    function populateLocationList() {
        // no database calls here
        $("#locationList").html("");
        var newListHtml = "";
        for (var i = 0; i < locationKeys.length; i++){
            var alreadyFound = visitedLocationKeys.indexOf(locationKeys[i]);
            if (alreadyFound < 0) { //not found yet
                //console.log("The " + data.key + " text is " + data.val().text);                                   
                newListHtml += "<li id='" + locationKeys[i] + "' data-icon='location'><a href='#dialogLocationHint' >" + locationObjs[i].text + "<span class='ui-li-count'>" + locationObjs[i].points + "</span></a></li>";
            }
        }
        if (newListHtml === "") {
            //You Win... no more locations
            newListHtml = "<li id='' data-icon='heart'><a href='#'>You Win!</a></li>";
        }
        $("#locationList").html(newListHtml);
        $("#locationList").listview().listview("refresh");

         // adding click event to each #location li
        $("#locationList li").each(function () {
            $(this).click(function () {             
                // Changing hint for not visited locations
                var k = $(this).attr('id');
                var ind = locationKeys.indexOf(k);
                $("#Hint").text(locationObjs[ind].hint);
            });
        });
    } 



    




});