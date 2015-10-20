function ExprNode(type, class) {
	this.type = type;
	this.class = class;
};

function EquationNode(left, right) {
	this.left =  left;
	this.right = right;
};

EquationNode.prototype = new ExprNode();

function OpNode(op, left, right) {
	this.op =  op;
	this.left =  left;
	this.right =  right;
};

OpNode.prototype = new ExprNode();

function ParensNode(child) {
	this.child = child;
}

ParensNode.prototype = new ExprNode();

function FunctionNode(name, []params) {
	this.name = name;
	this[].params = params;
}

FunctionNode.prototype = new ExprNode();

var VarNode = function (name){
	this.name = name;
}

var NumberNode = function (value) {
	this.value = value;
}