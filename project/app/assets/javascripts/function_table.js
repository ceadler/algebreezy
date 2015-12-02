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
        this.functions[node.name].substituteParams(node)
    }
}

function registeredFunction(variables, expression){
    this.vars = variables; //Array of strings
    this.expr = expression; //Array of MathNodes
    this.substituteParams = function(funcNode){
        var params = funcNode.params;
        if(params.length != this.vars.length){
            console.log("Parameter length mismatch. Returning null.")
            return null;
        }
        var newExpr = this.expr.deepCopy();
        funcNode.replaceWith(newExpr);
        newExpr.parent = funcNode.parent;
        var paramsMap = {};
        for(var v in this.vars){
            paramsMap[this.vars[v]] = params[v];
        }
        function iterateTree(node){
            for (var c in node.children()){
                iterateTree(node.children()[c]);
            }
            if(node.type == 'Variable'){
                if(paramsMap[node.name] != undefined){
                    var replacementNode = new ParensNode(paramsMap[node.name].deepCopy())
                    //when we find such a node, replace it with its corresponding param
                    replacementNode.parent = node.parent;
                    node.replaceWith(replacementNode);
                }
            }
        }
        iterateTree(newExpr);
        return newExpr;
    }
}