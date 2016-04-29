myApp.controller('ToastCtrl', ['$scope','$mdSidenav', '$mdMedia','$mdToast', '$mdDialog', 
	function ($scope, $mdSidenav, $mdMedia, $mdToast, $mdDialog) {
  		var isDlgOpen;
		$scope.closeToast = function() {
	        if (isDlgOpen) return;
	        $mdToast
	          .hide()
	          .then(function() {
	            isDlgOpen = false;
	          });
	      };
	      $scope.openMoreInfo = function(e, content) {
	        if ( isDlgOpen ) return;
	        isDlgOpen = true;
	        $mdDialog
	          .show($mdDialog
	            .alert()
	            .title('More info goes here.')
	            .textContent('Something witty.' + content)
	            .ariaLabel('More info')
	            .ok('Got it')
	            .targetEvent(e)
	          )
	          .then(function() {
	            isDlgOpen = false;
	          })
	      };

	}])