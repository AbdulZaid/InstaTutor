myApp.controller('appCtrl', ['$scope','$mdSidenav', '$mdMedia', function ($scope, $mdSidenav, $mdMedia) {
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