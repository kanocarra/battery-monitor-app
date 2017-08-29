/**
 * Created by kanocarra on 14/08/16.
 */
var statusRef;
var logRef;
var speedGraph;
var powerGraph;
var temperatureGraph;
var graphDrawn;
var dataRef;
var timer;
var speedValues = [];
var powerValues = [];
var tempValues = [];
var dateTime = [];
var timerOn;

(function () {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBFrWfdJNdBXnKnr3OxDWvT-PlzO0kTs1M",
        authDomain: "battery-monitor-3ffa3.firebaseapp.com",
        databaseURL: "https://battery-monitor-3ffa3.firebaseio.com",
        projectId: "battery-monitor-3ffa3",
        storageBucket: "battery-monitor-3ffa3.appspot.com",
        messagingSenderId: "445102930794"

    };
    firebase.initializeApp(config);

    const database = firebase.database().ref();

    //Create reference to Battery-Monitor status
    statusRef = database.child('status');

    statusRef.on('value', function (snap) {
        updateStats(snap.val())
    });

    //Get the last element under the "logs" section. Please note the code below is only executed once.
    database.child('logs').limitToLast(1).once('value', function (snap) {
        //Get the key of the log.
        // The code below is a bit weird because we are using a `forEach` method when there is
        // only one element. But I couldn't find another way to get the key.
        snap.forEach(function(logSnapshot) {
            //Once we got the key, we pass it to the `subscribeToLogForKey` method.
            subscribeToLogForKey(logSnapshot.key);
        });
    });


}());

function subscribeToLogForKey(key) {
    console.log("Getting information for the log: " + key);
    const reference = firebase.database().ref("logs/" + key);

    //I suspect that we will use the method below to initiate the graph.
    drawGraphs();

    //Subscribe to the database reference.
    reference.on("child_added", function (data) {

        //This method will be called for each log entry added.
        updateGraphs(data.val());
    })
}


function drawSpeedGraph(speedValues, dateTime) {

    var ctx = document.getElementById("speedChart");
    speedGraph = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dateTime,
            datasets: [{
                data: speedValues,
                backgroundColor: 'rgba(0,172,172,0.3)',
                borderColor: '#00acac',
                borderWidth: 5
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            legend: {
                display: false
            },
            tooltips: {
                enabled: true,
                mode: 'single',
                callbacks: {
                    label: function (tooltipItems, data) {
                        return tooltipItems.yLabel + ' RPM';
                    }
                }
            }
        }


    });
}

function updateStats(statusData) {
    $('.battery-fill-cell1').html('<p style="color: ghostwhite; font-size: 18px">' + statusData['cell1_soc'] + '%</br>' +
        statusData['cell1_voltage'] + 'V </p>');
    $('.battery-fill-cell2').html('<p style="color: ghostwhite; font-size: 18px">' + statusData['cell2_soc'] + '%</br>' +
        statusData['cell2_voltage'] + 'V </p>');
    $('.battery-fill-cell7').html('<p style="color: ghostwhite; font-size: 18px">' + statusData['cell7_soc'] + '%</br>' +
        statusData['cell7_voltage'] + 'V </p>');
    $('.battery-fill-cell8').html('<p style="color: ghostwhite; font-size: 18px">' + statusData['cell8_soc'] + '%</br>' +
        statusData['cell8_voltage'] + 'V </p>');
    $('#main_status').html('<p> Current: ' + statusData['current'] + '</p>'
        + '<p> Pack Voltage: ' + statusData['pack_voltage'] + '</p>'
        + '<p> Time Elapsed: ' + statusData['time_elapsed'] + '</p>');
}

function drawGraphs() {

    console.log("Drawing the graphs");
}

function updateGraphs(data) {

    console.log("Adding new element to the graph");
    console.log(data)
}


$(document).ready(function () {


});
