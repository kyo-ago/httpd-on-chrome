'use strict';

Deferred.onerror = function (e) {
	console.debug([e], e.stack);
};
var httpd = angular.module('httpd');
httpd.controller('httpdCtrl', ['$scope', function () {
	var forwarder = new Forwarder();
}]);
httpd.directive('FileDrop', function () {
	return function (scope, element, attars) {
		var events = ['dragenter', 'dragover'];
		var removeAll = function () {
			events.forEach(function (name) {
				element.classList.remove(name);
			});
		};
		var cancel = function (evn) {
			evn.preventDefault();
			removeAll();
			element.add(evn.type);
		};
		events.forEach(function (name) {
			element.addEventListener(name, cancel);
		});
		element.addEventListener('drop', function (evn) {
			var dt = evn.dataTransfer;
			if (!dt.items.length) {
				return;
			}
			evn.preventDefault();
			removeAll();
			scope.$emit(attars['file-drop'], [
				[].slice.apply(dt.items).map(function (item) {
					return item.webkitGetAsEntry();
				})
			]);
		});
	}
});

