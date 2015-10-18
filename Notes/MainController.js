app.controller('MainController', ['$scope', function($scope) {
  $scope.title = 'Kenny Lee';
  $scope.promo = 'Practicing using AngularJS';
  $scope.products = [
    									{
                        		name: 'The Book of Trees',
                        		price: 19,
                        		pubdate: new Date('2014', '03', '08'),
                        		cover: 'img/the-book-of-trees.jpg',
                        		likes: 0,
                        		dislikes: 0
                      		},
    									{
                        		name: 'Program or be Programmed',
                        		price: 8,
                        		pubdate: new Date('2013', '08', '01'),
                        		cover: 'img/program-or-be-programmed.jpg',
                        		likes: 0,
                        		dislikes: 0
                      		},
        								{
                        		name: 'Lol hi',
                        		price: 22,
                        		pubdate: new Date('2016', '00', '01'),
                        		cover: 'img/program-or-be-programmed.jpg',
                          	likes: 0,
                          	dislikes: 0
                      		},
        								{
                        		name: 'test',
                        		price: 128,
                        		pubdate: new Date('2013', '10', '01'),
                        		cover: 'img/program-or-be-programmed.jpg',
                          	likes: 0,
                          	dislikes: 0
                      		}
  									]
  $scope.plusOne = function(index) {
  	$scope.products[index].likes += 1;
  };
  $scope.minusOne = function(index) {
  	$scope.products[index].dislikes += 1;
  };

}]);