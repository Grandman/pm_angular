angular.module('pm', ['templates','ngRoute','controllers', 'rails'])
       .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/projects', {
                templateUrl: 'projects.html',
                controller: 'ProjectsController'
            });
            $routeProvider.when('/projects/:id', {
                templateUrl: 'project/main.html',
                controller: 'ProjectController'
            });
            $routeProvider.when('/projects/:id/tasks', {
                templateUrl: 'project/tasks.html',
                controller: 'TasksController'
            });
       }])
       .factory('Project', ['railsResourceFactory', function (railsResourceFactory) {
            return railsResourceFactory({url: '/api/projects', name: 'project'});
       }])
       .factory('Task', ['railsResourceFactory', function (railsResourceFactory) {
           return railsResourceFactory({url: '/api/projects/{{projectId}}/tasks', name: 'task'});
       }]);

angular.module('controllers', [])
       .controller("ProjectsController", ['$scope', '$timeout', '$location', 'Project', function ($scope, $timeout, $location, Project) {
        var timer;
        $scope.location = $location.absUrl();
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
                        if(!angular.equals($scope.projects, projects))
                            $scope.projects = projects;
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


       }])
       .controller("ProjectController", ['$scope', '$routeParams', '$location', 'Project', function ($scope, $routeParams, $location, Project) {
            if($routeParams.id){
                $scope.id = $routeParams.id;
            }
            $scope.tasksUrl = $location.absUrl() + "/tasks";
            Project.get($scope.id).then(function(project){
                $scope.project = project;
            });
            $scope.saveProject = function(){
                $scope.project.save();
            };
            $scope.deleteProject = function(){
                $scope.project.delete();
            };
       }])
        .controller("TasksController", ['$scope', '$timeout', '$routeParams', '$location', 'Project', 'Task', function ($scope,  $timeout, $routeParams, $location, Project, Task) {
            var timer;
            $scope.projectId = $routeParams.id;
            Task.get({projectId: $scope.projectId}).then(function(tasks){
                $scope.tasks = tasks;
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
                        Task.get({projectId: $scope.projectId}).then(function(tasks){
                            if(!angular.equals($scope.tasks, tasks))
                                $scope.tasks = tasks;
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
            myLoop();
        }])
