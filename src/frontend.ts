/// <reference path="../bower_components/DefinitelyTyped/chrome/chrome.d.ts" />
/// <reference path="../bower_components/DefinitelyTyped/jquery/jquery.d.ts" />
/// <reference path="../bower_components/DefinitelyTyped/angularjs/angular.d.ts" />

interface JQueryStatic {
    event : {
        props : {
            push : Function
        }
    };
}
interface localStorage {
    projects : string;
}

jQuery.event.props.push('dataTransfer');

angular.module('httpd', [])
    .directive('filedrop', [() => {
        return ($scope, $element, attrs) => {
            $element
                .on('dragenter dragover', false)
                .on('drop', (evn) => {
                    var dt = evn.dataTransfer;
                    if (!dt.items.length) {
                        return;
                    }
                    evn.preventDefault();
                    $scope.$emit('FileDrop', [
                        [].slice.apply(dt.items).map( (item) => item.webkitGetAsEntry() )
                    ]);
                })
            ;
        };
    }])
    .directive('combobox', ['projects', (projects) => {
        return ($scope, $element, attrs) => {
            (<any>$scope.projects);
            $element
                .on('submit', function () {
                    (<any>$scope.projects).unshift($scope.project);
                    $scope.project = $scope.projects[0];
                    $scope.$apply();
                })
                .find('.add')
                    .on('click', function (evn) {
                        $(this).trigger('submit');
                    })
                    .on('click', false)
                .find('.del')
                    .on('click', function () {
                        var idx = $scope.projects.indexOf($scope.project);
                        (<any>$scope.projects).splice(idx, 1);
                        $scope.project = undefined;
                    })
                .end()
            ;
            $scope.projects = projects;
            $scope.project = $scope.projects[0] || {};
        };
    }])
    .value('projects', JSON.parse(localStorage['projects'] || null) || [
        /*
        'name' : 'project name',
        'basePath' : '/',
        'entries' : [
            file entries
        ]
        * */
    ])
    .controller('settings', [() => {
    }])
    .controller('index', ['$scope', ($scope) => {
    }])
    .config(['$routeProvider',  ($routeProvider) => {
        $routeProvider
            .when('/settings', {
                'templateUrl' : 'partials/settings.html',
                'controller' : 'settings'
            })
            .when('/', {
                'templateUrl' : 'partials/index.html',
                'controller' : 'index'
            })
            .otherwise({
                'redirectTo' : '/'
            })
        ;
    }])
;