function display_equation() {
    console.log("testing1");
    $("#article").text("\\( "+parser.parse($("#myEquation").val()).toLatex()+" \\)");
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,document.getElementById('article')]);
    console.log("testing2", $("#article").text());
}