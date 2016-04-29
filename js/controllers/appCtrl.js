myApp.controller('appCtrl', ['$scope','$mdSidenav', '$mdMedia', '$mdDialog', function ($scope, $mdSidenav, $mdMedia, $mdDialog ) {
    $scope.navIsOpen = true;
	$scope.toggleMenu = function() {
    
//    console.log($mdSidenav('left').isLockedOpen());
        if($mdMedia('gt-md'))
            {
                $scope.navIsOpen = !$scope.navIsOpen;
            }
        else
            {
                $mdSidenav('left').toggle();
            }
    };
}])