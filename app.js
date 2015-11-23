// MODULE
var myApp = angular.module('myApp', ['ngRoute']);



// //CONFIGURATION
myApp.config(function ($routeProvider) {
	$routeProvider  
		// .when('/', {
		// 	templateUrl: 'index.html',
		// 	controller: 'mainController',
		// })
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
myApp.controller('mainController', ['$scope','$log','$filter', '$location', function ($scope, $log, $filter, $location) {
    $log.info($location.path());
    $scope.mom = 'Asma'
    $scope.name = ''

    $scope.capitalize = function () {
    	return $filter('uppercase')($scope.name);
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


