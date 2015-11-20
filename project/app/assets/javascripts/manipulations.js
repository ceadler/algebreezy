function generateManipulations(node){
    var manipulations = [];
    switch(node.type){
        case "Equation": manipulations = equationManipulations(node); break;
        case "Op":       manipulations = OpManipulations(node); break;
        case "Parens":   manipulations = ParensManipulations(node); break;
        case "Function": manipulations = FunctionManipulations(node); break;
        case "Variable": manipulations = VariableManipulations(node); break;
        case "Number":   manipulations = NumberManipulations(node); break;
        default: break;//error
    }
    return manipulations;
}

function equationManipulations(node){
    //do something on both sides
    return [];
}

function OpManipulations(node){
    if(node.left.type == "Number" && node.right.type == "Number"){
        //insert possibility that you can evaluate them them
    }
    switch(node.op){
        case "+": 
            if(true){
                //do something
            }
            break;
        case "-": 
            if(true){
                //do something
            }
            break;
        case "*": 
            if(true){
                //do something
            }
            break;
        case "/": 
            if(true){
                //do something
            }
            break;
        case "^": 
            if(true){
                //do something
            }
            break;
        default: break;//error
}
    return [];
}

function ParensManipulations(node){
    //
    return [];
}

function FunctionManipulations(node){
    //
    return [];
}

function VariableManipulations(node){
    //
    return [];
}

function NumberManipulations(node){
    //
    return [];
}

















//INSTANTIATIONS
function EquationNode(left, right) {
	this.left =  left;
	this.right = right;
    this.nodeDepth = null;
    this.parent = null;
    this.position = null;
};

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
        //this.setParent(null);
        this.calculateLeafIndex();
        this.setPosition();
    }
};

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
}
//IDEA: Write a children() function to return an array of all children, then we can reduce the amount of code to write!

  
EquationNodeProto.prototype = Object.create(new MathNodeProto());  

EquationNode.prototype = Object.create(new EquationNodeProto());