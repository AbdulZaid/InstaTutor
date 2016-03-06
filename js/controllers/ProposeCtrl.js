myApp.controller('ProposeCtrl', ['$scope','Auth','Users','$firebaseArray','$firebaseObject','$mdDialog', '$mdMedia', function ($scope, Auth, Users, $firebaseArray, $firebaseObject, $mdDialog, $mdMedia, $location) {

  $scope.doSecondaryAction = function(ev) {
    $mdDialog.show({
      // controller: 'ProposeCtrl',
      templateUrl: 'views/propose.html',
      parent: angular.element(document.body),
      // locals: {
      //   items: $scope.obj
      // },
      targetEvent: ev,
      clickOutsideToClose:true,
    });
  }
  
}]);