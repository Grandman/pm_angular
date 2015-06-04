angular.module('pm', ['templates','ngRoute','controllers', 'rails', 'ngCookies', 'ui.select', 'ngSanitize', 'ui.bootstrap', 'googlechart'])
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
            $routeProvider.when('/projects/:id/edit', {
                templateUrl: 'project/edit.html',
                controller: 'ProjectController'
            });
            $routeProvider.when('/projects/:id/tasks/new', {
                templateUrl: 'task/new.html',
                controller: 'TaskController'
            });
            $routeProvider.when('/projects/:id/tasks/:taskId', {
                templateUrl: 'task/show.html',
                controller: 'TaskController'
            });
            $routeProvider.when('/projects/:projectId/tasks/:taskId/comments', {
                templateUrl: 'task/comments.html',
                controller: 'CommentsController'
            });
            $routeProvider.when('/projects/:id/tasks/:parentId/new', {
                templateUrl: 'task/new.html',
                controller: 'TaskController'
            });
            $routeProvider.when('/projects/:id/tasks/:taskId/edit', {
                templateUrl: 'task/edit.html',
                controller: 'TaskController'
            });
            $routeProvider.when('/projects/:id/tasks/:taskId/close', {
                templateUrl: 'task/close.html',
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
            $routeProvider.when('/login', {
                templateUrl: 'login.html',
                controller: 'LoginController'
            });
            $routeProvider.when('/register', {
                templateUrl: 'register.html',
                controller: 'RegisterController'
            });
            $routeProvider.when('/reports', {
                templateUrl: 'reports.html',
                controller: 'ReportsController'
            });
       }])
        .run(function($rootScope, $location) {
            $rootScope.$on( "$routeChangeStart", function(event, next, current) {
                if ( $rootScope.loggedUser == null ) {
                    if ( next.templateUrl == "login.html" || next.templateUrl == "register.html" ) {

                    } else {
                        $location.path( "/login" );
                    }
                }

            });
        })
        .filter('propsFilter', function() {
            return function(items, props) {
                var out = [];

                if (angular.isArray(items)) {
                    items.forEach(function(item) {
                        var itemMatches = false;

                        var keys = Object.keys(props);
                        for (var i = 0; i < keys.length; i++) {
                            var prop = keys[i];
                            var text = props[prop].toLowerCase();
                            if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                                itemMatches = true;
                                break;
                            }
                        }

                        if (itemMatches) {
                            out.push(item);
                        }
                    });
                } else {
                    // Let the output be the input untouched
                    out = items;
                }

                return out;
            };
        })
       .factory('Project', ['railsResourceFactory', function (railsResourceFactory) {
            return railsResourceFactory({url: '/api/projects', name: 'project'});
       }])
       .factory('Task', ['railsResourceFactory', function (railsResourceFactory) {
           return railsResourceFactory({url: '/api/projects/{{projectId}}/tasks/{{id}}', name: 'task'});
       }])
        .factory('Comment', ['railsResourceFactory', function (railsResourceFactory) {
            return railsResourceFactory({
                url: '/api/projects/{{projectId}}/tasks/{{taskId}}/comments',
                name: 'comment'});
        }])
       .factory('User', ['railsResourceFactory', function (railsResourceFactory) {
           return railsResourceFactory({url: '/api/users', name: 'user'});
       }])
        .factory('Company', ['railsResourceFactory', function (railsResourceFactory) {
            return railsResourceFactory({url: '/api/companies', name: 'company'});
        }])
        .factory('Group', ['railsResourceFactory', function (railsResourceFactory) {
            return railsResourceFactory({url: '/api/groups', name: 'group'});
        }]);

angular.module('controllers', [])
       .controller("ProjectsController", ['$scope', '$rootScope', '$timeout', '$location', 'Project', function ($scope, $rootScope, $timeout, $location, Project) {
        var timer;
        $scope.location = $location.absUrl();
        Project.get({},{companyId: $rootScope.company.id}).then(function(projects){
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
                    Project.get({},{companyId: $rootScope.company.id}).then(function(projects){
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
       .controller("ProjectController", ['$scope', '$rootScope', '$routeParams', '$location', 'Project', function ($scope, $rootScope, $routeParams, $location, Project) {
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
                $scope.project.companyId = $rootScope.company.id;
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
            $scope.childrenHide = [];
            Task.get({projectId: $scope.projectId}).then(function(tasks){
                $scope.tasks = tasks;
                $scope.tasks.forEach(function(item, i, arr) {
                    $scope.childrenHide[item.id]=false;
                });
                console.log($scope.childrenHide);
            });
            $scope.showSubtasks = function(id){
                $scope.childrenHide[id]=true;
            };

            function myLoop(){
                timer = $timeout(
                    function() {
                        console.log( "Timeout executed");
                    },
                    1000
                );
                console.log($scope.childrenHide);
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
        .controller("TaskController", ['$scope', '$rootScope', '$routeParams', '$location', 'Project', 'Task', 'User', function ($scope, $rootScope, $routeParams, $location, Project, Task, User) {
            $scope.projectId = $routeParams.id;
            console.log($routeParams);
            if($routeParams.taskId){
                $scope.taskId = $routeParams.taskId;
                Task.get({ projectId: $scope.projectId, id: $scope.taskId}).then(function(task){
                    $scope.task = task;
                    console.log($scope.task)
                });
            }
            else{
                $scope.task = new Task({projectId: $scope.projectId});
            }
            if ($routeParams.parentId) {
                console.log($routeParams.parentId);
                $scope.task.parent = $routeParams.parentId;
            }
            User.get({}, {onlyUsers: true, companyId: $rootScope.company.id}).then(function(users){
                $scope.users = users;
                console.log($scope.users);
                //$scope.UserGet = function(id){
                //    return _.find(users,function(rw){ return rw.id == id });
                //};
            });
            $scope.GetUser = function(){
                User.get({}, {companyId: $rootScope.company.id, startDate: $scope.task.startDate, endTime: $scope.task.endTime}).then(function(groups){
                    if(groups.length == 0){
                        $scope.task.user = "";
                        $scope.errors = "Нет подходящих групп"
                    }
                    else
                    {
                        if (groups[0].users.length == 0){
                            $scope.task.user = "";
                            $scope.errors = "Нет подходящих пользователей"
                        }
                        else{
                            $scope.task.user = groups[0].users[0]
                        }
                    }

                })
            };
            $scope.taskUser = null;


            $scope.createTask = function(){
                $scope.task.userId = $scope.task.user.id;
                $scope.task.create().then(function(success){
                    $location.path("/projects/" + $scope.projectId + "/tasks/");
                },function(error){
                    $scope.errors = "Не заполнены все поля";
                });

            };
            $scope.updateTask = function(){
                $scope.task.update();
                $location.path('/projects/' + $scope.projectId + '/tasks/')
            };
            $scope.closeTask = function(){
                $scope.task.finished = true;
                $scope.task.update();
                $location.path('/projects/' + $scope.projectId + '/tasks/')
            };
            $scope.tasksUrl = $location.absUrl() + "/tasks";
        }])
        .controller("CommentsController", ['$scope', '$rootScope', '$routeParams', '$location', 'Project', 'Task', 'Comment', 'User', function ($scope, $rootScope, $routeParams, $location, Project, Task, Comment, User) {
            $scope.projectId = $routeParams.projectId;
            $scope.addingComment = [];
            $scope.taskId = $routeParams.taskId;
            $scope.newComment = new Comment({projectId: $routeParams.projectId, taskId: $routeParams.taskId});
            Comment.get({ projectId: $routeParams.projectId, taskId: $scope.taskId}).then(function(comments){
                $scope.comments = comments;
            });

            $scope.AddComment = function(parentComment, user_id){
                console.log($rootScope.loggedUser);
                console.log($rootScope.loggedUser.id);
                if(parentComment){
                    $scope.newComment.parent = parentComment.id;
                    $scope.addingComment[parentComment.id] = false;
                }
                $scope.newComment.user_id = user_id;
                $scope.newComment.create({projectId: $routeParams.projectId, taskId: $routeParams.taskId});
                $scope.newComment = new Comment({projectId: $routeParams.projectId, taskId: $routeParams.taskId});
                Comment.get({ projectId: $routeParams.projectId, taskId: $scope.taskId}).then(function(comments){
                    $scope.comments = comments;
                });
            };
            $scope.taskUsers = [];
            $scope.users = [];
            User.get({}, {onlyUsers: true, companyId: $rootScope.company.id}).then(function(users){
                $scope.users = users;
                $scope.UserGet = function(id){
                    return _.find(users,function(rw){ return rw.id == id });
                };
            });


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
        .controller("UsersController", ['$scope', '$rootScope', '$routeParams', '$location', 'Project', 'Task', 'User', 'Group', function ($scope, $rootScope, $routeParams, $location, Project, Task, User, Group) {
            $scope.projectId = $routeParams.project_id;
            console.log($routeParams);
            if($scope.projectId){
                User.get({},{projectId: $scope.projectId, companyId: $rootScope.company.id}).then(function(users){
                    $scope.groups = users;
                    console.log($scope.groups);
                });
            }
            else{
                User.get({},{companyId: $rootScope.company.id}).then(function(users){
                    $scope.groups = users;
                    console.log($scope.groups);
                });
            }
            $scope.query = '';

            $scope.search = function (user) {
                var query = $scope.query.toLowerCase(),
                    fullname = user.firstName.toLowerCase() + ' ' + user.secondName.toLowerCase();

                return fullname.indexOf(query) != -1;

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
        .controller("UserController", ['$scope', '$rootScope', '$routeParams', '$location', 'User', 'Group', function ($scope, $rootScope, $routeParams, $location, User, Group) {
            if($routeParams.user_id){
                User.get($routeParams.user_id).then(function(user){
                    $scope.user = user;
                });
            }
            else{
                $scope.user = new User();
            }
            Group.get({}, {companyId: $rootScope.company.id}).then(function(groups){
                $scope.groups = groups;
            });
            $scope.createUser = function(){
                $scope.user.companyId = $rootScope.company.id;
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
        .controller("GroupController", ['$scope', '$rootScope', '$routeParams', '$location', 'Group', function ($scope, $rootScope, $routeParams, $location, Group) {
            if($routeParams.group_id){
               Group.get($routeParams.group_id).then(function(group){
                   $scope.group = group;
               });
            }
            else{
                $scope.group = new Group();
            }
            $scope.createGroup = function(){
                $scope.group.companyId = $rootScope.company.id;
                $scope.group.create();
                $location.path("users/")
            };
            $scope.updateGroup = function(){
                $scope.group.update();
                $location.path("users/")
            };
        $scope.tasksUrl = "#/projects/" + $scope.projectId + "/tasks";
        }])
        .controller("LoginController", ['$scope', '$routeParams', '$location', '$http', '$rootScope', 'Group', 'User', 'Company', function ($scope, $routeParams, $location, $http, $rootScope, Group, User, Company) {
            $scope.user = null;
            $scope.Login = function(){
                $http.post('/api/sessions', {email: $scope.email, password: $scope.password}).
                    success(function(data, status, headers, config) {
                        User.get(data.id).then(function(user){
                            $rootScope.loggedUser = new User(user);
                            $scope.user = new User(user);
                            Company.get($scope.user.companyId).then(function(company){
                                $rootScope.company = company;
                            });
                        });
                        $location.path("/projects")
                    }).
                    error(function(data, status, headers, config) {
                        $scope.error = data.errors;
                    });
            };
        }])
        .controller("RegisterController", ['$scope', '$routeParams', '$location', '$http', '$rootScope', 'Company', 'Group',  'User', function ($scope, $routeParams, $location, $http, $rootScope, Company, Group, User) {
            $scope.company = new Company();
            $scope.user = new User();
            $scope.Register = function(){
                $scope.company.create().then(function(company){
                    $scope.group = new Group();
                    $scope.group.name = "Менеджеры";
                    $scope.group.costPerHour = 0;
                    $scope.group.companyId = company.id;
                    $rootScope.company = company;
                    $scope.group.create().then(function(group){
                        $scope.user.manager = true;
                        $scope.user.groupId = group.id;
                        $scope.user.companyId = company.id;
                        $scope.user.create().then(function(data){
                            $rootScope.loggedUser = new User(data);
                            $scope.user = new User(data);
                            $location.path("/projects");
                        }, function(error){
                            $scope.errors = "Не удалось создать пользователя";
                        })
                    }, function(error){
                        $scope.errors = "Не удалось создать группу";
                    })
                }, function(error){
                    $scope.errors = "Не удалось создать компанию";
                })
            };
        }])
        .controller("ReportsController", ['$scope', '$routeParams', '$location', '$http', '$rootScope', 'Company', 'Group',  'User', function ($scope, $routeParams, $location, $http, $rootScope, Company, Group, User) {
        User.get({}, {onlyUsers: true, companyId: $rootScope.company.id}).then(function(users){
            $scope.users = users;
            $scope.maxUser = _.max(users, function(user){ return user.finishedTaskCount; });
            $scope.allTasks =_.reduce(users, function(memo, user){ return memo + user.finishedTaskCount; }, 0);
            console.log($scope.maxUser)
            $scope.chartObject = {
                "type": "LineChart",
                "displayed": true,
                "data": {
                    "cols": [
                        {
                            "id": "day",
                            "label": "День",
                            "type": "number",
                            "p": {}
                        },
                        {
                            "id": "cost-id",
                            "label": "Задачи",
                            "type": "number"
                        }
                    ],
                    "rows": [
                        {
                            "c": [
                                {
                                    "v": 1
                                },
                                {
                                    "v": 0
                                }
                            ]
                        },
                        {
                            "c": [
                                {
                                    "v": 2
                                },
                                {
                                    "v": 0
                                }
                            ]
                        },
                        {
                            "c": [
                                {
                                    "v": 3
                                },
                                {
                                    "v": 0
                                }
                            ]
                        },
                        {
                            "c": [
                                {
                                    "v": 4
                                },
                                {
                                    "v": $scope.allTasks
                                }
                            ]
                        },
                        {
                            "c": [
                                {
                                    "v": 5
                                },
                                {
                                    "v": 0
                                }
                            ]
                        },
                        {
                            "c": [
                                {
                                    "v": 6
                                },
                                {
                                    "v": 0
                                }
                            ]
                        },
                        {
                            "c": [
                                {
                                    "v": 7
                                },
                                {
                                    "v": 0
                                }
                            ]
                        },
                        {
                            "c": [
                                {
                                    "v": 8
                                },
                                {
                                    "v": 0
                                }
                            ]
                        },
                        {
                            "c": [
                                {
                                    "v": 9
                                },
                                {
                                    "v": 0
                                }
                            ]
                        },
                        {
                            "c": [
                                {
                                    "v": 10
                                },
                                {
                                    "v": 0
                                }
                            ]
                        },
                        {
                            "c": [
                                {
                                    "v": 11
                                },
                                {
                                    "v": 0
                                }
                            ]
                        },
                        {
                            "c": [
                                {
                                    "v": 12
                                },
                                {
                                    "v": 0
                                }
                            ]
                        },
                        {
                            "c": [
                                {
                                    "v": 13
                                },
                                {
                                    "v": 0
                                }
                            ]
                        },
                        {
                            "c": [
                                {
                                    "v": 14
                                },
                                {
                                    "v": 0
                                }
                            ]
                        },
                        {
                            "c": [
                                {
                                    "v": 15
                                },
                                {
                                    "v": 0
                                }
                            ]
                        },
                        {
                            "c": [
                                {
                                    "v": 16
                                },
                                {
                                    "v": 0
                                }
                            ]
                        },
                        {
                            "c": [
                                {
                                    "v": 17
                                },
                                {
                                    "v": 0
                                }
                            ]
                        },
                        {
                            "c": [
                                {
                                    "v": 18
                                },
                                {
                                    "v": 0
                                }
                            ]
                        },
                        {
                            "c": [
                                {
                                    "v": 19
                                },
                                {
                                    "v": 0
                                }
                            ]
                        },
                        {
                            "c": [
                                {
                                    "v": 20
                                },
                                {
                                    "v": 0
                                }
                            ]
                        },
                        {
                            "c": [
                                {
                                    "v": 21
                                },
                                {
                                    "v": 0
                                }
                            ]
                        },
                        {
                            "c": [
                                {
                                    "v": 22
                                },
                                {
                                    "v": 0
                                }
                            ]
                        },
                        {
                            "c": [
                                {
                                    "v": 23
                                },
                                {
                                    "v": 0
                                }
                            ]
                        },
                        {
                            "c": [
                                {
                                    "v": 24
                                },
                                {
                                    "v": 0
                                }
                            ]
                        },
                        {
                            "c": [
                                {
                                    "v": 25
                                },
                                {
                                    "v": 0
                                }
                            ]
                        },
                        {
                            "c": [
                                {
                                    "v": 26
                                },
                                {
                                    "v": 0
                                }
                            ]
                        },
                        {
                            "c": [
                                {
                                    "v": 27
                                },
                                {
                                    "v": 0
                                }
                            ]
                        },
                        {
                            "c": [
                                {
                                    "v": 28
                                },
                                {
                                    "v": 0
                                }
                            ]
                        },
                        {
                            "c": [
                                {
                                    "v": 29
                                },
                                {
                                    "v": 0
                                }
                            ]
                        },
                        {
                            "c": [
                                {
                                    "v": 30
                                },
                                {
                                    "v": 0
                                }
                            ]
                        }
                    ]
                },
                "options": {
                    "title": "Завершенные задачи",
                    "displayExactValues": true,
                    "vAxis": {
                        "title": "Количество завершенных задач",
                        "gridlines": {
                            "count": 10
                        }
                    },
                    "hAxis": {
                        "title": "Дата"
                    }
                },
                "formatters": {}
            }
        });

        }])