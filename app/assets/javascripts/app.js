angular.module('pm', ['templates','ngRoute','controllers', 'rails'])
       .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/', {
                templateUrl: 'index.html',
                controller: 'IndexController'
            });
       }])
       .factory('Project', ['railsResourceFactory', function (railsResourceFactory) {
            return railsResourceFactory({url: '/api/projects', name: 'project'});
       }]);

angular.module('controllers', [])
       .controller("IndexController", ['$scope', 'Project', function ($scope, Project) {
            Project.get().then(function(projects){
            $scope.projects = projects;
            });
       }]);
