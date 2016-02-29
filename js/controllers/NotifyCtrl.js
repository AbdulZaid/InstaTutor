myApp.controller('NotifyCtrl', ['$scope','Auth','Users','$interval','$firebaseObject','$firebaseArray','$mdDialog', 
	function ($scope, Auth, Users, $interval, $firebaseObject, $firebaseArray, $mdDialog) {

		$scope.title = 'Title';
  		$scope.badgeNum = 1000;
  		$scope.warn = function(){
    		return $scope.badgeNum > 1004; 
  		}
  		$interval(function(){
    		$scope.badgeNum++;
  		}, 1000)
}]);
