//To run this test, simply call parser_test_start()

function parser_test_start(){
    if(parser == false){
        console.log('Parser object does not exist. Failure!');
    }
    if(parser.parse == false){
        console.log('Parser function does not exist. Failure!');
    }
    // --- COMING SOON ---
    //if(parser.parse('1=1').isEqualTo( EquationNode(NumberNode(1), NumberNode(1)))){
    //    console.log('Failed test 1!');
    //}
    //if(parser.parse('1*1=1').isEqualTo(EquationNode(
    //    OpNode('*', NumberNode(1), NumberNode(1)), NumberNode(1)))){
    //    console.log('Failed test 2!');
    //}
}

function toLatex_test() {
    var x = parser.parse("3*14+x/y^z-z^2=48-49+x-(y*3)^4");
    $("#testbox").html(" \\("+x.toLatex()+" \\)");
}