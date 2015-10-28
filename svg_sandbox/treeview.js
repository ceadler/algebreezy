$("#US").click(function() {
   alert($(this).attr("id"));        
});
$("#errt").click(function() {
   alert($(this).attr("id"));        
});

var svg = document.getElementsByTagName('svg')[0]; //Get svg element
var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'circle'); //Create a path in SVG's namespace
newElement.setAttribute("cx", 200); //Set path's data
newElement.setAttribute("cy", 100); //Set path's data
newElement.setAttribute("r", 50); //Set path's data
newElement.style.stroke = "#000"; //Set stroke colour
newElement.style.strokeWidth = "5px"; //Set stroke width
//svg.appendChild(newElement);