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
    svg.appendChild(newElement);
    svg.oncontextmenu = function (e) { //Prevents right-click context menu from popping up
        e.preventDefault();
        //console.log(e);
    };
});


function drawTree(){
    var svg = document.getElementsByTagName('svg')[0]; //Get svg element
    while (svg.lastChild) {
        svg.removeChild(svg.lastChild);//Remove all of the elements in the svg element, if there are any
    }
    equations[0].initTree();//Initialize all of the data we need to draw the tree
    var linegroup = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    //line group is a group containing all of the lines between nodes, specifically
    //put into the svg element first so that all of the lines are behind all
    //of the circles and text. Otherwise, you see the lines on top.
    svg.appendChild(linegroup);
    drawNode(equations[0], svg, linegroup);
}

function drawNode(node, svg, linegroup){
    var group = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    //g is a group containing circle and text. 
    //Putting them in a group helps deal with which one should overlap the other.
    var circ = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
    
    for (var child_index in node.children()){
        //Recursively draws every child, then puts a line 
        //from this node to the child node in a background "line group"
        var child = node.children()[child_index]
        drawNode(child, svg, linegroup);
        
        var line = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        line.setAttribute('d', ['M',node.position.x,node.position.y+50, 'L', child.position.x, child.position.y+50].join(' '));
        line.setAttribute('stroke', 'black');
        line.setAttribute('fill', 'transparent');
        linegroup.appendChild(line);
    }
    
    
    switch(node.type){ //Set what text should be in the node
        case 'Equation': text.textContent = '=';                break;
        case 'Op':       text.textContent = node.op;            break;
        case 'Parens':   text.textContent = '( )';              break;
        case 'Function': text.textContent = node.name;          break;
        case 'Variable': text.textContent = node.name;          break;
        case 'Number':   text.textContent = String(node.value); break;
        default: break;
    }
    circ.setAttribute("cx", node.position.x); //Set circle's x center
    circ.setAttribute("cy", node.position.y+50);  //Set circle's y center
    circ.setAttribute("r", 25); //Set radius
    circ.style.stroke="#101020" //outline color
    circ.style.fill="#5050a0"   //fill color
    
    text.style['font-family']="Arial";
    text.style['font-size']="24";
    text.setAttribute("alignment-baseline", "middle"); //Horizontally centers text
    text.setAttribute("text-anchor","middle"); //Vertically centers text (very important!)
    text.setAttribute("x", node.position.x);
    text.setAttribute("y", node.position.y+50);
    text.style.fill="#f0f0f0"
    
    svg.appendChild(group);
    group.appendChild(circ);
    group.appendChild(text);
    
    $(group).mousedown(genNodeClick(text));
}

function genNodeClick(text){
    return function(event){
        console.log(String(text.textContent) + [' left', ' middle', ' right'][event.which-1]); 
        event.preventDefault();
        event.stopPropagation();
        event.cancelBubble = true;
        return false;
    }
}


//f(x,y,z,p)=p*(x^(y+2)-z)
