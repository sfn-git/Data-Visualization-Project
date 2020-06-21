google.charts.load('current', {'packages':['table']});
var dbglobal = null;
var globalavgWage = new Array();
var globalestPop = new Array();
$(function(){

    // When user clicks #db1
    $('#db1').on('click', function(e){

        e.preventDefault();
        document.getElementById('graph1').innerHTML = "";
        document.getElementById('graph2').innerHTML = "";
        document.getElementById('table_div').innerHTML = "";
        if(Cookies.get('uid') == !null){
            getdbData("vDV_Data1");
        }else{
            document.getElementById('messageArea').innerHTML = "You need to login to view Data Set 1";
        }
    });
    $('#db2').on('click', function(e){

        e.preventDefault();
        document.getElementById('graph1').innerHTML = "";
        document.getElementById('graph2').innerHTML = "";
        document.getElementById('table_div').innerHTML = "";
        if(Cookies.get('uid') == !null){
            getdbData("vDV_Data2");
        }else{
            document.getElementById('messageArea').innerHTML = "You need to login to view Data Set 2";
        }
    });
    $('#db3').on('click', function(e){

        e.preventDefault();
        document.getElementById('graph1').innerHTML = "";
        document.getElementById('graph2').innerHTML = "";
        document.getElementById('table_div').innerHTML = "";
        if(Cookies.get('uid') == !null){
            getdbData("vDV_Data3");
        }else{
            document.getElementById('messageArea').innerHTML = "You need to login to view Data Set 3";
        }
    });

    function getdbData(db){

        db = {"db": db};
        $.ajax({
            method: "POST",
            url: 'tables.php',
            data: db,
            success: function(response){
                response = JSON.parse(response);
                lines = null;
                dbglobal = response;
                newChartGlobal = response;
                drawdbTable(response, false);
            },
            error: function(response, status, error){
                console.log(error);
            }
        })
    }

    

    $('#AvgWages').on('change', function(e){

        e.preventDefault();
        avgCharts();
        

    });

    $('#EstimatedPopulation').on('change', function(e){

        e.preventDefault();
        estPopCharts();

    });

    $('#State').on('change', function(e){

        e.preventDefault();
        stateCharts();

    });

    function avgCharts(){

        var avgWagePerState = new Object();
        
        for(var i = 0; i<dbglobal.length; i++){

            var state = dbglobal[i].State;
            var avgWage = parseFloat(dbglobal[i].AvgWages);

            // If avgWage is not a number then it will not display on the chart, and will not count towards average. 
            if(isNaN(avgWage)){}else{
                if(avgWagePerState.hasOwnProperty(state)){
                    avgWagePerState[state].avgWage += avgWage;
                    avgWagePerState[state].count += 1;
                }else{
                    avgWagePerState[state] = {'avgWage' : avgWage, 'count' : 1};
                }
            }
        }

        for(var key in avgWagePerState){
            avgWagePerState[key].avgWage = avgWagePerState[key].avgWage /avgWagePerState[key].count; 
        }

        var data = new google.visualization.DataTable();

        data.addColumn('string', 'State');
        data.addColumn('number', 'Average Wage');

        for(var key in avgWagePerState){
            data.addRow([key, avgWagePerState[key].avgWage]);
        }

        var bar = new google.visualization.BarChart(document.getElementById('graph1'));
        var line  = new google.visualization.LineChart(document.getElementById('graph2'));

        bar.draw(data, {title: "Average wage Bar Chart"});
        line.draw(data, {title: "Average wage Line Chart"});

    }

    function estPopCharts(){

        var estPopPerState = new Object();

        for(var i=0; i<dbglobal.length; i++){

            var state = dbglobal[i].State;
            var estPop = parseInt(dbglobal[i].EstimatedPopulation);

            if(isNaN(estPop)){}{
                if(estPopPerState.hasOwnProperty(state)){
                    estPopPerState[state].pop +=estPop;
                    estPopPerState[state].count +=1;
                }else{
                    estPopPerState[state] = {"pop": estPop, "count": 1};
                }
            }        
        }

        var data = new google.visualization.DataTable();
        data.addColumn("string", "State");
        data.addColumn("number", "Est Population");

        for(var key in estPopPerState){
            estPopPerState[key].pop = parseInt(estPopPerState[key].pop/estPopPerState[key].count);
            data.addRow([key, estPopPerState[key].pop]);
        }

        var bar = new google.visualization.BarChart(document.getElementById('graph1'));
        var line  = new google.visualization.LineChart(document.getElementById('graph2'));

        bar.draw(data, {title: "Estimated Population Bar Chart"});
        line.draw(data, {title: "Estimated Population Line Chart"});

    }

    function stateCharts(){

        var stateCount = new Object();

        for(var i=0;i<dbglobal.length-1; i++){

            var state = dbglobal[i].State;
            
            if(stateCount.hasOwnProperty(state)){
                stateCount[state].count += 1;
            }else{
                stateCount[state] = {'count': 1};
            }

        }

        var data = new google.visualization.DataTable();
        data.addColumn('string', 'State');
        data.addColumn('number', 'Count');

        for(var key in stateCount){
            data.addRow([key, parseInt(stateCount[key].count)]);
        }

        var options = {
            title: 'Count of each state in database table',
            width: '95%',
        };

        var chart1 = new google.visualization.PieChart(document.getElementById('graph1'));
        var chart2 = new google.visualization.BarChart(document.getElementById('graph2'));   
        
        chart1.draw(data, options);
        chart2.draw(data, options);

    }

});

function drawdbTable(dbdata, isslider){

    if(dbdata.length > 100000){
        document.getElementById('messageArea').innerHTML = "Too many records to load!";
    }else{
    
        var data = new google.visualization.DataTable();
    
        // Columns to display from table. 
        data.addColumn('number', 'RecordNumber'); //0
        data.addColumn('number', 'Zipcode'); //1
        data.addColumn('string', 'City'); //2
        data.addColumn('string', 'State'); //3
        data.addColumn('number', 'EstimatedPopulation'); //4
        data.addColumn('number', 'AvgWages'); //5
        data.addColumn('number', 'Latitude'); //6
        data.addColumn('number', 'Longitude'); //7

        var tableSize = dbdata.length;
        var wageAvg = 0;
        var popAvg = 0;
        var divideAvgWage = tableSize;
        var divideAvgPop = tableSize;

        // Finding the min a max of est pop and avg wage
        var minAvgWage = parseFloat(dbdata[0].AvgWages);;
        var maxAvgWage = 0;
        var minEstPop = parseInt(dbdata[0].EstimatedPopulation);
        var maxEstPop = 0;

        var IQRCalc = new Array();

        for(var i=1; i<dbdata.length; i++){

            var recordNum = parseInt(dbdata[i].RecordNumber);
            var zipcode = parseInt(dbdata[i].Zipcode);
            var city = dbdata[i].City;
            var state = dbdata[i].State;
            var estpop = parseInt(dbdata[i].EstimatedPopulation);
            var avgwage = parseFloat(dbdata[i].AvgWages);
            var lat = parseInt(dbdata[i].Latitude);
            var lon = parseInt(dbdata[i].Longitude);


            if(minAvgWage>avgwage){
                minAvgWage=avgwage;
            }
            if(maxAvgWage<avgwage){
                maxAvgWage=avgwage;
            }
            if(minEstPop>estpop){
                minEstPop=estpop;
            }
            if(maxEstPop<estpop){
                maxEstPop=estpop;
            }

            if(isNaN(avgwage) && isNaN(estpop)){
                divideAvgWage--;
                divideAvgPop--;
            }else if(isNaN(avgwage)){
                divideAvgWage--;
                popAvg += estpop;
                globalestPop.push({"state": state, "estpop": estpop});
            }else if(isNaN(estpop)){
                divideAvgPop--;
                wageAvg += avgwage;
                IQRCalc.push(avgwage);
                globalavgWage.push({"state": state, "avgwage": avgwage});
            }else{
                wageAvg += avgwage;
                popAvg += estpop;
                IQRCalc.push(avgwage);
                globalavgWage.push({"state": state, "avgwage": avgwage});
                globalestPop.push({"state": state, "estpop": estpop});
            }
            
            data.addRow([recordNum, zipcode, city, state, estpop, avgwage, lat, lon]);

        }

        wageAvg = wageAvg /divideAvgWage;
        popAvg = parseInt(popAvg / divideAvgPop);

        IQR = ss.interquartileRange(IQRCalc)*1.5;
        var firstQ = Math.floor(Quartile(IQRCalc, .25)-IQR);
        var thirdQ = Math.round(Quartile(IQRCalc, .75)+IQR);

        document.getElementById("messageArea").innerHTML = "Outliers are located below " + firstQ + " and above " + thirdQ;

        var options = {
            showRowNumber: true,
            width: '100%',
            height: '98%',
            chartArea: {
            width: '100%'
            },
            allowHtml: true
        }

        var container = document.getElementById('table_div');
        var table = new google.visualization.Table(container);

        // google.visualization.events.addListener(table, 'ready', function(){

        //     for(var i=0; i<data.getNumberOfRows();i++){
        //         if(data.getValue(i,5)<firstQ || data.getValue(i,5)>thirdQ){
        //             console.log("Then This");
        //             container.getElementsByTagName('TR')[i+1].style.backgroundColor = 'yellow';
        //         }
        //     }

        // });

        if(isslider){
           //Changes color to red for average wages when the # is above average
            var formatter1 = new google.visualization.ColorFormat();
            formatter1.addRange(avgWageSlider.value, null, 'red', 'white');
            formatter1.format(data, 5);

            //Changes color to green for estimated population when the # is above the average
            var formatter2 = new google.visualization.ColorFormat();
            formatter2.addRange(estpopSlider.value, null, 'green', 'white');
            formatter2.format(data, 4); 

            // Outlier calculator
            // var formatter3 = new google.visualization.ColorFormat();
            // formatter3.addRange(null, firstQ, 'black', 'yellow');
            // formatter3.format(data, 5);

            // var formatter4 = new google.visualization.ColorFormat();
            // formatter4.addRange(thirdQ, null, 'black', 'yellow');
            // formatter4.format(data, 5);
            
            
        }else{
            //Changes color to red for average wages when the # is above average
            var formatter1 = new google.visualization.ColorFormat();
            formatter1.addRange(wageAvg, null, 'red', 'white');
            formatter1.format(data, 5);

            //Changes color to green for estimated population when the # is above the average
            var formatter2 = new google.visualization.ColorFormat();
            formatter2.addRange(popAvg, null, 'green', 'white');
            formatter2.format(data, 4);

            // // Outlier calculator
            // var formatter3 = new google.visualization.ColorFormat();
            // formatter3.addRange(null, firstQ, 'black', 'yellow');
            // formatter3.format(data, 5);

            // var formatter4 = new google.visualization.ColorFormat();
            // formatter4.addRange(thirdQ, null, 'black', 'yellow');
            // formatter4.format(data, 5);

            // Avg Wage update slider with values
            avgWageSlider.min = minAvgWage;
            avgWageSlider.max = maxAvgWage;
            avgWageSlider.value = wageAvg;
            document.getElementById("avgwageValue").innerHTML = wageAvg;

            // Est Pop update slider with values
            estpopSlider.min = minEstPop;
            estpopSlider.max = maxEstPop;
            estpopSlider.value = popAvg;
            document.getElementById("estpopValue").innerHTML = popAvg;

        }
        
        //Formats numbers to not have commas
        var formatter = new google.visualization.NumberFormat({pattern: '#####'});
        formatter.format(data, 1);
        formatter.format(data, 0);

        
        console.log("This First");
        table.draw(data, options);
        // document.getElementById('messageArea').innerHTML = "Successfully loaded " + tableSize + " records.";

        

    }
}

function Quartile(data, q) {
    data=data.sort();
    var pos = ((data.length) - 1) * q;
    var base = Math.floor(pos);
    var rest = pos - base;
    if( (data[base+1]!==undefined) ) {
      return data[base] + rest * (data[base+1] - data[base]);
    } else {
      return data[base];
    }
  }
