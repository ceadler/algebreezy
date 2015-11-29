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
	if(canDistributeLeft(node)){
		return function(){
			parenNode= node.left;
			grandNode= parenNode.child;
			var replacement=new OpNode(parenNode.child.op, new OpNode('*', grandNode.left, node.right), new OpNode('*', grandNode.right, node.right));
			node.replaceWith(replacement);
			replacement.root().setParent(null);
			
		}
	}else if(canDistributeRight(node)){
		return function(){
			parenNode= node.right;
			grandChildNode= parenNode.child;
			var replacement = new OpNode(parenNode.child.op, new OpNode('*', grandNode.left, node.left), new OpNode('*', grandNode.right, node.left));
			node.replaceWith(replacement);
			replacement.root().setParent(null);
		}
	}
}

function canDistributeLeft(node){
	return (node.type== "Op" && node.op=='*' && node.left.type=="Parens" && node.left.child.type=="Op" && (node.left.child.op=='+' || node.left.child.op=='-'));
}

function canDistributeRight(node){
	return (node.type== "Op" && node.op=='*' && node.right.type=="Parens" && node.right.child.type=="Op" && (node.right.child.op=='+' || node.right.child.op=='-'));
}

function reduceExponent(node){
	if(canReduceExponent(node)){
		return function(){
			if(node.left.type == "Parens"){
				parentNode= node.left;
				grandChildNode= parentNode.child;
				node.replaceWith(new OpNode('^', new VarNode(grandChildNode.left.name), new NumberNode(grandChildNode.right.value *node.right.value)));
			}else if(node.left.op =='^'){
				leftParentNode= node.left;
				rightParentNode= node.right;
				node.replaceWith(new OpNode('^', new VarNode(leftParentNode.left.name), new NumberNode(leftParentNode.right.value+rightParentNode.right.value)));
			}
		}
	}
}

function canReduceExponent(node){
	return((node.left.type=="Parens" && node.right.type=="Number" && node.left.child.op =='^')||(node.left.op =='^' && node.right.op=='^'));
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