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

function numIsomorphicChildren(staticNode, recursiveNode){
    var numChildren = (staticNode.isIsomorphicTo(recursiveNode)?1:0);
    if(recursiveNode.type == "Op" && recursiveNode.op == staticNode.parent.op){
        numChildren += numIsomorphicChildren(staticNode, recursiveNode.left);
        numChildren += numIsomorphicChildren(staticNode, recursiveNode.right);
    }
    //console.log("Is isomorphic?"+, staticNode.isIsomorphicTo(recursiveNode), staticNode, recursiveNode, numChildren);
    return numChildren;
}
function canApplyHyperOperator(node){
    return ((node.type == 'Op' && (node.op == '+' || node.op == '*')) &&
            (node.left.isIsomorphicTo(node.right) ||
             numIsomorphicChildren(node.left, node.right) > 0 ||
             numIsomorphicChildren(node.right, node.left) > 0))
}

function replaceIsomorphicChildren(staticNode, recursiveNode){
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
