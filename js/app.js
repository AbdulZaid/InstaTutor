// Main MODULE... ui.bootstrap is for dropdown menus of bootstrap etc.. router is for states
var myApp = angular.module('myApp', ['ngRoute', 'firebase','ngAnimate','ui.router','ngMaterial','ngAria','ngMessages','ngMdIcons']);


// for ui-router
myApp.run(["$rootScope", "$state","Auth", function($rootScope, $state, Auth) {
    var ref = new Firebase("https://homeworkmarket.firebaseio.com");
    $rootScope.authData = Auth.$getAuth()

    //On state change do logic.
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        //if user is logged in and tries to access login or signup prevent it.
        if (toState.module === 'public' && $rootScope.authData ) {
            event.preventDefault();
            $state.go(fromState);
        } 
        // $rootScope.currentState = toState.name;
        // console.log($rootScope.currentState + " ha")
    });
    //redirect to login if not logged in some pages ( successful attempt. )
    $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
        // We can catch the error thrown when the $requireAuth promise is rejected
        // and redirect the user back to the home page
        if (error === "AUTH_REQUIRED") {
            console.log("directing for auth")
            $state.go("login");
            event.preventDefault();
        }
    });


}]);

//CONFIGURATION using Ui.router instead of ngRoute
myApp.config(function ($stateProvider, $urlRouterProvider) {


    // Now set up the states
    $stateProvider
    .state('main', {
        url: "/home",
        views: {
                // the main template will be placed here (relatively named)
                '': { 
                    templateUrl: 'views/main.html',
                    controller: 'mainController'
                },
                // the child views will be defined here (absolutely named)
                'postArea@main': { 
                    templateUrl: 'views/main-post.html',
                    controller: 'PostCtrl' 
                },
                'assignmentsArea@main': {
                    templateUrl: 'views/main-assignments.html',
                    controller: 'AssignmentCtrl'
                }
        },

        module: "private", //custom attributes will be used later.
        data: {
            requireLogin: true,
        },
        resolve: {
            // controller will not be loaded until $waitForAuth resolves
            // Auth refers to our $firebaseAuth wrapper in the example above
            "currentAuth": ["Auth", function(Auth) {
              // $waitForAuth returns a promise so the resolve waits for it to complete
              console.log("waiting for auth")
              return Auth.$waitForAuth();
            }]
        },
        resolve: {
            // controller will not be loaded until $requireAuth resolves
            // Auth refers to our $firebaseAuth wrapper in the example above
            "currentAuth": ["Auth", function(Auth) {
              // $requireAuth returns a promise so the resolve waits for it to complete
              // If the promise is rejected, it will throw a $stateChangeError (see above)
              console.log("requiring auth")
              return Auth.$requireAuth();
            }]
        }
    })
    .state('landing', {
        url: "/landing",
        templateUrl: "views/landing.html",
        module: "public",
    })
    .state('become-tutor', {
        url: "/become-tutor",
        templateUrl: "views/become-tutor.html",
        // module: "public",
    })
    .state('signup', {
        url: "/signup",
        controller: 'SignupCtrl',
        templateUrl: "views/signup.html",
        module: "public",

    })      
    .state('login', {
        url: "/login",
        controller: 'AuthCtrl',
        templateUrl: "views/login.html",
        module: "public",
    })
    .state('dashboard', {
        url: "/dashboard",
            // controller: 'ProfileCtrl',
            // templateUrl: "views/dashboard.html",

        views: {
            // the main template will be placed here (relatively named)
            '': { 
                templateUrl: 'views/dashboard.html',
                controller: 'ProfileCtrl'
            },
        //     // the child views will be defined here (absolutely named)
         //    'profile@dashboard': { 
         //     templateUrl: 'views/dashboard-profile.html',
         //     controller: 'ProfileCtrl' 
            // },
        },

        module: "private",
        resolve: {
            // controller will not be loaded until $waitForAuth resolves
            // Auth refers to our $firebaseAuth wrapper in the example above
            currentAuth: ["Auth", function(Auth) {
              // $waitForAuth returns a promise so the resolve waits for it to complete
              console.log("waiting for auth you dumbass")
              return Auth.$waitForAuth();
            }]
        },
        resolve: {
            // controller will not be loaded until $requireAuth resolves
            // Auth refers to our $firebaseAuth wrapper in the example above
            currentAuth: ["Auth", function(Auth) {
              // $requireAuth returns a promise so the resolve waits for it to complete
              // If the promise is rejected, it will throw a $stateChangeError (see above)
              console.log("requiring auth you idiot")
              return Auth.$requireAuth();
            }]
        }
    })
    .state('dashboard.myProfile', {
        url: "/myProfile",
        templateUrl: "views/dashboard-profile.html",
        ProfileCtrl: "ProfileCtrl"
    })
    .state('dashboard.myAssignments', {
        url: "/myAssignments",
        templateUrl: "views/dashboard-assignments.html", 
        controller: "UserAssignmentCtrl"
    })
    .state('dashboard.myProposals', {
        url: "/myProposals",
        templateUrl: "views/messages.html", 
        controller: "MessagesCtrl"
    })
    .state('dashboard.myJobs', {
        url: "/myJobs",
        templateUrl: "views/dashboard-jobs.html", 
        controller: "JobsCtrl"
    })
    .state('jobPost', {
        url: "/job/:jobID",
        templateUrl: "views/job-page.html", 
        controller: "JobPageCtrl"
    })

    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise('/home' )
})




