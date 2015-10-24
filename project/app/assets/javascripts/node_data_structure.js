function EquationNode(left, right) {
	this.left =  left;
	this.right = right;
	this.type = "Equation";
	this.toLatex = function() {
		return left.toLatex() + " = " + right.toLatex();
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
};

function OpNode(op, left, right) {
	this.op =  op;
	this.left =  left;
	this.right =  right;
	this.type = "Op";
	this.toLatex = function() {
		switch (this.op) {
			case '+':
				return left.toLatex() + " + " + right.toLatex();
				break;
			case '-':
				return left.toLatex() + " - " + right.toLatex();
				break;
			case '*':
				return left.toLatex() + " \\cdot " + right.toLatex();
				break;
			case '/':
				return "\\frac{" + left.toLatex() + "}{" + right.toLatex() + "}";
				break;
			case '^':
				return left.toLatex() + "^{" + right.toLatex() + "}";
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
};

function ParensNode(child) {
	this.child = child;
	this.type = "Parens";
	this.toLatex = function() {
		return "(" + child.toLatex() + ")";
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
}

function FunctionNode(name, params) {
	this.name = name;
	this.params = params;
	this.type = "Function";
	this.toLatex = function() {
		return " " + name + "(" + params.map(function(node){return node.toLatex()}).join(', ') + ") ";
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
}

function VarNode(name){
	this.name = name;
	this.type = "VarNode";
	this.toLatex = function() {
		return " " + name + " ";
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
}

function NumberNode(value) {
	this.value = value;
	this.type = "Number";
	this.toLatex = function() {
		return " " + value.toString() + " ";
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
}

