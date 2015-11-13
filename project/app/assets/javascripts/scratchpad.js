var equations = [];
var svgscale = 1;
var draggingSVG = false;
var svgtranslate = {x:0, y:0}
var lastMouseEvtPoint = {x:0, y:0}
var scratchpad_title = "";
var isPublic = false;

function transformSVG(element, scale, translate){
    //console.log('transformsvg', scale, translate)
    scale = (typeof scale !== 'undefined' ? scale : 1);
    translate = (typeof translate !== 'undefined' ? translate : {x:0, y:0});
    svgscale = svgscale*scale;
    svgtranslate = {x:svgtranslate.x - (translate.x/svgscale), y:svgtranslate.y - (translate.y/svgscale)};
    svggroup.setAttribute('transform', 
        'scale('+String(svgscale)+') translate('+svgtranslate.x+','+svgtranslate.y+')')
}

function positionDelta(a, b){
    return {x: b.x-a.x, y:b.y-a.y};
}

function getOffsetPoint(mouseevent){
    return {x:mouseevent.offsetX, y:mouseevent.offsetY}
}

function getNegativeOffset(mouseevent){
    return {x:-mouseevent.offsetX, y:-mouseevent.offsetY}
}

$(document).ready(function(){
    
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
    
    
    svggroup = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    svggroup.setAttribute('id', 'svggroup');
    svg.oncontextmenu = function (e) { //Prevents right-click context menu from popping up
        e.preventDefault();
        //console.log(e);
    };
    
    
    transformSVG(svggroup, svgscale, svgtranslate);
    svg.appendChild(svggroup);
    svggroup.appendChild(newElement);
    $(svg).on('mousewheel DOMMouseScroll', function(evt){
        var amount = evt.originalEvent.wheelDelta;
        evt.preventDefault();
        transformSVG(svggroup, 1, getOffsetPoint(evt));
        transformSVG(element=svggroup, scale=(amount >0 ? 6/5 : 5/6));
        transformSVG(svggroup, 1, getNegativeOffset(evt));
    });
    $(svg).on('mousedown', function(evt){
        lastMouseEvtPoint = getOffsetPoint(evt);
        draggingSVG = true;
        $("svg").css('cursor', '-webkit-grabbing');
    });
    $(window).on('mouseup', function(evt){
        draggingSVG = false;
        $("svg").css('cursor', '-webkit-grab');
    });
    $(svg).on('mousemove', function(evt){
        if(draggingSVG){
            transformSVG(svggroup, 1, positionDelta(getOffsetPoint(evt), lastMouseEvtPoint));
            lastMouseEvtPoint = getOffsetPoint(evt);
        }
    });
    $("svg").css('cursor', '-webkit-grab');
});

function drawTree(){
    var equation = equations[equations.length -1]
    var svggroup = document.getElementById('svggroup'); //Get svg element
    while (svggroup.lastChild) {
        svggroup.removeChild(svggroup.lastChild);//Remove all of the elements in the svg element, if there are any
    }
    equation.initTree();//Initialize all of the data we need to draw the tree
    var linegroup = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    //line group is a group containing all of the lines between nodes, specifically
    //put into the svg element first so that all of the lines are behind all
    //of the circles and text. Otherwise, you see the lines on top.
    svggroup.appendChild(linegroup);
    drawNode(equation, svggroup, linegroup);
}

function drawNode(node, svggroup, linegroup){
    var group = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    //g is a group containing circle and text. 
    //Putting them in a group helps deal with which one should overlap the other.
    var circ = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
    
    for (var child_index in node.children()){
        //Recursively draws every child, then puts a line 
        //from this node to the child node in a background "line group"
        var child = node.children()[child_index]
        drawNode(child, svggroup, linegroup);
        
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
    $(circ).css('cursor', 'pointer');
    
    text.style['font-family']="Arial";
    text.style['font-size']="24";
    text.setAttribute("alignment-baseline", "middle"); //Horizontally centers text
    text.setAttribute("text-anchor","middle"); //Vertically centers text (very important!)
    text.setAttribute("x", node.position.x);
    text.setAttribute("y", node.position.y+50);
    text.style.fill="#f0f0f0"
    $(text).css('cursor', 'pointer');
    
    
    svggroup.appendChild(group);
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



angular.module('Algebreezy', [])
.controller('MainCtrl', [
'$scope',
function($scope){

    $scope.display_equation = function() {
        console.log("testing1");
        thisEqn = parser.parse($("#myEquation").val())
        equations.push(thisEqn);
        $("#equation_view").append('<div class="equation_line"> \\( '+thisEqn.toLatex()+" \\) </div>");
        MathJax.Hub.Queue(["Typeset",MathJax.Hub,document.getElementById('equation_view')]);
        console.log("testing2", $("#equation_view").text());
        drawTree();
    }

    $scope.display_comment = function() {
        console.log("fart");
        $("#equation_view").append("<div class='comment_line'>" + document.getElementById("myComment").value + "</div>");
    }

    $scope.request_save = function() {
        //turn equations into JSON
        //display "data is being saved"
        //send JSON to server
        $.ajax({
            url: "/save_scratchpad_data",
            type: 'post',
            data: {equations: equations.map(function(eqn){return eqn.toPlainText();}).join(';'),
                   title: scratchpad_title,
                   isPublic: false,
                   shared_users: ""}
                   ,
            headers: {'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')},
            success: function(data){console.log(data);}
        })
        //display "save successful" or "save unsuccessful!"
    }

    $scope.displayEqnKey = function($event) {
        if ($event.keyCode === 13) {
          console.log("poop");
            $scope.display_equation();
        }
        else {
            angular.noop;
        }
    }

    $scope.displayCommentKey = function($event) {
        if ($event.keyCode === 13) {
          console.log("pee");
            $scope.display_comment();
        }
        else {
            angular.noop;
        }
    }
}]);

