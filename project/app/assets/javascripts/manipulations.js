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
        newEquationLine(nodeA.root());
    }
}
function generateCommutativityOptions(staticNode, recursiveNode, options){
    if(recursiveNode.type == "Op" && recursiveNode.op == staticNode.parent.op){
        generateCommutativityOptions(staticNode, recursiveNode.left, options);
        generateCommutativityOptions(staticNode, recursiveNode.right, options);
    }
    options.push(makeButton("Commute "+staticNode.toPlainText()+" with "+recursiveNode.toPlainText()+".", commute(staticNode, recursiveNode)));
}
    
function canCommute(node){
    return (node.type == 'Op' && (node.op == '*' || node.op == '+'))
}
