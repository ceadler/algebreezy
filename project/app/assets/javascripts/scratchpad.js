function display_equation() {
    console.log("testing1");
    $("#scratchpad").text("\\( "+parser.parse($("#myEquation").val()).toLatex()+" \\)");
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,document.getElementById('scratchpad')]);
    console.log("testing2", $("#scratchpad").text());
}