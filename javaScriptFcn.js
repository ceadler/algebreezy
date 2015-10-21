//Parent class ExprNode
function ExprNode(type, class) {
	this.type = type;
	this.class = class;
};

function EquationNode(left, right) {
	this.left =  left;
	this.right = right;
};

function OpNode(op, left, right) {
	this.op =  op;
	this.left =  left;
	this.right =  right;
};

function ParensNode(child) {
	this.child = child;
}

function FunctionNode(name, params) {
	this.name = name;
	this.params = []params;
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


//Uneeded due to js being a weakly typed language
// Prototypes to inherit ExprNode 
/*EquationNode.prototype = new ExprNode();
OpNode.prototype = new ExprNode();
ParensNode.prototype = new ExprNode();
FunctionNode.prototype = new ExprNode(); */
