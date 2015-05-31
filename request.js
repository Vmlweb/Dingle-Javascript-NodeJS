var http = require('http');
var request = require('request');
var query = require('querystring');
var path = require('path');
var net = require('net');
var dgram = require("dgram");
var url = require('url');

//Hostnames
exports.hostnames = {};
//exports.hostnames['METHOD'] = 'URL';
<hostnames>

//Route Request
exports.sendRequest = function(func, methods, params, callback){
	
	//Methods
	for (method in methods){
		method = methods[method];
		
		//Route
		if (method == "UDP" && exports.hostnames.hasOwnProperty('UDP')){
			return exports.sendRequestUDP(func, params, callback);
		
		}else if (method == "TCP" && exports.hostnames.hasOwnProperty('UDP')){
			return exports.sendRequestTCP(func, params, callback);
		
		}else if (method == "POST" && (exports.hostnames.hasOwnProperty('HTTP') || exports.hostnames.hasOwnProperty('HTTPS'))){
			return exports.sendRequestPOST(func, params, callback);
		
		}else if ([ "OPTIONS", "GET", "HEAD", "PUT", "PATCH", "DELETE", "TRACE", "CONNECT" ].indexOf(method) != -1
		 	&& (exports.hostnames.hasOwnProperty('HTTP') || exports.hostnames.hasOwnProperty('HTTPS'))){
			return exports.sendRequestHTTP(func, method, params, callback);
		
		}else{
			return callback(false, 'Could not find method to call', {});
		}
	}
}

//HTTP Request
exports.sendRequestHTTP = function(func, method, params, callback){
	
	//Method
	if (!exports.hostnames.hasOwnProperty('HTTP') && !exports.hostnames.hasOwnProperty('HTTPS')){
		return callback(false, 'Could not find HTTP or HTTPS hostname', {});
	}else{
		var hostname = exports.hostnames['HTTPS'] || exports.hostnames['HTTP'];
	}
	
	//Request
    var buffer = new Buffer("");
	var req = request({
		method: method,
		uri: url.resolve(hostname, func + '/?' + query.stringify(params)),
	}, function (error, response, body) {
		
		//Check Error
		if(!error){
			
			//Check Download
			if (response.headers.hasOwnProperty('content-disposition') && 
				response.headers['content-disposition'].indexOf('attachment') != -1){
			
				//Respond  buffer
				return callback(true, 'File downloading...', buffer);
					
			}else{
			
				//Response
				body = JSON.parse(body);
				return callback(body.success, body.message, body.output);
			}
			
		} else {
			return callback(false, error.toString(), {});
		}
    });
    
    //Get Data
    req.on('data', function(data) {
    	buffer = Buffer.concat([buffer, data]);
    });
}

//HTTP POST Request
exports.sendRequestPOST = function(func, params, callback){
	
	//Method
	if (!exports.hostnames.hasOwnProperty('HTTP') && !exports.hostnames.hasOwnProperty('HTTPS')){
		return callback(false, 'Could not find HTTP or HTTPS hostname', {});
	}else{
		var hostname = exports.hostnames['HTTPS'] || exports.hostnames['HTTP'];
	}
	
	//Request
    var buffer = new Buffer("");
	var req = request({
		method: "POST",
		uri: url.resolve(hostname,func),
		formData: params
	}, function (error, response, body) {
		
		//Check Error
		if(!error){
			
			//Check Download
			if (response.headers.hasOwnProperty('content-disposition') && 
				response.headers['content-disposition'].indexOf('attachment') != -1){
			
				//Respond  buffer
				return callback(true, 'File downloading...', buffer);
					
			}else{
			
				//Response
				body = JSON.parse(body);
				return callback(body.success, body.message, body.output);
			}
			
		} else {
			return callback(false, error.toString(), {});
		}
    });
    
    //Get Data
    req.on('data', function(data) {
    	buffer = Buffer.concat([buffer, data]);
    });
}

//TCP Request
exports.sendRequestTCP = function(func, params, callback){
	
	//Method
	if (!exports.hostnames.hasOwnProperty('TCP')){
		return callback(false, 'Could not find TCP hostname', {});
	}else{
		var hostname = url.parse(exports.hostnames['TCP']);
	}
	
	//Request
	var socket = new net.Socket();
	socket.connect(hostname.port, hostname.hostname, function() {
 		socket.write('/' + path.join(func, query.stringify(params)));
 		
 		//Response
 		socket.on('data', function(body) {
 			body = JSON.parse(body);
			callback(body.success, body.message, body.output);
			socket.destroy();
		});
	});
}

//UDP Request
exports.sendRequestUDP = function(func, params, callback){
	
	//Method
	if (!exports.hostnames.hasOwnProperty('UDP')){
		return callback(false, 'Could not find UDP hostname', {});
	}else{
		var hostname = url.parse(exports.hostnames['UDP']);
	}
	
	//Request
	var socket = dgram.createSocket('udp4');
	var message = new Buffer('/' + path.join(func, query.stringify(params)));
	socket.send(message, 0, message.length, hostname.port, hostname.hostname, function(error, bytes) {
		
		//Response
		socket.on('message', function (message, remote) {
			body = JSON.parse(message.toString());
			callback(body.success, body.message, body.output);
			socket.close();
		});
	});
}

//Request Functions
/*
exports.name = function(name, callback){
	
	//Parameters
	var params = {};
	if (name != null){ params[name] = name.toString(); }
	
	//Execute
	exports.sendRequest('name', [ "METHOD" ], params, callback);
}
*/
<functions>