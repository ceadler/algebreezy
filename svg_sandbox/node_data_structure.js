function EquationNode(left, right) {
	this.left =  left;
	this.right = right;
	this.type = "Equation";
	this.toLatex = function() {
		return this.left.toLatex() + " = " + this.right.toLatex();
	}
	this.toEval = function() {
		console.log("I am evaluating.");
	}
	this.toPlainText = function() {
		console.log("toPlainText");
	}
	this.isEqual = function() {
		console.log("is equal");
	}
	this.isIsomorphic = function() {
		console.log("isIsomorphic");
	}
    this.depth = function(){
        return Math.max(this.left.depth(), this.right.depth()) + 1;
    }
    this.width = function(){
        return this.left.width() + this.right.width();        
    }
};

function OpNode(op, left, right) {
	this.op =  op;
	this.left =  left;
	this.right =  right;
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
		console.log("I am evaluating.");
	}
	this.toPlainText = function() {
		console.log("toPlainText");
	}
	this.isEqual = function() {
		console.log("is equal");
	}
	this.isIsomorphic = function() {
		console.log("isIsomorphic");
	}
    this.depth = function(){
        return Math.max(this.left.depth(), this.right.depth()) + 1;
    }
    this.width = function(){
        return this.left.width() + this.right.width();        
    }
};

function ParensNode(child) {
	this.child = child;
	this.type = "Parens";
	this.toLatex = function() {
		return "(" + this.child.toLatex() + ")";
		//console.log(".");
	}
	this.toEval = function() {
		console.log("I am evaluating.");
	}
	this.toPlainText = function() {
		console.log("toPlainText");
	}
	this.isEqual = function() {
		console.log("is equal");
	}
	this.isIsomorphic = function() {
		console.log("isIsomorphic");
	}
    this.depth = function(){
        return this.child.depth() + 1;
    }
    this.width = function(){
        return this.child.width();        
    }
}

function FunctionNode(name, params) {
    console.log("PARAMS!", name, typeof(params));
    this.name = name;
	this.params = params;
	this.type = "Function";
	this.toLatex = function() {
		return " " + this.name + "(" + this.params.map(function(node){return node.toLatex()}).join(', ') + ") ";
		//console.log(".");
	}
	this.toEval = function() {
		console.log("I am evaluating.");
	}
	this.toPlainText = function() {
		console.log("toPlainText");
	}
	this.isEqual = function() {
		console.log("is equal");
	}
	this.isIsomorphic = function() {
		console.log("isIsomorphic");
	}
    this.depth = function(){
        return Math.max.apply(null, params.map(function(node){return node.depth()}))+1;
    }
    this.width = function(){
        return this.params.map(function(node){return node.width();}).reduce(function(prev, curr){return prev+curr;},0);        
    }
}

function VarNode(name){
	this.name = name;
	this.type = "VarNode";
	this.toLatex = function() {
		return " " + this.name + " ";
		//console.log(".");
	}
	this.toEval = function() {
		console.log("I am evaluating.");
	}
	this.toPlainText = function() {
		console.log("toPlainText");
	}
	this.isEqual = function() {
		console.log("is equal");
	}
	this.isIsomorphic = function() {
		console.log("isIsomorphic");
	}
    this.depth = function(){
        return 1;
    }
    this.width = function(){
        return 1;
    }
}

function NumberNode(value) {
	this.value = value;
	this.type = "Number";
	this.toLatex = function() {
		return " " + this.value.toString() + " ";
		//console.log(".");
	}
	this.toEval = function() {
		console.log("I am evaluating.");
	}
	this.toPlainText = function() {
		console.log("toPlainText");
	}
	this.isEqual = function() {
		console.log("is equal");
	}
	this.isIsomorphic = function() {
		console.log("isIsomorphic");
	}
    this.depth = function(){
        return 1;
    }
    this.width = function(){
        return 1;
    }
}

