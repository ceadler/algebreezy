function display_equation() {
    console.log("testing1");
    $("#article").append("\\( "+parser.parse($("#myEquation").val()).toLatex()+" \\)<br>");
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,document.getElementById('article')]);
    console.log("testing2", $("#article").text());
}