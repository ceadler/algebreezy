function FunctionTableObject(){
    this.functions = {};
    this.contains = function(name){
        return this.functions[name] != undefined;
    }
    this.registerFunction = function(fNode, expr){
        var vars = fNode.children().map(function(param){return param.name})
        this.functions[fNode.name] = new registeredFunction(vars, expr)
    }
    this.substitute = function(node){
        //console.log("trace 1.1", node, node.root())
        //var replacement = 
        this.functions[node.name].substituteParams(node)
        //console.log("trace 1.1 replacement", replacement)
        //node.replaceWith(replacement);
        //console.log("trace 1.2", node, node.root())
    }
}

function registeredFunction(variables, expression){
    this.vars = variables; //Array of strings
    this.expr = expression; //Array of MathNodes
    console.log("trace 2: New registered function", variables, expression)
    this.substituteParams = function(funcNode){
        var params = funcNode.params;
        console.log("Called substituteParams with", params);
        if(params.length != this.vars.length){
            console.log("Parameter length mismatch. Returning null.")
            return null;
        }
        var newExpr = this.expr.deepCopy();
        console.log("!!!New expr parent:", newExpr.parent)
        funcNode.replaceWith(newExpr);
        console.log("!!!New expr parent:", newExpr.parent)
        newExpr.parent = funcNode.parent;
        console.log("!!!New expr parent:", newExpr.parent)
        var paramsMap = {};
        for(var v in this.vars){
            paramsMap[this.vars[v]] = params[v];
        }
        function iterateTree(node){
            //search the tree for a VarNode whose name matches one of the variables
            //console.log(node, node.type);
            //console.log("Called iterateTree on", node);
            //console.log("Node children before", node.children());
            for (var c in node.children()){
                iterateTree(node.children()[c]);
            }
            if(node.type == 'Variable'){
                //console.log("trace 4")
                if(paramsMap[node.name] != undefined){
                    var replacementNode = new ParensNode(paramsMap[node.name].deepCopy())
                    //when we find such a node, replace it with its corresponding param
                    console.log("Replacing", node, "with",replacementNode)
                    replacementNode.parent = node.parent;
                    node.replaceWith(replacementNode);
                    console.log("After replacing... ", node, newExpr)
                }
            }
            //console.log("Node children after", node.children());
        }
        console.log("!!!New expr parent:", newExpr.parent)
        iterateTree(newExpr);
        console.log("!!!New expr parent:", newExpr.parent)
        return newExpr;
    }
}