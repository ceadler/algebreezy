angular.module('Algebreezy', [])
.controller('MainCtrl', [
'$scope',
function($scope){

  $scope.display_equation = function() {
  	console.log("testing1");
    $("#equation_view").append("\\( "+parser.parse($("#myEquation").val()).toLatex()+" \\)<br>");
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,document.getElementById('equation_view')]);
    console.log("testing2", $("#equation_view").text());
  }

  $scope.displayEqnKey = function($event) {
  	if ($event.keyCode === 13) {
      console.log("poop");
  		$scope.display_equation();
  	}
  	else {
  		angular.noop;
  	}
  }
}]);