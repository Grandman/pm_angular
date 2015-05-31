angular.module('pm', ['templates','ngRoute','controllers', 'rails'])
       .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/projects', {
                templateUrl: 'projects.html',
                controller: 'ProjectsController'
            });
            $routeProvider.when('/projects/new', {
                templateUrl: 'project/new.html',
                controller: 'ProjectController'
            });
            $routeProvider.when('/projects/:id', {
                templateUrl: 'project/main.html',
                controller: 'ProjectController'
            });
            $routeProvider.when('/projects/:id/tasks', {
                templateUrl: 'project/tasks.html',
                controller: 'TasksController'
            });
            $routeProvider.when('/projects/:id/tasks/new', {
                templateUrl: 'task/new.html',
                controller: 'TaskController'
            });
            $routeProvider.when('/projects/:id/tasks/:taskId', {
                templateUrl: 'task/show.html',
                controller: 'TaskController'
            });
            $routeProvider.when('/projects/:id/tasks/:taskId/edit', {
                templateUrl: 'task/edit.html',
                controller: 'TaskController'
            });
            $routeProvider.when('/projects/:project_id/users', {
                templateUrl: 'project/users.html',
                controller: 'UsersController'
            });
            $routeProvider.when('/users', {
                templateUrl: 'users.html',
                controller: 'UsersController'
            });
            $routeProvider.when('/users/new', {
                templateUrl: 'users/new.html',
                controller: 'UserController'
            });
            $routeProvider.when('/users/:user_id', {
                templateUrl: 'users/show.html',
                controller: 'UserController'
            });
            $routeProvider.when('/users/:user_id/edit', {
                templateUrl: 'users/edit.html',
                controller: 'UserController'
            });
            $routeProvider.when('/groups/new', {
                templateUrl: 'groups/new.html',
                controller: 'GroupController'
            });
            $routeProvider.when('/groups/:group_id/edit', {
                templateUrl: 'groups/edit.html',
                controller: 'GroupController'
            });
       }])
       .factory('Project', ['railsResourceFactory', function (railsResourceFactory) {
            return railsResourceFactory({url: '/api/projects', name: 'project'});
       }])
       .factory('Task', ['railsResourceFactory', function (railsResourceFactory) {
           return railsResourceFactory({url: '/api/projects/{{projectId}}/tasks/{{id}}', name: 'task'});
       }])
       .factory('User', ['railsResourceFactory', function (railsResourceFactory) {
           return railsResourceFactory({url: '/api/users', name: 'user'});
       }])
        .factory('Group', ['railsResourceFactory', function (railsResourceFactory) {
            return railsResourceFactory({url: '/api/groups', name: 'group'});
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
            if($scope.id) {
                Project.get($scope.id).then(function (project) {
                    $scope.project = project;
                });
            }
            else{
                $scope.project = new Project();
            }
            $scope.createProject = function(){
                $scope.project.create();
                $location.path("/projects");
            };
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
            $scope.location = $location.absUrl();
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
        .controller("TaskController", ['$scope', '$routeParams', '$location', 'Project', 'Task', function ($scope, $routeParams, $location, Project, Task) {
            $scope.projectId = $routeParams.id;
            console.log($routeParams);
            if($routeParams.taskId){
                $scope.taskId = $routeParams.taskId;
                Task.get({ projectId: $scope.projectId, id: $scope.taskId}).then(function(task){
                    $scope.task = task;
                });
            }
            else{
                $scope.task = new Task({projectId: $scope.projectId});
            }

            $scope.createTask = function(){
                $scope.task.create();
                $location.path("/projects/" + $scope.projectId + "/tasks/");
            };
            $scope.updateTask = function(){
                $scope.task.update();
                $location.path('/projects/' + $scope.projectId + '/tasks/')
            };
            $scope.tasksUrl = $location.absUrl() + "/tasks";
        }])
        .controller("UsersController", ['$scope', '$routeParams', '$location', 'Project', 'Task', 'User', 'Group', function ($scope, $routeParams, $location, Project, Task, User, Group) {
            $scope.projectId = $routeParams.project_id;
            console.log($routeParams);
            if($scope.projectId){
                User.get({},{projectId: $scope.projectId}).then(function(users){
                    $scope.groups = users;
                    console.log($scope.groups);
                });
            }
            else{
                User.get().then(function(users){
                    $scope.groups = users;
                    console.log($scope.groups);
                });
            }
            $scope.query = '';

            $scope.search = function (user) {
                var query = $scope.query.toLowerCase(),
                    fullname = user.firstName.toLowerCase() + ' ' + user.secondName.toLowerCase();

                if (fullname.indexOf(query) != -1) {
                    return true;
                }
                return false;
            };
            $scope.deleteGroup = function(index){
                console.log($scope.groups[index]);
                Group.get($scope.groups[index].id).then(function(group){
                        group.delete();
                        $scope.groups.splice(index, 1);
                    }
                );
                $route.reload();
            };
            $scope.tasksUrl = "#/projects/" + $scope.projectId + "/tasks";
        }])
        .controller("UserController", ['$scope', '$routeParams', '$location', 'User', 'Group', function ($scope, $routeParams, $location, User, Group) {
            if($routeParams.user_id){
                User.get($routeParams.user_id).then(function(user){
                    $scope.user = user;
                });
            }
            else{
                $scope.user = new User();
            }
            Group.get().then(function(groups){
                $scope.groups = groups;
            });
            $scope.createUser = function(){
                $scope.user.create().then(function(user){
                    $location.path("users/"+ user.id)
                });

            };
            $scope.updateUser = function(){
                $scope.user.save();
                $location.path("users/"+ $scope.user.id)
            };
            $scope.deleteUser = function(){
                $scope.user.delete();
                $location.path("users/")
            };
            $scope.tasksUrl = "#/projects/" + $scope.projectId + "/tasks";
        }])
        .controller("GroupController", ['$scope', '$routeParams', '$location', 'Group', function ($scope, $routeParams, $location, Group) {
            if($routeParams.group_id){
               Group.get($routeParams.group_id).then(function(group){
                   $scope.group = group;
               });
            }
            else{
                $scope.group = new Group();
            }
            $scope.createGroup = function(){
                $scope.group.create();
                $location.path("users/")
            };
            $scope.updateGroup = function(){
                $scope.group.update();
                $location.path("users/")
            };
        $scope.tasksUrl = "#/projects/" + $scope.projectId + "/tasks";
        }])