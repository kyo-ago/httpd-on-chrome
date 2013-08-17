var _this = this;
jQuery.event.props.push('dataTransfer');

angular.module('httpd', []).service('filedrop', [
    function () {
        var _this = this;
        this.getEntries = function () {
        };
        (angular.element('body')).on('dragenter dragover', false).on('drop', function (evn) {
            var dt = evn.dataTransfer;
            if (!dt.items.length) {
                return;
            }
            evn.preventDefault();
            var items = [].slice.apply(dt.items);
            _this.getEntries(items.map(function (item) {
                return item.webkitGetAsEntry();
            }));
        });
    }
]).directive('combobox', [
    'projects',
    function (projects) {
        return function ($scope, $element, attrs) {
            $scope.projects = projects;
            $scope.project = projects[0] || {
                name: '',
                basePath: '',
                entries: []
            };
            $element.on('submit', function () {
                $scope.projects.unshift($scope.project);
                $scope.project = $scope.projects[0];
                $scope.$apply();
            }).find('.add').on('click', function (evn) {
                $(this).trigger('submit');
            }).on('click', false).find('.del').on('click', function () {
                var idx = $scope.projects.indexOf($scope.project);
                $scope.projects.splice(idx, 1);
                $scope.project = undefined;
            }).end();
        };
    }
]).value('projects', JSON.parse(localStorage['projects'] || null) || []).controller('settings', [
    '$scope',
    function ($scope) {
        $scope.FileDrop = function () {
            console.log(arguments);
        };
    }
]).controller('index', [
    '$scope',
    'filedrop',
    function ($scope, filedrop) {
        filedrop.getEntries = function () {
            console.log(arguments);
        };
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
