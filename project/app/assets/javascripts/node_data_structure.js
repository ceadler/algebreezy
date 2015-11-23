//INSTANTIATIONS
function EquationNode(left, right) {
	this.left =  left;
	this.right = right;
    this.nodeDepth = null;
    this.parent = null;
    this.position = null;
};

function OpNode(op, left, right) {
	this.op =  op;
	this.left =  left;
	this.right =  right;
    this.nodeDepth = null;
    this.parent = null;
    this.position = null;
};

function ParensNode(child) {
	this.child = child;
    this.nodeDepth = null;
    this.parent = null;
    this.position = null;
}

function FunctionNode(name, params) {
    this.name = name;
	this.params = params;
    this.nodeDepth = null;
    this.parent = null;
    this.position = null;
}

function VarNode(name){
	this.name = name;
    this.leafIndex = null;
    this.nodeDepth = null;
    this.parent = null;
    this.position = null;
}

function NumberNode(value) {
	this.value = value;
    this.leafIndex = null;
    this.nodeDepth = null;
    this.parent = null;
    this.position = null;
}



//PROTOTYPES
function EquationNodeProto(left, right) {
	this.type = "Equation";
	this.toLatex = function() {
		return this.left.toLatex() + " = " + this.right.toLatex();
	}
	this.toEval = function() {
	}
	this.toPlainText = function() {
        return this.left.toPlainText() + "=" + this.right.toPlainText();
	}
	this.isEqual = function() {
	}
	this.isIsomorphic = function() {
	}
    this.width = function(){
        return this.left.width() + this.right.width();        
    }
    this.children = function(){
        return [this.left, this.right];
    }
    this.initTree = function(){
        this.setDepth();
        this.setParent(null);
        this.calculateLeafIndex();
        this.setPosition();
    }
    this.generateManipulations = function(){
        return [];
    }
};

function OpNodeProto(op, left, right) {
	this.type = "Op";
	this.toLatex = function() {
		switch (this.op) {
			case '+':
				return this.left.toLatex() + " + " + this.right.toLatex();
				break;
			case '-':
				return this.left.toLatex() + " - " + this.right.toLatex();
				break;
			case '*':
				return this.left.toLatex() + " \\cdot " + this.right.toLatex();
				break;
			case '/':
				return "\\frac{" + this.left.toLatex() + "}{" + this.right.toLatex() + "}";
				break;
			case '^':
				return this.left.toLatex() + "^{" + this.right.toLatex() + "}";
				break;
			default:
				return undefined;
				break;
		}
		//console.log(".");
	}
	this.toEval = function() {
	}
	this.toPlainText = function() {
        return this.left.toPlainText() + this.op + this.right.toPlainText();
	}
	this.isEqual = function() {
	}
	this.isIsomorphic = function() {
	}
    this.width = function(){
        return this.left.width() + this.right.width();        
    }
    this.children = function(){
        return [this.left, this.right];
    }
    this.generateManipulations = function(){
        var availableManipulations = [];
        
        if(canApplyOperation(this)){
            availableManipulations.push(makeButton("reduce number", applyOperation(this)));
        }
        
        //console.log("These are the manipulations available:", availableManipulations);
        return availableManipulations;
    }
};

function ParensNodeProto(child) {
	this.type = "Parens";
	this.toLatex = function() {
		return "(" + this.child.toLatex() + ")";
		//console.log(".");
	}
	this.toEval = function() {
	}
	this.toPlainText = function() {
        return '(' + this.child.toPlainText() + ')';
	}
	this.isEqual = function() {
	}
	this.isIsomorphic = function() {
	}
    this.width = function(){
        return this.child.width();        
    }
    this.children = function(){
        return [this.child];
    }
    this.generateManipulations = function(){
        return [];
    }
}

function FunctionNodeProto(name, params) {
	this.type = "Function";
	this.toLatex = function() {
		return " " + this.name + "(" + this.params.map(function(node){return node.toLatex()}).join(', ') + ") ";
		//console.log(".");
	}
	this.toEval = function() {
	}
	this.toPlainText = function() {
		return this.name + "(" + this.params.map(function(node){return node.toPlainText()}).join(',') + ")";
	}
	this.isEqual = function() {
	}
	this.isIsomorphic = function() {
	}
    this.width = function(){
        return this.params.map(function(node){return node.width();}).reduce(function(prev, curr){return prev+curr;},0);        
    }
    this.children = function(){
        return this.params;
    }
    this.generateManipulations = function(){
        return [];
    }
}

function VarNodeProto(name){
	this.type = "Variable";
	this.toLatex = function() {
		return " " + this.name + " ";
		//console.log(".");
	}
	this.toEval = function() {
	}
	this.toPlainText = function() {
		return this.name;
	}
	this.isEqual = function() {
	}
	this.isIsomorphic = function() {
	}
    this.width = function(){
        return 1;
    }
    this.calculateLeafIndex = function(prevIndex){//Override default LeafIndex function
        this.leafIndex = prevIndex+1;
        return this.leafIndex;
    }
    this.children = function(){
        return [];
    }
    this.generateManipulations = function(){
        return [];
    }
}

function NumberNodeProto(value) {
	this.type = "Number";
	this.toLatex = function() {
		return " " + this.value.toString() + " ";
		//console.log(".");
	}
	this.toEval = function() {
	}
	this.toPlainText = function() {
		return this.value.toString();
	}
	this.isEqual = function() {
	}
	this.isIsomorphic = function() {
	}
    this.width = function() {
        return 1;
    }
    this.calculateLeafIndex = function(prevIndex){ //Override default LeafIndex function
        this.leafIndex = prevIndex+1;
        return this.leafIndex;
    }
    this.children = function(){
        return [];
    }
    this.generateManipulations = function(){
        return [];
    }
}

//PROTOTYPE'S PROTOTYPE
//These functions should be very, very general and shared by all nodes.
//They should be implementation-independent.
function MathNodeProto(){
    this.depth = function(isAlternate){
        isAlternate = (typeof isAlternate !== 'undefined' ? isAlternate : false);
        if(this.nodeDepth == null){
            if(isAlternate){this.setAlternateDepth();}
            else{this.setDepth();}
        }
        return this.nodeDepth;
    }
    this.setDepth = function(prevDepth){
        prevDepth = (typeof prevDepth !== 'undefined' ? prevDepth : -1);
        this.nodeDepth = prevDepth+1;
        for(var child in this.children()){
            this.children()[child].setDepth(this.nodeDepth);
        }
    }
    this.setAlternateDepth = function(){
    console.log("CALL TO ALTERNATE DEPTH", this);
        if(!this.nodeDepth){
            this.nodeDepth = Math.max.apply(null, this.children().map(function(node){return node.setAlternateDepth()}).concat(0))+1;
        }
        return this.nodeDepth;
    }
    this.setParent = function(nodeParent){
        nodeParent = (typeof nodeParent !== 'undefined' ? nodeParent : null);
        this.parent = nodeParent;
        for(var child in this.children()){
            this.children()[child].setParent(this);
        }
    }
    
    this.calculateLeafIndex = function(prevIndex){
        prevIndex = (typeof prevIndex !== 'undefined' ? prevIndex : 0);
        var lastParamIndex = prevIndex;
        for (var child in this.children()){
            lastParamIndex = this.children()[child].calculateLeafIndex(lastParamIndex);
        }
        return lastParamIndex;
    }
    
    this.setPosition = function(){
        var posX = null;
        if(this.type == "Number" || this.type == "Variable"){
            posX = this.leafIndex*65;
        }
        else{
            for(var child in this.children()){
                this.children()[child].setPosition();
            }
            var childrenPosX = this.children().map(function(node){return node.position.x;})
            posX = arraySum(childrenPosX)/this.children().length;
        }
        var posY = this.depth()*60;
        this.position = {x:posX, y:posY};
    }
    this.root = function(){
        var parent = this;
        while(parent.parent != null){
            parent = parent.parent;
        }
        return parent;
    }
    this.replaceWith = function(node){
        var par = this.parent
        //console.log("Before:", this.parent.children(), this.root());
        switch(par.type){
            case null: break; //If we're on an equation node. Not sure what to do here yet, if anything
            case "Equation": 
                if(par.left === this){ par.left  = node}
                if(par.right === this){par.right = node}
                break;
            case "Op":
                if(par.left === this){ par.left  = node}
                if(par.right === this){par.right = node}
                break;
            case "Function":
                for (var c in par.params){
                    if (this === par.params[c]){par.params[c] = node}
                }
                break;
            case "Parens": break;
                if(par.child === this){ par.child  = node}
                break;
            case "Variable": break; //This can never happen
            case "Number": break; //This can never happen
            default: break;
        }
        //console.log("After:", this.parent.children(), this.root());
        equations.push(this.root());
        $("#equation_view").append('<div class="equation_line"> \\( '+this.root().toLatex()+" \\) </div>");
        MathJax.Hub.Queue(["Typeset",MathJax.Hub,document.getElementById('equation_view')]);
        $("#sidebar-right").empty();
        drawTree();
    }
}
//IDEA: Write a children() function to return an array of all children, then we can reduce the amount of code to write!

  
EquationNodeProto.prototype = Object.create(new MathNodeProto());
      OpNodeProto.prototype = EquationNodeProto.prototype
  ParensNodeProto.prototype = EquationNodeProto.prototype
FunctionNodeProto.prototype = EquationNodeProto.prototype
     VarNodeProto.prototype = EquationNodeProto.prototype
  NumberNodeProto.prototype = EquationNodeProto.prototype

EquationNode.prototype = Object.create(new EquationNodeProto());
      OpNode.prototype = Object.create(new       OpNodeProto());
  ParensNode.prototype = Object.create(new   ParensNodeProto());
FunctionNode.prototype = Object.create(new FunctionNodeProto());
     VarNode.prototype = Object.create(new      VarNodeProto());
  NumberNode.prototype = Object.create(new   NumberNodeProto());



