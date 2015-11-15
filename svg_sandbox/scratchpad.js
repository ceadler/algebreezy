function display_equation() {
    console.log("testing1");
    equations[0] = parser.parse($("#myEquation").val());
    $("#scratchpad").text("\\( "+equations[0].toLatex()+" \\)");
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,document.getElementById('scratchpad')]);
    console.log("testing2", $("#scratchpad").text());
    drawTree();
}