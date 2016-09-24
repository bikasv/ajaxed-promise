/* library version - 0.1.0 */

module.exports = function(url) {
	const setup = {
		ajax: function (method, url, args) {

			let xhr;
			let uri = url;
			let payload = null;

			if(window.XDomainRequest) {
				xhr = new XDomainRequest();
			} else {
				xhr = new XMLHttpRequest();
			}

			if(args && args.payload && args.payload.data) {
				if(args.payload.urlParam) {
					uri += '?';
					let argcount = 0;
					let payloadData = args.payload.data;
					for (let key in payloadData) {
						if (payloadData.hasOwnProperty(key)) {
							if (argcount++) {
								uri += '&';
							}
							uri += encodeURIComponent(key) + '=' + encodeURIComponent(payloadData[key]);
						}
					}
				} else {
					payload = JSON.stringify(args.payload.data);
				}
			}

			xhr.open(method, uri);

			if(args && args.config) {
				if(args.config.timeout) {
					xhr.timeout = args.config.timeout;
				}

				if(args.config.credentials) {
					xhr.withCredentials = args.config.credentials;
				}

				if(args.config.headers && Array.isArray(args.config.headers)) {
					let headers = args.config.headers;

					headers.forEach(function(header) {
						let key = Object.keys(header)[0];
						let value = header[key];

						xhr.setRequestHeader(key, value);
					});
				}
			}

			if(window.XDomainRequest) {
				xhr.send(payload);

				return {
					then: function(successCallback, failureCallback) {
						if(!successCallback) {
							return;
						}

						xhr.onload = function () {
							successCallback(formatResponse());
						};

						xhr.onerror = function () {
							if(failureCallback) {
								failureCallback(this.statusText);
							}
						};
					}
				}
			} else {
				if(typeof Promise !== "undefined" && Promise.toString().indexOf("[native code]") !== -1) {
					const promise = new Promise( function (resolve, reject) {
						xhr.send(payload);

						xhr.onload = function () {
							if (this.status >= 200 && this.status < 300) {
								resolve(formatResponse());
							} else {
								reject(this.statusText);
							}
						};

						xhr.onerror = function () {
							reject(this.statusText);
						};
					});

					return promise;
				} else {
					xhr.send(payload);

					return {
						then: function(successCallback, failureCallback) {
							if(!successCallback) {
								return;
							}

							xhr.onload = function () {
								if (this.status >= 200 && this.status < 300) {
									successCallback(formatResponse());
								} else {
									if(failureCallback) {
										failureCallback(this.statusText);
									}
								}
							};

							xhr.onerror = function () {
								if(failureCallback) {
									failureCallback(this.statusText);
								}
							};
						}
					}
				}
			}

			function formatResponse() {
				let header = xhr.getResponseHeader('content-type');

				if(header.toLowerCase().indexOf('json') > -1) {
					return JSON.parse(xhr.responseText);
				} else if(header.toLowerCase().indexOf('xml') > -1) {
					return JSON.parse(xhr.responseXML);
				} else {
					return this.responseText;
				}
			}
		},
		jsonp: function(url) {
			let callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
			let script = document.createElement('script');

			return {
				then: function(successCallback, failureCallback) {
					window[callbackName] = function(data) {
						delete window[callbackName];
						document.body.removeChild(script);
						successCallback(data);
					};

					script.onerror = function(err) {
						if(failureCallback) {
							failureCallback(err);
						}
					}

					script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
					document.body.appendChild(script);
				}
			}
		}
	};

	return {
		get: function(args) {
			return setup.ajax('GET', url, args);
		},
		post: function(args) {
			return setup.ajax('POST', url, args);
		},
		put: function(args) {
			return setup.ajax('PUT', url, args);
		},
		delete: function(args) {
			return setup.ajax('DELETE', url, args);
		},
		jsonp: function() {
			return setup.jsonp(url);
		}
	};
}