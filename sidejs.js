// MODULE
var myApp = angular.module('myApp', ['ngRoute', 'firebase']);



// //CONFIGURATION
myApp.config(function ($routeProvider) {
	$routeProvider  
		.when('/signup', {
			templateUrl: 'views/signup.html',
			controller: 'SignupCtrl',
		})

		.when('/login', {
			templateUrl: 'views/login.html',
			controller: 'LoginCtrl',
		})

});

// CONTROLLERS
// myApp.controller('AuthCtrl', ['$scope','$firebaseObject', function ($scope, $firebaseObject) {

// 	var ref = new Firebase("https://homeworkmarket.firebaseio.com");
//   // download the data into a local object
//   var syncObject = $firebaseObject(ref);
//   // synchronize the object with a three-way data binding
//   // click on `index.html` above to see it used in the DOM!
//   syncObject.$bindTo($scope, "data");

// }]);

myApp.controller('mainController', ['$scope','$firebaseObject','$log','$filter', '$location', function ($scope, $firebaseObject, $log, $filter, $location) {

    var ref = new Firebase("https://homeworkmarket.firebaseio.com");
    // download the data into a local object
    var syncObject = $firebaseObject(ref);
    // synchronize the object with a three-way data binding
    // click on `index.html` above to see it used in the DOM!
    syncObject.$bindTo($scope, "data");


    $log.info($location.path());
    $scope.mom = 'Asma'
    $scope.name = ''

    $scope.capitalize = function () {
    	return $filter('uppercase')($scope.name);
    };

    $scope.person = {
    	name: 'Abdul',
    };

    $scope.rules = [
    	{ruleapplied: " must be cool"},
    	{ruleapplied: " must be logical"},
    	{ruleapplied: "must be amazing"}
    ];

}]);

myApp.controller('LoginCtrl', ['$scope', function ($scope) {

}]);

myApp.controller('SignupCtrl', ['$scope', function ($scope) {
	
}]);
myApp.directive('homeworkPostDir', [function () {
	return {
		restrict: 'AEC',
		templateUrl: 'directives/homework-post-dir.html',
		replace: true,
		scope: {
			personName: "@",
		}
	};
}])

