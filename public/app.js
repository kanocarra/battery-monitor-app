/**
 * Created by kanocarra on 14/08/16.
 */
var statusRef;
var logRef;
var socGraph;
var votlageGraph;
var graphDrawn;
var socCell1Values = [];
var socCell2Values = [];
var socCell7Values = [];
var socCell8Values = [];
var voltCell1Values = [];
var voltCell2Values = [];
var voltCell7Values = [];
var voltCell8Values = [];
var timeElapsed = [];

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


    //Subscribe to the database reference.
    reference.on("child_added", function (data) {
        if(graphDrawn) {
            //This method will be called for each log entry added.
            updateGraphs(data.val());
        }else {
            drawGraphs(data.val());
        }
    })
}

function drawVoltageGraph() {

    var ctx = document.getElementById("voltageChart");
    voltageGraph = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeElapsed,
            datasets: [{
                label: "Cell 1",
                fill: false,
                data: voltCell1Values,
                borderColor: '#3a9ad9',
                borderWidth: 2,
                pointRadius: 0
            },
                {
                    label: "Cell 2",
                    fill: false,
                    data: voltCell2Values,
                    borderColor: '#29aba4',
                    borderWidth: 2,
                    pointRadius: 0
                },
                {
                    label: "Cell 3",
                    fill: false,
                    data: voltCell7Values,
                    borderColor: '#354458',
                    borderWidth: 2,
                    pointRadius: 0
                },
                {
                    label: "Cell 4",
                    fill: false,
                    data: voltCell8Values,
                    borderColor: '#eb7260',
                    borderWidth: 2,
                    pointRadius: 0
                }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: false,
                    }

                }],
                xAxes: [{
                    ticks: {
                        display: false

                    },
                    gridLines: {
                        display: false
                    }
                }]
            },
            elements: {
                line: {
                    tension: 0// disables bezier curves
                }
            },
            legend: {
                display: true
            },
            tooltips: {
                enabled: true,
                mode: 'single',
                callbacks: {
                    label: function (tooltipItems, data) {
                        return tooltipItems.yLabel + 'V';
                    }
                }
            }
        }


    });
}

function drawSocGraph() {

    var ctx = document.getElementById("socChart");
    socGraph = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeElapsed,
            datasets: [{
                label: "Cell 1",
                fill: false,
                data: socCell1Values,
                borderColor: '#3a9ad9',
                borderWidth: 2,
                pointRadius: 0
            },
            {
                label: "Cell 2",
                fill: false,
                data: socCell2Values,
                borderColor: '#29aba4',
                borderWidth: 2,
                pointRadius: 0
            },
            {
                label: "Cell 3",
                fill: false,
                data: socCell7Values,
                borderColor: '#354458',
                borderWidth: 2,
                pointRadius: 0
            },
            {
                label: "Cell 4",
                fill: false,
                data: socCell8Values,
                borderColor: '#eb7260',
                borderWidth: 2,
                pointRadius: 0
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        min: 0,
                        max: 100
                    }

                }],
                xAxes: [{
                    ticks: {
                        min: 0,
                        max: 4000,
                        display: false
                    },
                    gridLines: {
                        display: false
                    }
                }]
            },
            elements: {
                line: {
                    tension: 0// disables bezier curves
                }
            },
            legend: {
                display: true
            },
            tooltips: {
                enabled: true,
                mode: 'single',
                callbacks: {
                    label: function (tooltipItems, data) {
                        return tooltipItems.yLabel + ' %';
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

function drawGraphs(data) {

    socCell1Values.push(data['cell1_soc']);
    socCell2Values.push(data['cell2_soc']);
    socCell7Values.push(data['cell7_soc']);
    socCell8Values.push(data['cell8_soc']);
    voltCell1Values.push(data['cell1_voltage']);
    voltCell2Values.push(data['cell2_voltage']);
    voltCell7Values.push(data['cell7_voltage']);
    voltCell8Values.push(data['cell8_voltage']);

    timeElapsed.push(data['time_elapsed']);

    drawSocGraph();
    drawVoltageGraph();
    graphDrawn = true;

}

function updateGraphs(data) {

    socGraph.data.labels.push(data['time_elapsed']);

    socGraph.data.datasets[0].data.push(data['cell1_soc']);

    socGraph.data.datasets[1].data.push(data['cell2_soc']);

    socGraph.data.datasets[2].data.push(data['cell7_soc']);

    socGraph.data.datasets[3].data.push(data['cell8_soc']);

    socGraph.update();

    voltageGraph.data.datasets[0].data.push(data['cell1_voltage']);

    voltageGraph.data.datasets[1].data.push(data['cell2_voltage']);

    voltageGraph.data.datasets[2].data.push(data['cell7_voltage']);

    voltageGraph.data.datasets[3].data.push(data['cell8_voltage']);

    voltageGraph.update();
}


$(document).ready(function () {


});
