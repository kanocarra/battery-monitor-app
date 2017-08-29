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

(function() {

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

            //Create refgit erence to Battery-Monitor status
            statusRef = database.child('status');

            statusRef.on('value', function(snap) {
                updateStats(snap.val())
                });

            logRef = database.child('logs');
            graphDrawn = false;

            logRef.limitToLast(1).on('value', function(snap) {
                setUpReference(snap);
                //if (graphDrawn) {
                //    updateGraphs(snap.val());
                //} else {
                //    drawGraphs(snap.val());
                //}
            });


}());





function drawSpeedGraph(speedValues, dateTime){

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
                    label: function(tooltipItems, data) {
                        return tooltipItems.yLabel + ' RPM';
                    }
                }
            }
        }


    });
}

function updateStats(statusData){
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

function drawGraphs(data) {

    console.log(data);
}

function updateGraphs(data) {

    console.log(data);
    console.log("update");
}

function setUpReference(log){
    console.log(log.key);

    logRef.on('child_added', function(snap) {
        setUpReference(log.key);
        //if (graphDrawn) {
        //    updateGraphs(snap.val());
        //} else {
        //    drawGraphs(snap.val());
        //}
    });

}




$( document ).ready( function() {


});
