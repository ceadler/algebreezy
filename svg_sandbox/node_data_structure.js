//INSTANTIATIONS
function EquationNode(left, right) {
	this.left =  left;
	this.right = right;
    this.nodeDepth = null;
};

function OpNode(op, left, right) {
	this.op =  op;
	this.left =  left;
	this.right =  right;
    this.nodeDepth = null;
};

function ParensNode(child) {
	this.child = child;
    this.nodeDepth = null;
}

function FunctionNode(name, params) {
    this.name = name;
	this.params = params;
    this.nodeDepth = null;
}

function VarNode(name){
	this.name = name;
    this.leafIndex = null;
    this.nodeDepth = null;
}

function NumberNode(value) {
	this.value = value;
    this.leafIndex = null;
    this.nodeDepth = null;
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
	}
	this.isEqual = function() {
	}
	this.isIsomorphic = function() {
	}
    this.depth = function(){
        if(!this.nodeDepth){
            this.nodeDepth = Math.max(this.left.depth(), this.right.depth()) + 1;
        }
        return this.nodeDepth;
    }
    this.width = function(){
        return this.left.width() + this.right.width();        
    }
    this.calculateLeafIndex = function(prevIndex){
        return this.right.calculateLeafIndex(this.left.calculateLeafIndex(prevIndex));
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
	}
	this.isEqual = function() {
	}
	this.isIsomorphic = function() {
	}
    this.depth = function(){
        if(!this.nodeDepth){
            this.nodeDepth =Math.max(this.left.depth(), this.right.depth()) + 1;
        }
        return this.nodeDepth;
    }
    this.width = function(){
        return this.left.width() + this.right.width();        
    }
    this.calculateLeafIndex = function(prevIndex){
        return this.right.calculateLeafIndex(this.left.calculateLeafIndex(prevIndex));
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
	}
	this.isEqual = function() {
	}
	this.isIsomorphic = function() {
	}
    this.depth = function(){
        if(!this.nodeDepth){
            this.nodeDepth = this.child.depth() + 1;
        }
        return this.nodeDepth;
    }
    this.width = function(){
        return this.child.width();        
    }
    this.calculateLeafIndex = function(prevIndex){
        return this.child.calculateLeafIndex(prevIndex);
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
	}
	this.isEqual = function() {
	}
	this.isIsomorphic = function() {
	}
    this.depth = function(){
        if(!this.nodeDepth){
            this.nodeDepth = Math.max.apply(null, this.params.map(function(node){return node.depth()}))+1;;
        }
        return this.nodeDepth;
    }
    this.width = function(){
        return this.params.map(function(node){return node.width();}).reduce(function(prev, curr){return prev+curr;},0);        
    }
    this.calculateLeafIndex = function(prevIndex){
        var lastParamIndex = prevIndex;
        for (var param in params){
            lastParamIndex = params[param].calculateLeafIndex(lastParamIndex);
        }
        return lastParamIndex;
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
	}
	this.isEqual = function() {
	}
	this.isIsomorphic = function() {
	}
    this.depth = function(){
        return 1;
    }
    this.width = function(){
        return 1;
    }
    this.calculateLeafIndex = function(prevIndex){
        this.leafIndex = prevIndex+1;
        return this.leafIndex;
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
	}
	this.isEqual = function() {
	}
	this.isIsomorphic = function() {
	}
    this.depth = function() {
        return 1;
    }
    this.width = function() {
        return 1;
    }
    this.calculateLeafIndex = function(prevIndex){
        this.leafIndex = prevIndex+1;
        return this.leafIndex;
    }
}


EquationNode.prototype = Object.create(new EquationNodeProto());
      OpNode.prototype = Object.create(new       OpNodeProto());
  ParensNode.prototype = Object.create(new   ParensNodeProto());
FunctionNode.prototype = Object.create(new FunctionNodeProto());
     VarNode.prototype = Object.create(new      VarNodeProto());
  NumberNode.prototype = Object.create(new   NumberNodeProto());



