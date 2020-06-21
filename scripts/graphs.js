google.charts.load("current", {packages:["corechart"]});
$(function(){

//----------------------------------------LINE CHART----------------------------------------
    $("#line").on('click', function(e){

        e.preventDefault();
        if(fileExist()){

            if($("#AvgWages").is(":checked")){

                //Avgwage line chart
                avgWageGraph("line");
               

            }else if($("#EstimatedPopulation").is(":checked")){

                // Est pop line chart
                estPopGraph("line");

            }else{
                document.getElementById('messageArea').innerHTML = "Please select AvgWage or Estimated Population to view this line chart";
            }
        }else{
            document.getElementById('messageArea').innerHTML = "Please upload a file to view this line chart";
        }

    });

//----------------------------------------PIE CHART----------------------------------------
    $("#pie").on('click', function(e){

        e.preventDefault();
        if(fileExist()){

            if($("#State").is(":checked")){

                //State Pie chart
                stateGraphs("pie");

            }else{
                document.getElementById('messageArea').innerHTML = "Please select State to view this pie chart";
            }
        }else{
            document.getElementById('messageArea').innerHTML = "Please upload a file to view this pie chart";
        }

    });

 //----------------------------------------BAR CHART----------------------------------------   
    $("#bar").on('click', function(e){

        e.preventDefault();
        if(fileExist()){

            if($("#AvgWages").is(":checked")){

                //Avgwage bar chart
                 avgWageGraph("bar");
                

            }else if($("#EstimatedPopulation").is(":checked")){

                // Est pop bar chart
                estPopGraph("bar");

            }else if($("#State").is(":checked")){

                // State Bar Graph
                stateGraphs("bar");

            }else{
                document.getElementById('messageArea').innerHTML = "Please select AvgWage or Estimated Population to view this bar chart";
            }
        }else{
            document.getElementById('messageArea').innerHTML = "Please upload a file to view this bar chart";
        }    
        
    });

//-------------------------------------------------------------File Exist Function-------------------------------------------------------------
    function fileExist(){

        return !(document.getElementById('csvFileButton').files[0] == null);

    }

//-------------------------------------------------------------Graph Functions-------------------------------------------------------------
    //Average Wage calculation and graph printing function 
    function avgWageGraph(graph_type){

        var avgWageState = new Object();

        for(var i = 1; i<lines.length-1;i++){

            input = lines[i].split(",");
            var state = input[4];
            var avgWage = parseFloat(input[20]);
            if(isNaN(avgWage)){}else{
            if(avgWageState.hasOwnProperty(state)){

                avgWageState[state].avgState += avgWage;
                avgWageState[state].count+= 1;

            }else{
                avgWageState[state] = {'avgState' : avgWage, 'count' : 1};
            }
                    
        }
    }
                
        for(var key in avgWageState){

            avgWageState[key].avgState =  avgWageState[key].avgState / avgWageState[key].count;
            avgWageState[key].count = "";

        }

        var data = new google.visualization.DataTable();

        data.addColumn('string', 'State');
        data.addColumn('number', 'Average Wage');
    
        for(var key in avgWageState){

            avgStateGraph = avgWageState[key].avgState;
            data.addRow([key , avgStateGraph]);

        }

        var formatter = new google.visualization.NumberFormat({
            prefix: '$',   
        });


        var options = {
            title: 'Average wages by State',
            width: '95%',    
            };     
        
        var chart1 = new google.visualization.LineChart(document.getElementById('graph1'));
        var chart2 = new google.visualization.BarChart(document.getElementById('graph2'));
        chart1.draw(data, options);
        chart2.draw(data, options)

    }

    // Estimiated Population and graph printing function
    function estPopGraph(graph_type){

        var estPopState = new Object();

        // Loop for adding states
        for(var i = 1; i<lines.length-1;i++){

            input = lines[i].split(",");
            var state = input[4];
            var estPop = parseInt(input[17]);
            if(isNaN(estPop)){}else{
            if(estPopState.hasOwnProperty(state)){
                estPopState[state].estPop += estPop;
                estPopState[state].count+= 1;
            }else{
                    estPopState[state] = {'estPop' : estPop, 'count' : 1};
                }
                    
            }
        }
        // Calculating Average
        for(var key in estPopState){
            estPopState[key].estPop =  estPopState[key].estPop / estPopState[key].count;
            estPopState[key].count = "";
        }

        var data = new google.visualization.DataTable();

        data.addColumn('string', 'State');
        data.addColumn('number', 'Estimated Population');

        console.log(estPopState);
        for(var key in estPopState){
            data.addRow([key , parseInt(estPopState[key].estPop)]);
        }
          
        var options = {
            title: 'Average Estimated Population by State based on number of zipcodes per state',
            width: '95%',
        };

        var chart1 = new google.visualization.LineChart(document.getElementById('graph1'));
        var chart2 = new google.visualization.BarChart(document.getElementById('graph2'));   
          
        chart1.draw(data, options);
        chart2.draw(data, options);
    }

    // State Calculation and graph printing function
    function stateGraphs(graph_type){

        var stateCount = new Object();

        for(var i = 1; i<lines.length-1;i++){

            input = lines[i].split(",");
            var state = input[4];

            if(stateCount.hasOwnProperty(state)){
                stateCount[state].count+= 1;
            }else{
                stateCount[state] = {'count' : 1};
            }
                    
        }    
        
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'State');
        data.addColumn('number', 'Count');

        for(var key in stateCount){
            data.addRow([key , parseInt(stateCount[key].count)]);
        }

        var options = {
            title: 'Count of each state in table',
            width: '95%',
        };

        var chart1 = new google.visualization.PieChart(document.getElementById('graph1'));
        var chart2 = new google.visualization.BarChart(document.getElementById('graph2'));   
        
        chart1.draw(data, options);
        chart2.draw(data, options);

    }

    // ---------------------------------------Correlation Check---------------------------------------------
    $("#analytics").on('click', function(e){

        e.preventDefault();
    
        var cor = new Array();
        var wage = new Array();
        var pop = new Array();
        var linedata = new Object();

        

        document.getElementById("messageArea").innerHTML = "Correlation is " + correlation;
        var data = new google.visualization.DataTable();

        data.addColumn('string', 'State');
        data.addColumn('number', 'Average Wage');
        data.addColumn('number', 'Estimated Population');

        for(var index in globalavgWage){

            var state = globalavgWage[index].state;
            var avgwage = globalavgWage[index].avgwage;
            var estpop = globalestPop[index].estpop;

            if(avgWageSlider.value>avgwage && estpopSlider.value>estpop){
            }else if(avgWageSlider.value>avgwage){
                // If Avgwage is lower than slider value
                if(linedata.hasOwnProperty(state)){
                    linedata[state].estpop += estpop;
                    linedata[state].popcount++;
                    pop.push(estpop);
                }else{
                    linedata[state] = {'avgwage': 0, 'estpop': estpop, 'wagecount': 0, 'popcount': 1};
                    pop.push(estpop);
                }

            }else if(estpopSlider.value>estpop){
                // If estpop is lower than slider value
                if(linedata.hasOwnProperty(state)){
                    linedata[state].avgwage += avgwage;
                    linedata[state].wagecount++;
                    wage.push(avgwage);
                }else{
                    linedata[state] = {'avgwage': avgwage, 'estpop': 0, 'wagecount': 1, 'popcount': 0};
                    wage.push(avgwage);
                }

            }else{
                // If both values are above 
                if(linedata.hasOwnProperty(state)){
                    linedata[state].avgwage += avgwage;
                    linedata[state].estpop += estpop;
                    linedata[state].wagecount++;
                    linedata[state].popcount++;
                    wage.push(avgwage);
                    pop.push(estpop);
                }else{
                    linedata[state] = {'avgwage': avgwage, 'estpop': estpop, 'wagecount': 1, 'popcount': 1};
                    wage.push(avgwage);
                    pop.push(estpop);
                }
            }

        }

        cor.push(wage);
        cor.push(pop);

        var correlation = pearsonCorrelation(cor, 0,1);

        document.getElementById("messageArea").innerHTML = "Correlation is " + correlation;

        console.log(linedata);

        for(var key in linedata){

            linedata[key].avgwage = linedata[key].avgwage/linedata[key].wagecount;
            linedata[key].estpop = linedata[key].estpop/linedata[key].popcount;

            data.addRow([key,  linedata[key].avgwage, linedata[key].estpop]);
        }

        var options = {
            title: 'Correlation Graph for Average Wage and Estimated Population',
            curveType: 'function',
            legend: { position: 'bottom' },
            series:{
                0: {color: 'red'},
                1: {color: 'green'}
            }

          };

        var chart = new google.visualization.LineChart(document.getElementById('graph1'));
        
        chart.draw(data,options);
  

    })

});