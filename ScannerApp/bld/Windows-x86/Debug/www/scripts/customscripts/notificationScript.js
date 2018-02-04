$(document).ready(function () {
    var d = new Date();
    var currTime = d.getDate()
    var notifyTime = 10;
    var repeatBool = true;

    while ( repeatBool == true ) {
        if (currTime == notifyTime) {
            function notify() {
                navigator.notification.alert("message", "Test", "Test")
                repeatBool = false;
            };
        }
        else {
            repeatBool = true;
        };
    };
});