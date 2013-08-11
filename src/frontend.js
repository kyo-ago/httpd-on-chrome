var _this = this;
jQuery.event.props.push('dataTransfer');

angular.module('httpd', []).directive('filedrop', [
    function () {
        return function ($scope, $element, attrs) {
            $element.on('dragenter dragover', false).on('drop', function (evn) {
                var dt = evn.dataTransfer;
                if (!dt.items.length) {
                    return;
                }
                evn.preventDefault();
                $scope.$emit('FileDrop', [
                    [].slice.apply(dt.items).map(function (item) {
                        return item.webkitGetAsEntry();
                    })
                ]);
            });
        };
    }
]).directive('combobox', [
    'projects',
    function (projects) {
        return function ($scope, $element, attrs) {
            ($scope.projects);
            $element.on('submit', function () {
                ($scope.projects).unshift($scope.project);
                $scope.project = $scope.projects[0];
                $scope.$apply();
            }).find('.add').on('click', function (evn) {
                $(this).trigger('submit');
            }).on('click', false).find('.del').on('click', function () {
                var idx = $scope.projects.indexOf($scope.project);
                ($scope.projects).splice(idx, 1);
                $scope.project = undefined;
            }).end();
            $scope.projects = projects;
            $scope.project = $scope.projects[0] || {};
        };
    }
]).value('projects', JSON.parse(localStorage['projects'] || null) || []).controller('settings', [
    function () {
    }
]).controller('index', [
    '$scope',
    function ($scope) {
    }
]).config([
    '$routeProvider',
    function ($routeProvider) {
        $routeProvider.when('/settings', {
            'templateUrl': 'partials/settings.html',
            'controller': 'settings'
        }).when('/', {
            'templateUrl': 'partials/index.html',
            'controller': 'index'
        }).otherwise({
            'redirectTo': '/'
        });
    }
]);
//@ sourceMappingURL=frontend.js.map
