$(document).ready(function () {
   

    $("#scanQRcodeBtn").click(function () {
        //console.log("QR button clicked")
        scan();
    });

    function scan() {
        //cordova takes care of business!
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                if (!result.cancelled) {
                    //only want QR code scanner functionality
                    if (result.format == "QR_CODE") {
                        //just add QR text to page
                        $("#scanOutput").html(result.text);
                        var indexOfScannedLocation = locationKeys.indexOf(result.text);                     

                        if (indexOfScannedLocation >= 0) {
                            // get connection to logged in user and update his score                           
                            var ref = database.ref('participants/' + participantKey);

                            //Now populated users visitedLocations property
                            var dynamicObj = {};
                            // dynamicObj[key]=value;
                            dynamicObj[ locationKeys[indexOfScannedLocation] ] = locationObjs[indexOfScannedLocation].text;
                            // if not there will create it or updated it 
                            var Vref = database.ref('participants/'+ participantKey+'/visitedLocations');
                            Vref.update(dynamicObj);

                            //store found location keys locally
                            locationKeysFound.push(locationKeys[indexOfScannedLocation]);
                            
                            //checking visited list to not double count points, etc
                            if (visitedLocationKeys.indexOf(result.text) < 0) {
                                var xx = Number(participantObj.score) + Number(locationObjs[indexOfScannedLocation].points);
                                ref.update({ "score": xx });
                            }                     
                         
                        }

                        //turn list item green to indicate that it was visited
                        $("#" + locationKeys[indexOfScannedLocation]+">a").addClass("visited");
                        //Todo:  Add points for found location.
                    }
                }
            },
            function (error) {
                alert("Scanning failed: " + error);
            }
        );
    }





});