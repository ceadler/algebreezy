/*angular.module('Algebreezy', [])
.controller('MainCtrl', [
'$scope',
function($scope){

  $scope.display_equation = function() {
  	console.log("testing1");
    $("#article").append("\\( "+parser.parse($("#myEquation").val()).toLatex()+" \\)<br>");
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,document.getElementById('article')]);
    console.log("testing2", $("#article").text());
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
}]);*/