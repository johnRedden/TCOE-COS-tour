// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.

//Globals here
var database = null;
var loggedIn = false;

participantObj = null;
participantKey = null;

var visitedLocationKeys = [];
var locationKeys = [];
var locationObjs = [];
var eventKeys = [];
var eventObjs = [];

(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        $("#appMessage").html("Please log in.");

        // Initialize Firebase
        var config = {
            apiKey: "AIzaSyBu0_y7pEs9dAC-1j1CB7Lq_I7HlHjfvnM",
            authDomain: "tcoeapp.firebaseapp.com",
            databaseURL: "https://tcoeapp.firebaseio.com",
            projectId: "tcoeapp",
            storageBucket: "",
            messagingSenderId: "405307790686"
        };
        firebase.initializeApp(config);

        // Get a reference to the database service
        database = firebase.database();

        //TODO: put all firebase listeners here maybe??



    };



    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
} )();