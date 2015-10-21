//Parent class ExprNode
function ExprNode(type, class) {
	this.type = type;
	this.class = class;
};

function EquationNode(left, right) {
	this.left =  left;
	this.right = right;
	toLatex: function() {
		console.log(".");
	}
	toEval: function() {
		console.log("I am evaluating.");
	}
	toPlainText: function() {
		console.log("toPlainText");
	}
	isEqual: function() {
		console.log("is equal");
	}
	isIsomorphic: function() {
		console.log("isIsomorphic");
	}
};

function OpNode(op, left, right) {
	this.op =  op;
	this.left =  left;
	this.right =  right;
	toLatex: function() {
		console.log(".");
	}
	toEval: function() {
		console.log("I am evaluating.");
	}
	toPlainText: function() {
		console.log("toPlainText");
	}
	isEqual: function() {
		console.log("is equal");
	}
	isIsomorphic: function() {
		console.log("isIsomorphic");
	}
};

function ParensNode(child) {
	this.child = child;
	toLatex: function() {
		console.log(".");
	}
	toEval: function() {
		console.log("I am evaluating.");
	}
	toPlainText: function() {
		console.log("toPlainText");
	}
	isEqual: function() {
		console.log("is equal");
	}
	isIsomorphic: function() {
		console.log("isIsomorphic");
	}
}

function FunctionNode(name, params) {
	this.name = name;
	this.params = []params;
	toLatex: function() {
		console.log(".");
	}
	toEval: function() {
		console.log("I am evaluating.");
	}
	toPlainText: function() {
		console.log("toPlainText");
	}
	isEqual: function() {
		console.log("is equal");
	}
	isIsomorphic: function() {
		console.log("isIsomorphic");
	}
}

var VarNode = function (name){
	this.name = name;
}

var NumberNode = function (value) {
	this.value = value;
}

//Prototype functions that should be usable by every function
ExprNode.prototype.toLatex = function() {
	console.log(".");
};

ExprNode.prototype.toEval = function() {
	console.log("I am evaluating.");
};

//Use object.getName() to receive the name of the constructor as a string
Object.prototype.getName = function() {  									//Taken from http://stackoverflow.com/questions/332422/how-do-i-get-the-name-of-an-objects-type-in-javascript
   var funcNameRegex = /function (.{1,})\(/;
   var results = (funcNameRegex).exec((this).constructor.toString());
   return (results && results.length > 1) ? results[1] : "";
};


//Uneeded due to js being a weakly typed language
// Prototypes to inherit ExprNode 
/*EquationNode.prototype = new ExprNode();
OpNode.prototype = new ExprNode();
ParensNode.prototype = new ExprNode();
FunctionNode.prototype = new ExprNode(); */
