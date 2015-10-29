var equations = [];
$(document).ready(function(){
    $("#US").click(function() {
       alert($(this).attr("id"));        
    });
    $("#errt").click(function() {
       alert($(this).attr("id"));        
    });

    var svg = document.getElementsByTagName('svg')[0]; //Get svg element
    var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'circle'); //Create a path in SVG's namespace
    newElement.setAttribute("id", "testest"); //Set path's data
    newElement.setAttribute("cx", 200); //Set path's data
    newElement.setAttribute("cy", 100); //Set path's data
    newElement.setAttribute("r", 50); //Set path's data
    newElement.style.stroke = "#000"; //Set stroke colour
    newElement.style.strokeWidth = "5px"; //Set stroke width
    //svg.appendChild(newElement);
    $("#testest").click(function() {
       alert($(this).attr("id"));        
    });
    $("#myEquation").keydown(function(evt){
        if(evt.keyCode == 13){
            display_equation();
        }
    });
});


function drawTree(){
    equations[0].calculateLeafIndex(0);
    drawNode(equations[0]);
}

function drawNode(node){
    function midX(a, b){
        return ((a.x + b.x)/2)
    }
    console.log("Drawing:",node);
    var svg = document.getElementsByTagName('svg')[0]; //Get svg element
    var position = {x: 0, y: 0};
    var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
    switch(node.type){
        case 'Equation':
            var leftPos = drawNode(node.left);
            var rightPos = drawNode(node.right);
            position ={x: midX(leftPos, rightPos), y: node.depth()*50}
            newElement.textContent = '=';
            break;
        case 'Op':
            var leftPos = drawNode(node.left);
            var rightPos = drawNode(node.right);
            position ={x: midX(leftPos, rightPos), y: node.depth()*50}
            newElement.textContent = node.op;
            break;
        case 'Parens':
            var childPos = drawNode(node.child);
            position ={x: childPos.x, y: node.depth()*50}
            newElement.textContent = '( )';
            break;
        case 'Function':
            var childrenPos = (node.params).map(function(param){return drawNode(param)});
            position ={x: childrenPos[0].x, y: node.depth()*50} //UPDATE THIS LATER
            newElement.textContent = node.name;
            break;
        case 'Variable': 
            position ={x: node.leafIndex*50, y: node.depth()*50} 
            newElement.textContent = node.name;
            break;
        case 'Number':
            position ={x: node.leafIndex*50, y: node.depth()*50} 
            newElement.textContent = String(node.value);
            break;
        default: break;
    }
    newElement.setAttribute("x", position.x);
    newElement.setAttribute("y", position.y);
    svg.appendChild(newElement);
    return position;
}