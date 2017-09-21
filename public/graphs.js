/**
 * Created by kanocarra on 21/09/17.
 */
/**
 * Created by kanocarra on 14/08/16.
 */
var socGraph;
var voltageGraph;
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
var isCharging;
var nowKey;
var reference;
var method;

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


    //Get the last element under the "logs" section. Please note the code below is only executed once.
    database.child('logs').limitToLast(1).once('value', function (snap) {
        //Get the key of the log.
        // The code below is a bit weird because we are using a `forEach` method when there is
        // only one element. But I couldn't find another way to get the key.
        snap.forEach(function(logSnapshot) {
            //Once we got the key, we pass it to the `subscribeToLogForKey` method.
            subscribeToLogForKey(logSnapshot.key);
            nowKey = logSnapshot.key;
        });
    });


}());

function subscribeToLogForKey(key) {
    console.log("Getting information for the log: " + key);
    reference = firebase.database().ref("logs/" + key);

    //Subscribe to the database reference.
    method = reference.on("child_added", function (data) {
        if(graphDrawn) {
            //This method will be called for each log entry added.
            updateGraphs(data.val());
        }else {
            drawGraphs(data.val());
        }
    });
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
                        beginAtZero: true
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
                        beginAtZero: false,
                        max: 100
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
                        return tooltipItems.yLabel + ' %';
                    }
                }
            },
        }


    });
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

    //voltageGraph.data.labels.push(data['time_elapsed']);

    voltageGraph.data.datasets[0].data.push(data['cell1_voltage']);

    voltageGraph.data.datasets[1].data.push(data['cell2_voltage']);

    voltageGraph.data.datasets[2].data.push(data['cell7_voltage']);

    voltageGraph.data.datasets[3].data.push(data['cell8_voltage']);

    voltageGraph.update();
}

function drawGraph(num) {
    reference.off('child_added', method);
    socCell1Values = [];
    socCell2Values = [];
    socCell7Values = [];
    socCell8Values = [];
    voltCell1Values = [];
    voltCell2Values = [];
    voltCell7Values = [];
    voltCell8Values = [];
    timeElapsed = [];
    graphDrawn = false;
    voltageGraph.destroy();
    socGraph.destroy();

    if(num == 1) {
        subscribeToLogForKey(nowKey);

    } else if (num ==2) {
        subscribeToLogForKey('2017-09-21-11:47');

    } else if (num ==3) {
        subscribeToLogForKey('2017-09-13-15:32');

    } else if (num ==4) {
        subscribeToLogForKey('2017-09-11-15:46');

    } else if (num ==5) {
        subscribeToLogForKey('2017-09-08-11:24');

    } else if (num ==6) {
        subscribeToLogForKey('2017-09-08-16:04');

    } else if (num ==7) {
        subscribeToLogForKey('2017-09-05-15:45');

    } else if (num ==8) {
        subscribeToLogForKey('2017-09-04-18:10');

    } else if (num ==9) {
        subscribeToLogForKey('2017-09-03-15:39');

    } else if (num ==10) {
        subscribeToLogForKey('2017-08-29-18:28');

    }

}




$(document).ready(function () {


});

