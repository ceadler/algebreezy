function makeButton(text, click_function){
    var new_elem = $("<button>", {html: text});
    new_elem.click(click_function);
    return new_elem;
}

function applyOperation(node){
    if(canApplyOperation(node)){
        return function(){
            //console.log("called apply operation");
            switch (node.op){
                case '+': node.replaceWith(new NumberNode(node.left.value + node.right.value)); break;
                case '-': node.replaceWith(new NumberNode(node.left.value - node.right.value)); break;
                case '*': node.replaceWith(new NumberNode(node.left.value * node.right.value)); break;
                case '/': node.replaceWith(new NumberNode(node.left.value / node.right.value)); break;
                case '^': node.replaceWith(new NumberNode(Math.pow(node.left.value, node.right.value))); break;
                default: console.log("operation not found:", node, node.op); break;
            }      
        }
    }
    else{console.log("Error in applyOperation: Function called on node where case doesn't apply"); return null}
}

function canApplyOperation(node){
    return (node.left.type == "Number" && node.right.type == "Number")
}

function distributeOperation(node){
	if(canDistributeOperation(node)){
		return function(){
			new ParensNode parentNode= node.right;
			new OpNode grandChildNode= parentNode.child;
			if(node.right.type== "Parens"){
				node.replaceWith(new OpNode(grandChildNode.op, new OpNode(node.op, new NumberNode(node.left.value), new VarNode(grandChildNode.left.name)), new OpNode(node.op, new NumberNode(node.left.value), new VarNode(grandChildNode.right.name))));
			}else if(node.left.type== "Parens"){
				node.replaceWith(new OpNode(grandChildNode.op, new OpNode(node.op, new NumberNode(node.right.value), new VarNode(granChildNode.left.name)), new OpNode(node.op, new NumberNode(node.right.value), new VarNode(grandChildNode.right.name))));
			}
		}
	}
}

function canDistributeOperation(node){
	return((node.left.type == "Number" && node.right.type== "Parens") || (node.left.type =="Parens" && node.right.type=="Number"));
}

function reduceExponent(node){
	if(canReduceExponent(node)){
		return function(){
			if(node.left.type == "Parens"){
				new ParenNode parentNode= node.left;
				new OpNode grandChildNode= parentNode.child;
				node.replaceWith(new OpNode('^', new VarNode(grandChildNode.left.name), new NumberNode(grandChildNode.right.value *node.right.value)));
			}else if(node.left.op =='^'){
				new OpNode leftParentNode= node.left;
				new OpNode rightParentNode= node.right;
				node.replaceWith(new OpNode('^', new VarNode(leftParentNode.left.name), new NumberNode(leftParentNode.right.value+rightParentNode.right.value)));
			}
		}
	}
}

function canReduceExponent(node){
	return((node.left.type=="Parens" && node.right.type=="Number") ||(node.left.op =='^' && node.right.op=='^'));
}

function invertOperator(node){
	if(canInvertOperator(node)){
		return function(){
			node.replaceWith(new OpNode('*', new NumberNode(node.left.value), new OpNode('^', new NumberNode(node.right.value), new NumberNode(-1))));
		}
	}
}

function canInvertOperator(node){
	return (node.op== '/' && node.left.type== "Number" && node.right.type == "Number");
}

function factorNegNum(node){
	if(canFactorNegNum(node)){
		return function(){
			if(node.left.type =="Number"){
				node.replaceWith( new OpNode('*', new NumberNode(node.left.value.abs), new NumberNode(-1)));
			}else if (node.right.type =="Number"){
				node.replaceWith( new OpNode('*', new NumberNode(node.right.value.abs), new NumberNode(-1)));
			}
		}
	}
}

function canFactorNegNum(node){
	return (node.type == 'Number' && node.value<0);
}