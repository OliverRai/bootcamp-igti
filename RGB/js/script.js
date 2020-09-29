window.addEventListener('load', start);
function start(){
    console.log('Carregado')
}

var red = document.querySelector("#red");
var green = document.querySelector("#green");
var blue = document.querySelector("#blue");
var inputRed = document.querySelector("#inputRed");
var inputGreen = document.querySelector("#inputGreen");
var inputBlue = document.querySelector("#inputBlue");

var divColor = document.querySelector("#div-color");

function testar(){
    inputRed.value = red.value;
    inputGreen.value = green.value;
    inputBlue.value = blue.value;

    rangeRed = red.value;
    rangeGreen = green.value;
    rangeBlue = blue.value;
    
    divColor.style.background = `rgb(${rangeRed}, ${rangeGreen}, ${rangeBlue})`;
}