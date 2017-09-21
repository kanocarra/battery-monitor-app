/**
 * Created by kanocarra on 14/08/16.
 */
var statusRef;
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
var stopGraphs;
var drawCell1 = false;
var drawCell2 = false;
var drawCell7 = false;
var drawCell8 = false;

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
            drawSocGraph();
            drawVoltageGraph();
        });
    });


}());

function subscribeToLogForKey(key) {
    console.log("Getting information for the log: " + key);
    const reference = firebase.database().ref("logs/" + key);


    //Subscribe to the database reference.
    reference.on("child_added", function (data) {
        updateGraphs(data.val());
    })
}

function drawVoltageGraph() {

    var ctx = document.getElementById("voltageChart-modal");
    voltageGraph = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeElapsed,
            datasets: [{
                label: "Cell 1",
                fill: false,
                data: voltCell1Values,
                borderColor: '#3a9ad9',
                borderWidth: 5,
                pointRadius: 0
            },
                {
                    label: "Cell 2",
                    fill: false,
                    data: voltCell2Values,
                    borderColor: '#29aba4',
                    borderWidth: 5,
                    pointRadius: 0
                },
                {
                    label: "Cell 3",
                    fill: false,
                    data: voltCell7Values,
                    borderColor: '#354458',
                    borderWidth: 5,
                    pointRadius: 0
                },
                {
                    label: "Cell 4",
                    fill: false,
                    data: voltCell8Values,
                    borderColor: '#eb7260',
                    borderWidth: 5,
                    pointRadius: 0
                }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: false
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
                display: false
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

    var ctx = document.getElementById("socChart-modal");
    socGraph = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeElapsed,
            datasets: [{
                label: "Cell 1",
                fill: false,
                data: socCell1Values,
                borderColor: '#3a9ad9',
                borderWidth: 5,
                pointRadius: 0
            },
            {
                label: "Cell 2",
                fill: false,
                data: socCell2Values,
                borderColor: '#29aba4',
                borderWidth: 5,
                pointRadius: 0
            },
            {
                label: "Cell 3",
                fill: false,
                data: socCell7Values,
                borderColor: '#354458',
                borderWidth: 5,
                pointRadius: 0
            },
            {
                label: "Cell 4",
                fill: false,
                data: socCell8Values,
                borderColor: '#eb7260',
                borderWidth: 5,
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
                        return tooltipItems.yLabel + ' %';
                    }
                }
            }
        }


    });
}

function updateStats(statusData) {

    isCharging = statusData['isCharging'];

    if(statusData['is_charging']) {
        $('.battery-fill-cell1').height(280);
        $('.battery-fill-cell2').height(280);
        $('.battery-fill-cell7').height(280);
        $('.battery-fill-cell8').height(280);
        var isBalancing = (statusData['is_balancing'] >>> 0).toString(2);
        console.log(isBalancing);
        if(isBalancing.length == 8 && isBalancing[0] == '1'){
            $('.battery-fill-cell1').css({'background-color' : '#191969'});
        } else {
            $('.battery-fill-cell1').css({'background-color' : '#006633'});
        }
        if(isBalancing.length == 8 && isBalancing[1] == '1' || isBalancing.length == 7 && isBalancing[0] == '1'){
            $('.battery-fill-cell2').css({'background-color' : '#191969'});
        } else {
            $('.battery-fill-cell2').css({'background-color' : '#006633'});
        }

        if(isBalancing.length == 8 && isBalancing[6] == '1' || isBalancing.length == 7 && isBalancing[5] == '1' || isBalancing.length == 2 && isBalancing[1] == '1'){
            $('.battery-fill-cell7').css({'background-color' : '#191969'});
        } else {
            $('.battery-fill-cell7').css({'background-color' : '#006633'});
        }
        if(isBalancing.length == 1 && isBalancing[0] == '1' || isBalancing.length == 7 && isBalancing[6] == '1' || isBalancing.length == 2 && isBalancing[0] == '1'|| isBalancing.length == 8 && isBalancing[0] == '1'){
            $('.battery-fill-cell7').css({'background-color' : '#191969'});
        } else {
            $('.battery-fill-cell7').css({'background-color' : '#006633'});
        }
        $('.soc_voltage1').html('<p style="color:ghostwhite; font-size: 18px">' + '<i class="fa fa-bolt" style="font-size: 50px" aria-hidden="true"></i></br>' +
            statusData['cell1_voltage'] + 'V </p>');
        $('.soc_voltage1').html('<p style="color:ghostwhite; font-size: 18px">' + '<i class="fa fa-bolt" style="font-size: 50px" aria-hidden="true"></i></br>' +
            statusData['cell1_voltage'] + 'V </p>');
        $('.soc_voltage2').html('<p style="color:ghostwhite; font-size: 18px">' + '<i class="fa fa-bolt" style="font-size: 50px" aria-hidden="true"></i></br>' +
            statusData['cell2_voltage'] + 'V </p>');
        $('.soc_voltage7').html('<p style="color:ghostwhite; font-size: 18px">' + '<i class="fa fa-bolt" style="font-size: 50px" aria-hidden="true"></i></br>' +
            statusData['cell7_voltage'] + 'V </p>');
        $('.soc_voltage8').html('<p style="color:ghostwhite; font-size: 18px">' + '<i class="fa fa-bolt" style="font-size: 50px" aria-hidden="true"></i></br>' +
            statusData['cell8_voltage'] + 'V </p>');
        $('#current').html('<h1 class="card-text" style="color:ghostwhite">' + statusData['current'] + ' A</h1>');

    } else {
        $('.soc_voltage1').html('<p style="font-size: 18px">' + statusData['cell1_soc'] + '%</br>' +
            statusData['cell1_voltage'] + 'V </p>');
        $('.soc_voltage2').html('<p style="font-size: 18px">' + statusData['cell2_soc'] + '%</br>' +
            statusData['cell2_voltage'] + 'V </p>');
        $('.soc_voltage7').html('<p style="font-size: 18px">' + statusData['cell7_soc'] + '%</br>' +
            statusData['cell7_voltage'] + 'V </p>');
        $('.soc_voltage8').html('<p style="color:font-size: 18px">' + statusData['cell8_soc'] + '%</br>' +
            statusData['cell8_voltage'] + 'V </p>');
        $('#current').html('<h1 class="card-text" style="color:ghostwhite"> -' + statusData['current'] + ' A</h1>');

        var soc1 = statusData['cell1_soc'];
        var soc2 = statusData['cell2_soc'];
        var soc7 = statusData['cell7_soc'];
        var soc8 = statusData['cell8_soc'];

        if(soc1 >= 60) {
            $('.soc_voltage1').css({'color':'ghostwhite'})
        } else if (soc1 > 40 && soc1 < 60){
            $('.soc_voltage1').css({'color':'#c9d3da'})
        } else {
            $('.soc_voltage1').css({'color':'#36454f'})
        }

        if(soc1 < 5) {
            $('.battery-fill-cell1').css({'background-color': '#e60000'});
        } else if (soc1 < 20) {
            $('.battery-fill-cell1').css({'background-color' : '#ffea00'});
        } else {
            $('.battery-fill-cell1').css({'background-color' : '#006633'});
        }

        if (soc2 >= 60) {
            $('.soc_voltage2').css({'color':'ghostwhite'})
        } else if (soc2 > 40 && soc2 < 60){
            $('.soc_voltage2').css({'color':'#c9d3da'})
        } else {
            $('.soc_voltage2').css({'color':'#36454f'})
        }

        if(soc2 < 5) {
            $('.battery-fill-cell2').css({'background-color': '#e60000'});
        } else if (soc2 < 20) {
            $('.battery-fill-cell2').css({'background-color' : '#ffea00'});
        } else {
            $('.battery-fill-cell2').css({'background-color' : '#006633'});
        }


        if (soc7 >= 60) {
            $('.soc_voltage7').css({'color':'ghostwhite'});
        } else if (soc7 > 40 && soc7 < 60){
            $('.soc_voltage7').css({'color':'#c9d3da'})
        } else {
            $('.soc_voltage7').css({'color':'#36454f'})
        }

        if(soc7 < 5) {
            $('.battery-fill-cell7').css({'background-color': '#e60000'});
        } else if (soc7 < 20) {
            $('.battery-fill-cell7').css({'background-color' : '#ffea00'});
        } else {
            $('.battery-fill-cell7').css({'background-color' : '#006633'});
        }


        if (soc8 >= 60) {
            $('.soc_voltage8').css({'color':'ghostwhite'})
        } else if (soc8 > 40 && soc8 < 60){
            $('.soc_voltage8').css({'color':'#c9d3da'})
        } else {
            $('.soc_voltage8').css({'color':'#36454f'});
        }

        if(soc8 < 5) {
            $('.battery-fill-cell8').css({'background-color': '#e60000'});
        } else if (soc8 < 20) {
            $('.battery-fill-cell8').css({'background-color' : '#ffea00'});
        } else {
            $('.battery-fill-cell8').css({'background-color' : '#006633'});
        }


        var old_range = 100;
        var new_range = 280 - 10;
        var height1 = (((soc1 - 0) * new_range) / old_range) + 10;
        var height2 = (((soc2 - 0) * new_range) / old_range) + 10;
        var height7 = (((soc7 - 0) * new_range) / old_range) + 10;
        var height8 = (((soc8 - 0) * new_range) / old_range) + 10;

        $('.battery-fill-cell1').height(height1);
        $('.battery-fill-cell2').height(height2);
        $('.battery-fill-cell7').height(height7);
        $('.battery-fill-cell8').height(height8);

    }

    $('#voltage').html('<h1 class="card-text" style="color:ghostwhite">' + statusData['pack_voltage'] + ' V</h1>');

    $('#time').html('<h1 class="card-text">' + statusData['time_elapsed'] + ' s</h1>');
}

function updateGraphs(data) {

    socCell1Values.push(data['cell1_soc']);
    socCell2Values.push(data['cell2_soc']);
    socCell7Values.push(data['cell7_soc']);
    socCell8Values.push(data['cell8_soc']);
    voltCell1Values.push(data['cell1_voltage']);
    voltCell2Values.push(data['cell2_voltage']);
    voltCell7Values.push(data['cell7_voltage']);
    voltCell8Values.push(data['cell8_voltage']);
    timeElapsed.push(data['time_elapsed']);

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


function graphCell1(){
    $('#myModal').modal('show');
    $('h4.modal-title').text('Cell 1 Graphs');
    var ctx = document.getElementById("voltageChart-modal");
    drawCell1 = true;
    drawCell2 = false;
    drawCell7 = false;
    drawCell8 = false;
}

function graphCell2(){
    $('#myModal').modal('show');
    console.log('Cell2');
    $('h4.modal-title').text('Cell 2 Graphs');
    drawCell2 = true;
    drawCell1 = false;
    drawCell7 = false;
    drawCell8 = false;
}


function graphCell7(){
    $('#myModal').modal('show');
    console.log('Cell7');
    stopGraphs = false;
    $('h4.modal-title').text('Cell 3 Graphs');
    drawCell7 = true;
    drawCell2 = false;
    drawCell1 = false;
    drawCell8 = false;


}

function graphCell8(){
    $('#myModal').modal('show');
    console.log('Cell8');
    $('h4.modal-title').text('Cell 4 Graphs');
    drawCell8 = true;
    drawCell2 = false;
    drawCell7 = false;
    drawCell1 = false;

}


$(document).ready(function () {


});
