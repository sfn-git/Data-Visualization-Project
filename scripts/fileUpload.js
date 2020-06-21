google.charts.load('current', {'packages':['table']});
var lines = null;
var tableHeader;

$(function(){

    $("#csvFile").on('click', function(e){

        e.preventDefault();
        $("#csvFileButton:hidden").trigger('click');

    });

    //Checks to see if browser is compatable. 
   function checkCompat(){
    var isCompatable = false;
    if(window.File && window.FileReader && window.FileList && window.Blob){
        isCompatable=true;
    }
    return isCompatable;
   }

   //If browser is compatable, then it will allow for file upload. Otherwise it will warn the user that it cannot. 
   if(checkCompat()){
    document.getElementById('csvFileButton').addEventListener('change', upload, false);
   }else{
        document.getElementById('messageArea').innerHTML = "This browser is not capable of file uploading";
   }

   //Code for when file is uploaded. 
   function upload(){

    var file = document.getElementById('csvFileButton').files[0];
    if(checkFile(file)){
        document.getElementById('messageArea').innerHTML = "File Successfully Uploaded!";
        document.getElementById('graph1').innerHTML = "";
        document.getElementById('graph2').innerHTML = "";
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function() {
            
            lines = reader.result.split("\n"); //array
            dbglobal = null;
            globalavgWage = new Array();
            globalestPop = new Array();
            tableHeader = lines[0].split(","); //gets header of csv file
            newChartConvert(lines);
           
            google.charts.setOnLoadCallback(drawTable);

            }

        }else{

            document.getElementById('messageArea').innerHTML = "Unable to load file.";

        }
    }

   function checkFile(file){

        var fileSize = file.size;
        var sizeInMeg = fileSize / 1048576;
        //Assume the user's device is 8gb since I am unable to check memory
        var sizeCheck = 8000*.05; 
        var fileName = file.name;

        var fileCheck = fileName.split(".");
        var fileType = fileCheck[fileCheck.length-1];
      

        if(sizeInMeg>sizeCheck){

            document.getElementById('table_div').innerHTML = "The data requires more memory than the client can offer";
            return false;

        }else if(fileType != "csv"){

            document.getElementById('table_div').innerHTML = "The data is in wrong format. Only CSV file can be loaded!";

        }else{return true;}

   }

   function newChartConvert(data){

        var counter = 0;
        var convertObject = new Array();
        for(var i=0; i<data.length; i++){

            if(i==0 || i==data.length-1){}else{

                var split = data[i].split(",");
                var state = split[4];
                var zipcode = split[1];
                var estpop = split[17];
                var avgwage = split[19];
                var city = split[3];
                var lat = split[7];
                var lon = split[8];
                convertObject.push({"AvgWages": avgwage, "City": city, "EstimatedPopulation": estpop, "Latitude": lat, "Longitude": lon, "State": state, "Zipcode": zipcode});

            }

        }
        newChartGlobal = convertObject;
   }

});


function drawTable(isslider){

    var data = new google.visualization.DataTable();

    //Loop for Header for table (Hard Coded for now)
    data.addColumn('number', 'RecordNumber');
    data.addColumn('number', 'Zipcode');
    data.addColumn('string', 'City');
    data.addColumn('string', 'State');
    data.addColumn('number', 'EstimatedPopulation');
    data.addColumn('number', 'AvgWages');
    data.addColumn('number', 'Latitude');
    data.addColumn('number', 'Longitude');        

    var input;
    var tableSize = (lines.length) - 2;
    
    var sumavgWage = 0;
    var sumestPop = 0;
    var estPopCount = 0;
    var avgWageCount = 0;

    input = lines[0].split(",");
    var minAvgWage = input[20];
    var maxAvgWage = 0;
    var minEstPop = input[17];
    var maxEstPop = 0;

    var IQRCalc = new Array();
    
    //Adding rows
    for(var i=1; i<tableSize; i++){

        input = lines[i].split(",");
        var recordNum = parseInt(input[0]);
        var zipCode = parseInt(input[1]);
        var city = input[3];
        var state = input[4];
        var estPop = parseInt(input[17]);
        var avgWage = parseFloat(input[20]);
        var lat = parseFloat(input[6]);
        var lon = parseFloat(input[7]);

        if(isNaN(avgWage)){}else{
            sumavgWage += avgWage;
            avgWageCount += 1;
            IQRCalc.push(avgWage);
            globalavgWage.push({'state': state, 'avgwage': avgWage});
        }
        
        if(isNaN(estPop)){}else{
            sumestPop += estPop;
            estPopCount +=1;
            globalestPop.push({'state': state, 'estpop': estPop})
        }

        if(minAvgWage>avgWage){
            minAvgWage = avgWage;
        }
        if(maxAvgWage<avgWage){
            maxAvgWage = avgWage
        }
        if(minEstPop>estPop){
            minEstPop = estPop;
        }
        if(maxEstPop<estPop){
            maxEstPop = estPop;
        }
    
        data.addRow([recordNum, zipCode, city, state, estPop, avgWage, lat, lon]);

    }

    sumavgWage = sumavgWage/avgWageCount;
    sumestPop = sumestPop/estPopCount;

    IQR = ss.interquartileRange(IQRCalc)*1.5;
    var firstQ = Math.floor(Quartile(IQRCalc, .25) - IQR);
    var thirdQ = Math.round(Quartile(IQRCalc, .75) + IQR);

    console.log("1ST Q: " + firstQ);
    console.log("3RD Q: " + thirdQ);
    console.log("IQR: " + IQR);

    document.getElementById("messageArea").innerHTML = "Outliers are located below " + firstQ + " and above " + thirdQ;

    var options = {
        showRowNumber: true,
        width: '100%',
        chartArea: {
            width: '100%'
        },
        allowHtml: true
    }

    var table = new google.visualization.Table(document.getElementById('table_div'));

    if(isslider){

        var formatter = new google.visualization.ColorFormat();
        formatter.addRange(avgWageSlider.value, null, 'red', 'white');
        formatter.format(data, 5);

        var formatter1 = new google.visualization.ColorFormat();
        formatter1.addRange(estpopSlider.value, null, 'green', 'white');
        formatter1.format(data, 4);

        // // Outlier calculator
        // var formatter3 = new google.visualization.ColorFormat();
        // formatter3.addRange(null, firstQ, 'black', 'yellow');
        // formatter3.format(data, 5);

        // var formatter4 = new google.visualization.ColorFormat();
        // formatter4.addRange(thirdQ, null, 'black', 'yellow');
        // formatter4.format(data, 5);

    }else{

        var formatter = new google.visualization.ColorFormat();
        formatter.addRange(sumavgWage, null, 'red', 'white');
        formatter.format(data, 5);

        var formatter1 = new google.visualization.ColorFormat();
        formatter1.addRange(sumestPop, null, 'green', 'white');
        formatter1.format(data, 4);

        avgWageSlider.min = minAvgWage;
        avgWageSlider.max = maxAvgWage;
        avgWageSlider.value = sumavgWage;
        document.getElementById("avgwageValue").innerHTML = sumavgWage;

        estpopSlider.min = minEstPop;
        estpopSlider.max = maxEstPop;
        estpopSlider.value = sumestPop;
        document.getElementById("estpopValue").innerHTML = sumestPop;

        // // Outlier calculator
        // var formatter3 = new google.visualization.ColorFormat();
        // formatter3.addRange(null, firstQ, 'black', 'yellow');
        // formatter3.format(data, 5);

        // var formatter4 = new google.visualization.ColorFormat();
        // formatter4.addRange(thirdQ, null, 'black', 'yellow');
        // formatter4.format(data, 5);

    }

    var formatter2 = new google.visualization.NumberFormat({pattern: '#####'});
    formatter2.format(data, 1);
    formatter2.format(data, 0);

    table.draw(data, options);

    // document.getElementById('messageArea').innerHTML = "Successfully loaded " + tableSize + " records.";

}