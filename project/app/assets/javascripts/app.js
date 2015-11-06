angular.module('Algebreezy', [])
.controller('MainCtrl', [
'$scope',
function($scope){

  $scope.display_equation = function() {
  	console.log("testing1");
    $("#scratchpad").text("\\( "+parser.parse($("#myEquation").val()).toLatex()+" \\)");
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,document.getElementById('scratchpad')]);
    console.log("testing2", $("#scratchpad").text());
  }

  $scope.displayEqnKey = function($event) {
  	if ($event.keyCode === 13) {
  		display_equation();
  	}
  	else {
  		angular.noop;
  	}
  }
}]);