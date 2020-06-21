// Making Slider Global Variable
var avgWageSlider = document.getElementById("avgWageSlider");
var estpopSlider = document.getElementById("estPopSlider");

console.log(avgWageSlider);

$(function(){

    

    $('#avgWageSlider').mouseup(function(){
        console.log("Here");


        document.getElementById("avgwageValue").innerHTML = $(this).val();
        if(!dbglobal){
            drawTable(true);
            $("#analytics").click();
        }else if(!lines){
            drawdbTable(dbglobal, true);
            $("#analytics").click();
        }else{
            document.getElementById("messageArea").innerHTML = "Load data to manipulate it.";
        }

    })


        
    $('#estPopSlider').mouseup(function(){
        document.getElementById("estpopValue").innerHTML = $(this).val();
        if(!dbglobal){
            drawTable(true);
            $("#analytics").click();
        }else if(!lines){
            drawdbTable(dbglobal, true);
            $("#analytics").click();
        }else{
            document.getElementById("messageArea").innerHTML = "Load data to manipulate it.";
        }
            

    })

})