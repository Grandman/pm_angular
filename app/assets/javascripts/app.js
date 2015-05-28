angular.module('pm', ['templates','ngRoute','controllers', 'rails'])
       .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/', {
                templateUrl: 'index.html',
                controller: 'IndexController'
            });
        $routeProvider.when('/index', {
            templateUrl: 'index.html',
            controller: 'ProjectController'
        });
       }])
       .factory('Project', ['railsResourceFactory', function (railsResourceFactory) {
            return railsResourceFactory({url: '/api/projects', name: 'project'});
       }]);

angular.module('controllers', [])
       .controller("IndexController", ['$scope', '$timeout', 'Project', function ($scope, $timeout, Project) {
        var timer;
        Project.get().then(function(projects){
            $scope.projects = projects;
        });
        function myLoop(){
            timer = $timeout(
                function() {
                    console.log( "Timeout executed");
                },
                1000
            );
            timer.then(
                function() {
                    console.log( "Timer resolved!");
                    Project.get().then(function(projects){
                        //for(var i in projects) {
                        //    // There is more data in the result than just the users, so check types.
                        //       console.log(projects[i].id);
                        //
                        //}
                        if(!angular.equals($scope.projects, projects))
                            $scope.projects = projects;
                        //$scope.$watch( function () {
                        //    $scope.projects = projects;
                        //});
                        myLoop();
                    });

                },
                function() {
                    console.log( "Timer rejected!" );
                }
            );

            $scope.$on(
                "$destroy",
                function( event ) {
                    $timeout.cancel( timer );
                }
            );
        }
        $scope.stopUpdate = function(){
            $timeout.cancel( timer );
        };
        $scope.startUpdate = function(){
          myLoop();
        };
        $scope.saveProject = function(id){
            $scope.projects[id].save();
        };
        $scope.deleteProject = function(id){
            project = $scope.projects[id];
            $scope.projects.splice(id, 1);
            project.delete();
        };
        $scope.$watchCollection('projects', function (newVal, oldVal) {
            console.log(newVal)
        }, false);
        myLoop();


       }]);
