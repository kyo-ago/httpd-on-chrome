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
interface IProject {
    name : string;
    basePath : string;
    entries : any[];
}
interface IProjectScope extends ng.IScope {
    projects : IProject[];
    project : IProject;
}

jQuery.event.props.push('dataTransfer');

angular.module('httpd', [])
    .service('filedrop', [function () {
        this.getEntries = () => {};
        (<JQuery>angular.element('body'))
            .on('dragenter dragover', false)
            .on('drop', (evn) => {
                var dt = evn.dataTransfer;
                if (!dt.items.length) {
                    return;
                }
                evn.preventDefault();
                var items = [].slice.apply(dt.items);
                this.getEntries(items.map((item) => {
                    return item.webkitGetAsEntry();
                }));
            })
        ;
    }])
    .directive('combobox', ['projects', (projects:IProject[]) => {
        return ($scope: IProjectScope, $element, attrs) => {
            $scope.projects = projects;
            $scope.project = projects[0] || {
                name : '',
                basePath : '',
                entries : []
            };
            $element
                .on('submit', function () {
                    $scope.projects.unshift($scope.project);
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
                        $scope.projects.splice(idx, 1);
                        $scope.project = undefined;
                    })
                .end()
            ;
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
    .controller('settings', ['$scope', ($scope) => {
        $scope.FileDrop = () => {
            console.log(arguments);
        };
    }])
    .controller('index', ['$scope', 'filedrop', ($scope, filedrop) => {
        filedrop.getEntries = () => {
            console.log(arguments)
        }
    }])
    .config(['$routeProvider', ($routeProvider) => {
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