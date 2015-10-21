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
	this.params = params;
}

var VarNode = function (name){
	this.name = name;
}

var NumberNode = function (value) {
	this.value = value;
}