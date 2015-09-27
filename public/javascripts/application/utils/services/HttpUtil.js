/**
 * This class provides utility methods built on top of the angular's $http service.
 *
 * @class HttpUtil
 * @module util
 * @param $http the angular HTTP service
 */
WMU.service('HttpUtil', function ($http) {


    this.info = {};
    this.info.requestCpt = 0;

    var self = this;

    /**
     * Internal method called when an HTTP request has succeeded.
     *
     * @private
     * @method _success
     * @param {String} url the URL associated to JSON schema
     * @param {Object} data the object to validate against JSON schema
     */
    var _success = function(url, data) {
        self.info.requestCpt --;

        var json = typeof (data) === 'object' ? data : JSON.parse(data);

        return json;
    };

    /**
     * Internal method called when an HTTP request has failed.
     *
     * @private
     * @method _error
     * @param {Object} data the detail error object
     */
    _error = function (data) {
        self.info.requestCpt --;

        console.log(data);
    };

    /**
     * Builds and executes an HTTP request. The Content-Type will be 'application/json' and result validated with the
     * JSON schema associated to the given URI.
     *
     * @public
     * @method request
     * @param {String} method the HTTP method
     * @param {String} uri the web service URI (mapped to schema and relative to server URL)
     * @param {Object} payload the data to send (POST method case)
     */
    this.request = function (method, uri, payload) {
        self.info.requestCpt ++;
        //We return the promise
        return $http({
            url: uri + "?",
            dataType: "json",
            data: method == "GET" ? "" : payload,
            method: method,
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        }).then(function (data) {
                return _success(uri, data.data);
            }, _error);
    };

    /**
     * return the number of active httpRequest.
     *
     * @public
     * @method getRequestCpt
     */
    this.getRequestCpt = function () {
        return self.info;
    };

});
