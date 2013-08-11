(function (exports) {
	'use strict';

	var Klass = function Httpd (option) {
		this.sockets = new SocketTable();

		this.option = utils.extend({
			'socketId' : undefined,
			'timeout' : 30000
		}, option);

		if (!this.option.socketId) {
			this.emitEvent('missing socketId', arguments);
			return;
		}
		this.sockets.add('browser', this.option.socketId);
		this.setTimeout();

		this.request = undefined;
		this.location = undefined;
		this.response = undefined;
	};
	Klass.inherit(Waterfall);
	var prop = Klass.prototype;

	prop.methods = [
		function browserSetNoDelay (done) {
			var sid = this.sockets.get('browser');
			chrome.socket.setNoDelay(sid, true, function () {
				done();
			}.bind(this));
		},
		function browserRead (done) {
			var sid = this.sockets.get('browser');
			chrome.socket.read(sid, function (evn) {
				if (!evn.data.byteLength) {
					this.disconnect();
					return;
				}
				this.request = new HttpRequest(utils.ab2t(evn.data));
				if (!this.request.isComplete()) {
					this.browserRead(done);
					return;
				}
				this.location = Location.parse(this.request.getURL());
				done();
			}.bind(this));
		},
		function serverRequest (done) {
		},
		function serverConnect (done) {
		},
		function serverWrite (done) {
		},
		function serverRead (done, response) {
		},
		function browserWrite (done) {
			var text = this.response.getText();
			var len = text.length;
			var buffer = utils.t2ab(text);
			var sid = this.sockets.get('browser');
			chrome.socket.write(sid, buffer, function (evn) {
				if (evn.bytesWritten !== len) {
					this.emitEvent('error', arguments);
					return;
				}
				done();
			}.bind(this));
		},
		// calling "done" event
		function done (done) {
			this.disconnect();
			done && done();
		}
	].map(function (method) {
		return prop[method.name] = method;
	});

	prop.setTimeout = function () {
		this.setTimeoutId = setTimeout(this.disconnect.bind(this), this.option.timeout);
		this.addListener('close', this.clearTimeout.bind(this));
	};
	prop.clearTimeout = function () {
		if (this.setTimeoutId) {
			clearTimeout(this.setTimeoutId);
			this.setTimeoutId = undefined;
		}
	};
	prop.disconnect = function () {
		this.sockets.removeAll();
		this.deferred.cancel();
	};
	prop.setResponse = function (file) {
		this.response = new HttpResponse(file.data || [
			'HTTP/1.1 200 OK',
			'Connection: close',
			'Content-Length: ' + file.body.length,
			'Content-Type: ' + file.type,
			'Date: ' + (new Date).toUTCString(),
			'Cache-control: private',
			'',
			file.body
		].join('\r\n'));
		return this;
	};

	exports[Klass.name] = Klass;
})(this);
