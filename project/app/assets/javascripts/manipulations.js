var Zero = new NumberNode(0);
var One = new NumberNode(1);
    
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
                case '+': {
                    node.replaceWith(new NumberNode(node.left.value + node.right.value)); 
                    newEquationLine(node.root());
                    break;
                }
                case '-': {
                    node.replaceWith(new NumberNode(node.left.value - node.right.value)); 
                    newEquationLine(node.root());
                    break;
                }
                case '*':  {
                    node.replaceWith(new NumberNode(node.left.value * node.right.value)); 
                    newEquationLine(node.root());
                    break;
                }
                case '/':  {
                    node.replaceWith(new NumberNode(node.left.value / node.right.value)); 
                    newEquationLine(node.root());
                    break;
                }
                case '^':  {
                    node.replaceWith(new NumberNode(Math.pow(node.left.value, node.right.value))); 
                    newEquationLine(node.root());
                    break;
                }
                default: console.log("operation not found:", node, node.op); break;
            }      
        }
    }
    else{console.log("Error in applyOperation: Function called on node where case doesn't apply"); return null}
}

function canApplyOperation(node){
    return (node.left.type == "Number" && node.right.type == "Number")
}

function commute(nodeA, nodeB){
    return function(){
        nodeA.swapWith(nodeB);
        newEquationLine(nodeA.root().deepCopy());
    }
}
function generateCommutativityOptions(staticNode, recursiveNode, options){
    if(recursiveNode.type == "Op" && recursiveNode.op == staticNode.parent.op){
        generateCommutativityOptions(staticNode, recursiveNode.left, options);
        generateCommutativityOptions(staticNode, recursiveNode.right, options);
    }
    options.push(makeButton("Commute \\( ["+staticNode.toLatex()+"] \\) with \\( ["+recursiveNode.toLatex()+"]\\) .", commute(staticNode, recursiveNode)));
}
    
function canCommute(node){
    return (node.type == 'Op' && (node.op == '*' || node.op == '+'))
}

function changeSigns(node) {
	return function() {
		switch(node.op) {
			case '-': {
				node.right.value = 0 - node.right.value;
				node.op = '+';
				node.replaceWith(new OpNode(node.op, node.left, node.right)); 
				newEquationLine(node.root());
				break;
			}
			case '+': {
				node.right.value = 0 - node.right.value;
				node.op = '-';
				node.replaceWith(new OpNode(node.op, node.left, node.right)); 
				newEquationLine(node.root());
				break;
			}
			
		}
	}
}

function isUselessParens(node) {
	if ((node.child.op == '-' || node.child.op == '+') && (node.parent.op == '*' || node.parent.op == '/' || node.parent.op == '^')){
		console.log("not useless");
		return false;
	} else if ((node.child.op == '*' || node.child.op == '/') && (node.parent.op == '^')) {
		console.log("not useless");
		return false;
	}	else {
		return true;
	}
}

function deleteParens(node) {
	if (isUselessParens(node)) {
		return function() {
		
			switch (node.child.type) {
				case "Op": {
					node.replaceWith(new OpNode(node.child.op, node.child.left, node.child.right)); 
					newEquationLine(node.root());
					break;
				}
				case "Number": {
					node.replaceWith(new NumberNode(node.child.value)); 
					newEquationLine(node.root());
					break;
				}
				case "Parens": {
					node.replaceWith(new ParensNode(node.child.child)); 
					newEquationLine(node.root());
					break;
				}
				case "Function": {
					//console.log("done");
					node.replaceWith(new FunctionNode(node.child, node.child.params)); 
					newEquationLine(node.root());
					break;
				}
				case "Variable": {
					node.replaceWith(new VarNode(node.child.name)); 
					newEquationLine(node.root());
					break;
				}
			}
        }
    }
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

function numIsomorphicChildren(staticNode, recursiveNode){
    var numChildren = (staticNode.isIsomorphicTo(recursiveNode)?1:0);
    if(recursiveNode.type == "Op" && recursiveNode.op == staticNode.parent.op){
        numChildren += numIsomorphicChildren(staticNode, recursiveNode.left);
        numChildren += numIsomorphicChildren(staticNode, recursiveNode.right);
    }
    //console.log("Is isomorphic?"+, staticNode.isIsomorphicTo(recursiveNode), staticNode, recursiveNode, numChildren);
    return numChildren;
}

function canApplyHyperOperatorLeft(node){
    return ((node.type == 'Op' && (node.op == '+' || node.op == '*')) &&
            (numIsomorphicChildren(node.left, node.right)>0) &&
            !canApplyHyperOperatorSimple(node))
}

function canApplyHyperOperatorRight(node){
    return ((node.type == 'Op' && (node.op == '+' || node.op == '*')) &&
            (numIsomorphicChildren(node.right, node.left)>0) &&
            !canApplyHyperOperatorSimple(node))
}

function canApplyHyperOperatorSimple(node){
    return ((node.type == 'Op' && (node.op == '+' || node.op == '*')) &&
             node.right.isIsomorphicTo(node.left))
}

function replaceIsomorphicChildren(staticNode, recursiveNode){
    var numChildrenReplaced = 0;
    if(recursiveNode.type == "Op" && recursiveNode.op == staticNode.parent.op){
        numChildrenReplaced += replaceIsomorphicChildren(staticNode, recursiveNode.left);
        numChildrenReplaced += replaceIsomorphicChildren(staticNode, recursiveNode.right);
        if(recursiveNode.left.isIsomorphicTo(staticNode)){
            console.log('Replacing', recursiveNode, 'with', recursiveNode.right);
            recursiveNode.replaceWith(recursiveNode.right);
            console.log('Replaced', recursiveNode, 'with', recursiveNode.right);
            return numChildrenReplaced+1;
        }
        else if(recursiveNode.right.isIsomorphicTo(staticNode)){
            console.log('Replacing', recursiveNode, 'with', recursiveNode.left);
            recursiveNode.replaceWith(recursiveNode.left);
            console.log('Replaced', recursiveNode, 'with', recursiveNode.left);
            return numChildrenReplaced+1;
        }
    }
    return 0;
}

function applyHyperOperatorSimple(node){
    return function(){
        if(canApplyHyperOperatorSimple(node)){
            if(node.op == '+'){
                node.replaceWith(new OpNode('*', new NumberNode(2), node.left));
                newEquationLine(node.root());
            }
            else if(node.op == '*'){
                node.replaceWith(new OpNode('^', node.left, new NumberNode(2)));
                newEquationLine(node.root());
            }
        }
    }
}

function applyHyperOperatorLeft(node){
    return function(){
        console.log("left hyperoperator apply");
        if(canApplyHyperOperatorLeft(node)){
            var nodeOp = node.op;
            var staticNode = node.left.deepCopy()
            var numChildrenReplaced = replaceIsomorphicChildren(staticNode, node);
            if(nodeOp == '+'){
                var replacement = new OpNode('+', new OpNode('*', new NumberNode(numChildrenReplaced), staticNode), node.deepCopy())
                replacement.setParent(node.parent)
                node.replaceWith(replacement)
                newEquationLine(replacement.root());
            }
            if(nodeOp == '*'){
                node.replaceWith(new OpNode('*', 
                                   new OpNode('^',
                                     staticNode,
                                     new NumberNode(numChildrenReplaced)),
                                   node.deepCopy())
                                )
                newEquationLine(node.root());
            }
        }
    }
}

function applyHyperOperatorRight(node){
    return function(){
        console.log("right hyperoperator apply", node);
        if(canApplyHyperOperatorRight(node)){
            var nodeOp = node.op;
            var staticNode = node.right.deepCopy()
            console.log("Static node is:", staticNode)
            var numChildrenReplaced = replaceIsomorphicChildren(staticNode, node);
            if(nodeOp == '+'){
                console.log("node", node);
                var replacement = new OpNode('+', new OpNode('*', new NumberNode(numChildrenReplaced), staticNode), node)
                replacement.setParent(node.parent)
                console.log("1Replacement:", replacement)
                console.log("1Node:", node)
                node.replaceWith(replacement)
                console.log("2Replacement:", replacement)
                console.log("2Node:", node)
                newEquationLine(replacement.root());
            }
            if(nodeOp == '*'){
                node.replaceWith(new OpNode('*', 
                                   new OpNode('^',
                                     staticNode,
                                     new NumberNode(numChildrenReplaced)),
                                   node.deepCopy())
                                )
                newEquationLine(node.root());
            }
        }
    }
}

function canSubstituteFunction(node){
    return (node.type == 'Function' && functionTable.contains(node.name))
}

function substituteFunction(node){
    return function(){
        if(canSubstituteFunction(node)){
            functionTable.substitute(node);
            newEquationLine(node.root().deepCopy());
        }
    }
}

function canMultiplyByZero(node){
    return(node.type == 'Op' && node.op == '*'
           &&(node.right.isIsomorphicTo(Zero)
            ||node.left.isIsomorphicTo(Zero)))
}
function multiplyByZero(node){
    return function(){
        if(canMultiplyByZero(node)){
            node.replaceWith(Zero.deepCopy());
            newEquationLine(node.root());
        }
    }
}

function canRaiseToZero(node){
    return(node.type == 'Op' && node.op == '^'
        && node.right.isIsomorphicTo(Zero)
        && (!node.left.isIsomorphicTo(Zero)))
}
function raiseToZero(node){
    return function(){
        if(canRaiseToZero(node)){
            node.replaceWith(One.deepCopy());
            newEquationLine(node.root());
        }
    }
}

function canCancelDivision(node){
    return(node.type == 'Op' && node.op == '/'
        && node.right.isIsomorphicTo(node.left))
}
function cancelDivision(node){
    return function(){
        if(canCancelDivision(node)){
            node.replaceWith(One.deepCopy());
            newEquationLine(node.root());
        }
    }
}

function canCancelSubtraction(node){
    return(node.type == 'Op' && node.op == '-'
        && node.right.isIsomorphicTo(node.left))
}
function cancelSubtraction(node){
    return function(){
        if(canCancelSubtraction(node)){
            node.replaceWith(Zero.deepCopy());
            newEquationLine(node.root());
        }
    }
}

function canAddZero(node){
    return(node.type == 'Op' && (node.op == '-' || node.op == '+')
        && (node.right.isIsomorphicTo(Zero)
          || node.left.isIsomorphicTo(Zero)))
}
function addZero(node){
    return function(){
        if(canAddZero(node)){
            if(node.right.isIsomorphicTo(Zero)){
                node.replaceWith(node.left.deepCopy());
            }
            else{
                if(node.op == '+'){
                    node.replaceWith(node.right.deepCopy());
                }
                else{
                    node.replaceWith(new OpNode('*', new NumberNode(-1), node.right.deepCopy()))
                }
            }
            newEquationLine(node.root());
        }
    }
}

function canMultiplyByOne(node){
    return(node.type == 'Op' && (node.op == '*')
        && (node.right.isIsomorphicTo(One)
          || node.left.isIsomorphicTo(One)))
}
function multiplyByOne(node){
    return function(){
        if(canMultiplyByOne(node)){
            if(node.right.isIsomorphicTo(One)){
                node.replaceWith(node.left.deepCopy());
            }
            else{
                node.replaceWith(node.right.deepCopy());
            }
            newEquationLine(node.root());
        }
    }
}

function canDivideByOne(node){
    testingNode=node;console.log("Calling 'can divide by 1'",node)
    return(node.type == 'Op' && (node.op == '/')
        && node.right.isIsomorphicTo(One))
}
function divideByOne(node){
    return function(){
        if(canDivideByOne(node)){
            node.replaceWith(node.left.deepCopy());
            newEquationLine(node.root());
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
