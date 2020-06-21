var newChartGlobal = new Object();
$(function(){

    $("#newChart").on('click', function(e){

        e.preventDefault();
        document.getElementById('graph1').innerHTML = "";
        document.getElementById('graph2').innerHTML = "";
        if(document.getElementById("AvgWages").checked){
            console.log("Average Wages is Checked");
            callMap(newChartGlobal);
            var newChartData = new Array();
            var valueState = new Object();

            for(var i=0;i<newChartGlobal.length;i++){
                var state = newChartGlobal[i].State;
                var avgWages = parseFloat(newChartGlobal[i].AvgWages);

                if(valueState.hasOwnProperty(state)){
                    valueState[state].avgwage +=avgWages;
                    valueState[state].count +=1;
                }else{
                    valueState[state] = {"avgwage": avgWages, "count": 1};
                }

            }

            for(var key in valueState){

                valueState[key].avgwage = valueState[key].avgwage/valueState[key].count;

                newChartData.push({"parent": "Average Wage", "id": key, "value": valueState[key].avgwage})
            }

            callNewGraph(newChartData);

        }else if(document.getElementById("EstimatedPopulation").checked){

            callMap(newChartGlobal);
            callMap(newChartGlobal);
            var newChartData = new Array();
            var valueState = new Object();

            for(var i=0;i<newChartGlobal.length;i++){
                var state = newChartGlobal[i].State;
                var estPop = parseFloat(newChartGlobal[i].EstimatedPopulation);

                if(valueState.hasOwnProperty(state)){
                    valueState[state].estPop +=estPop;
                    valueState[state].count +=1;
                }else{
                    valueState[state] = {"estPop": estPop, "count": 1};
                }

                console.log(valueState);

            }

            for(var key in valueState){

                avgestPop = valueState[key].estPop/valueState[key].count;

                newChartData.push({"parent": "Estimated Population", "id": key, "value": avgestPop})
            }

            callNewGraph(newChartData);

        }else if(document.getElementById("State").checked){
            // Tree Map
            var newChartData = new Array();
            var valueState = new Object();

            for(var i=0;i<newChartGlobal.length;i++){
                var state = newChartGlobal[i].State;

                if(valueState.hasOwnProperty(state)){
                    valueState[state].count +=1;
                }else{
                    valueState[state] = {"count": 1};
                }
            }

        for(var key in valueState){
            newChartData.push({"parent": "Count in table", "id": key, "value": valueState[key].count})
        }

        callNewGraph(newChartData);
        
        // Google Maps
        google.charts.load(
            'current', 
            {
                'packages': ['geochart']
            }
        )

        var data = new google.visualization.DataTable();

        data.addColumn("string", "State");
        data.addColumn("number", "Count");

        for(var key in valueState){
            data.addRow([key, valueState[key].count]);
        }

        var options = {

            title: "Count of State in Table",
            displayMode: 'regions',
            region: 'US',
            resolution: 'provinces',
            colorAxis: {colors: ['red']},
            backgroundColor: 'white'

        }

        var chart = new google.visualization.GeoChart(document.getElementById('graph2'));

        chart.draw(data, options);

        }else{
            document.getElementById("messageArea").innerHTML = "Select which data you would like to view in the tree map (radio buttons)";
        }

        // instantiate d3plus
        function callNewGraph(data){   

            var viz = new d3plus.viz()
                .container("#graph1")
                .data(data)
                .type("tree_map")
                .id(["id", "parent"])
                .size("value")
                .draw()

        }

        function callMap(data){

            var values = new Object();
            google.charts.load(
                'current', 
                {
                    'packages': ['geochart']
                }
            )

            var data = new google.visualization.DataTable();

            data.addColumn("string", "State");
            data.addColumn("number", "Average Wage");
            data.addColumn("number", "Estimated Population");

            for(var i=0;i<newChartGlobal.length;i++){

                var state = newChartGlobal[i].State;
                var avgWages = parseFloat(newChartGlobal[i].AvgWages);
                var estpop = parseInt(newChartGlobal[i].EstimatedPopulation);

                
                if(isNaN(avgWages) && isNaN(estpop)){
                    // Do Nothing
                    }else if(isNaN(avgWages)){
                    if(values.hasOwnProperty(state)){
                        values[state].estpop += estpop;
                        values[state].estPopCount += 1;
                    }else{
                        values[state] = {"estPop": estpop, "avgWage": 0, "estPopCount": 1, "avgWageCount": 0};
                    }

                }else if(isNaN(estpop)){
                    if(values.hasOwnProperty(state)){
                        values[state].avgWage += avgWages;
                        values[state].avgWageCount += 1;
                    }else{
                        values[state] = {"estPop": 0, "avgWage": avgWages, "estPopCount": 0, "avgWageCount": 1};
                    }

                }else{
                    if(values.hasOwnProperty(state)){
                        values[state].avgWage += avgWages;
                        values[state].avgWageCount += 1;
                        values[state].estPop += estpop;
                        values[state].estPopCount += 1;
                    }else{
                        values[state] = {"estPop": estpop, "avgWage": avgWages, "estPopCount": 1, "avgWageCount": 1};
                    }

                }
            }

            console.log(values);

            for(var key in values){

                var calcavgWage = values[key].avgWage/values[key].avgWageCount;
                var calcestPop = parseInt(values[key].estPop/values[key].estPopCount);
                data.addRow([key, calcavgWage, calcestPop]);

            }

            var options = {

                title: "Average Wage and Estimated Population in the US.",
                displayMode: 'regions',
                region: 'US',
                resolution: 'provinces',
                colorAxis: {colors: ['red']},
                backgroundColor: 'white'

            }

            var chart = new google.visualization.GeoChart(document.getElementById('graph2'));

            chart.draw(data, options);

        }

    })

})