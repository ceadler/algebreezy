var save_data = [];
var equations = [];
var svgscale = 1;
var draggingSVG = false;
var svgtranslate = {x:0, y:0}
var lastMouseEvtPoint = {x:0, y:0}
var scratchpad_title = "";
var isPublic = false;
var functionTable = new FunctionTableObject();

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
    
    var svg = document.getElementById('svgelem'); //Get svg element
    if(svg){
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
        
        
        
        save_data = (initial_data_str != "" ? initial_data_str.split(';') : [])
        //console.log('save data:', save_data);
        for (var d in save_data){
            //console.log('t',save_data[d]);
            var datum = save_data[d].split(':');
            var dataType = datum[0];
            var data = datum[1];
            //console.log(datum,": type:", dataType,"data:",data)
            if(dataType == "Comment"){
                newCommentLine(data)
            }
            else if(dataType == "Equation"){
                equations[equations.length-1] = parser.parse(data);
                newEquationLine(equations[equations.length-1]);
            }
        }
        MathJax.Hub.Queue(["Typeset",MathJax.Hub,document.getElementById('equation_view')]);
        drawTree();
    }
});

function drawTree(){
        if(equations.length > 0){
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
}

function drawNode(node, svggroup, linegroup){
    var group = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    //g is a group containing circle and text. 
    //Putting them in a group helps deal with which one should overlap the other.
    var circ = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    circ.colorFlag = true;
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
    
    $(group).mousedown(genNodeClick(text, node, circ));
/*    circ.addEventListener('click', changeNodeColor(circ));
    text.addEventListener('click', changeNodeColor(circ));*/
    circ.addEventListener('click', function() {
        if (circ.colorFlag) {
            circ.style.fill="#a05050";
            circ.colorFlag = !circ.colorFlag;
        }else {
            circ.style.fill="#5050a0";
            circ.colorFlag = !circ.colorFlag;
        }
    });
    text.addEventListener('click', function() {
        if (circ.colorFlag) {
            circ.style.fill="#a05050";
            circ.colorFlag = !circ.colorFlag;
        }else {
            circ.style.fill="#5050a0";
            circ.colorFlag = !circ.colorFlag;
        }
    });
}

/*function changeNodeColor(circ) {
    if (circ.colorFlag) {
        circ.style.fill="#a05050";
        circ.colorFlag = !circ.colorFlag;
    }else {
        circ.style.fill="#5050a0";
        circ.colorFlag = !circ.colorFlag;
    }
}*/

function genNodeClick(text, node){
    return function(event){
        //console.log(String(text.textContent) + [' left', ' middle', ' right'][event.which-1]); 
        event.preventDefault();
        event.stopPropagation();
        event.cancelBubble = true;
        
        var right_sidebar = $("#sidebar-right");
        right_sidebar.empty();
        var manipulations = node.generateManipulations()
        for (var m in manipulations){
            right_sidebar.append(manipulations[m]);
        }
        MathJax.Hub.Queue(["Typeset",MathJax.Hub,right_sidebar[0]]);
        return false;
    }
}
function newEquationLine(root){
    $("#sidebar-right").empty();
    equations.push(root);
    var eqn_view = $("#equation_view");
    var new_line = $("<div>", {class: "equation_line", html: '\\('+root.toLatex()+" \\)"});
    new_line.click(displayLatexAndPlaintext(root));
    eqn_view.append(new_line);
    //eqn_view.append('<div class="equation_line"> \\( '+root.toLatex()+" \\) </div>");
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,eqn_view[0]]);
    eqn_view[0].scrollTop = eqn_view[0].scrollHeight;
    drawTree();
}

function newCommentLine(comment){
    var eqn_view = $("#equation_view");
    eqn_view.append("<div class='comment_line'>" + comment + "</div>");
    eqn_view[0].scrollTop = eqn_view[0].scrollHeight;
}
function displayLatexAndPlaintext(node){
    return function(){
        $("#textOutputContainer").html("Plaintext: "+node.toPlainText()+"<br> LaTeX code: "+node.toLatex());
    }
}

request_save = function() {
        //turn equations into JSON
        //display "data is being saved"
        //send JSON to server
        //console.log("Saving data...",save_data.join(';'));
        $.ajax({
            url: "/save_scratchpad_data",
            type: 'post',
            data: {equations: save_data.join(';'),
                   id: scratchpad_id,
                   title: $('#scratchpad-title').val(),//scratchpad_title,
                   isPublic: $('#scratchpad-public').is(":checked"),
                   shared_users: ""}
                   ,
            headers: {'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')},
            //success: function(data){window.alert(data);}
        })
        //display "save successful" or "save unsuccessful!"
    }


$(document).bind('keydown', function(event) {
  if(event.ctrlKey && (event.which == 83)) {
    event.preventDefault();
    request_save();
    return false;
  }
});

$(document).bind('keydown', function(event) {
  if(event.ctrlKey && (event.which == 90)) {

    drawTree();
  }
});

angular.module('Algebreezy', [])
.controller('MainCtrl', [
'$scope',
function($scope){

    $scope.display_equation = function() {
        thisEqn = parser.parse($("#myEquation").val())
        save_data.push("Equation:"+thisEqn.toPlainText())
        //console.log(save_data.join(';'));
        newEquationLine(thisEqn);
        $scope.request_save();
    }

    $scope.display_comment = function() {
        save_data.push("Comment:"+document.getElementById("myComment").value)
        newCommentLine(document.getElementById("myComment").value);
        $scope.request_save();
    }

    $scope.request_save = function() {
        //turn equations into JSON
        //display "data is being saved"
        //send JSON to server
        //console.log("Saving data...",save_data.join(';'));
        $.ajax({
            url: "/save_scratchpad_data",
            type: 'post',
            data: {equations: save_data.join(';'),
                   id: scratchpad_id,
                   title: $('#scratchpad-title').val(),//scratchpad_title,
                   isPublic: $('#scratchpad-public').is(":checked"),
                   shared_users: ""}
                   ,
            headers: {'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')},
            //success: function(data){window.alert(data);}
        })
        //display "save successful" or "save unsuccessful!"
    }

    $scope.displayEqnKey = function($event) {
        if ($event.keyCode === 13) {
            $scope.display_equation();
        }
        else {
            angular.noop;
        }
    }

    $scope.displayCommentKey = function($event) {
        if ($event.keyCode === 13) {
            $scope.display_comment();
        }
        else {
            angular.noop;
        }
    }
}]);

