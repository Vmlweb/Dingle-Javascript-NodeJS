var http = require('http');
var request = require('request');
var query = require('querystring');
var path = require('path');
var net = require('net');
var dgram = require("dgram");
var url = require('url');

//Hostnames
exports.hostnames = {};
//exports.method = 'URL';
<hostnames>

//Route Request
exports.sendRequest = function(func, methods, params, callback, uploading, downloading, stream){
	
	//Methods
	for (method in methods){
		method = methods[method];
		
		//Route
		if (method == "UDP" && exports.udp){
			return exports.dingleUDP(func, params, callback);
		
		}else if (method == "TCP" && exports.tcp){
			return exports.dingleTCP(func, params, callback);
		
		}else if (method == "POST" && (exports.https || exports.http)){
			return exports.dinglePOST(func, params, callback, uploading, downloading, stream);
		
		}else if ([ "OPTIONS", "GET", "HEAD", "PUT", "PATCH", "DELETE", "TRACE", "CONNECT" ].indexOf(method) != -1
		 	&& (exports.https || exports.http)){
			return exports.dingleHTTP(func, method, params, callback, uploading, downloading, stream);
		
		}else{
			return callback(false, 'Could not find method to call', {});
		}
	}
}

//HTTP Request
exports.dingleHTTP = function(func, method, params, callback, uploading, downloading, stream){
	
	//Method
	if (!exports.http && !exports.https){
		return callback(false, 'Could not find HTTP or HTTPS hostname', {});
	}else{
		var hostname = exports.https || exports.http;
	}
	
	//Upload progress
    var upload_progress = setInterval(function(){
	   	if (uploading && !req.hasOwnProperty('responseContent')){
	   	
	   		//Callback
			var size = req.req.connection._httpMessage._headers['content-length'];
			var remaining = size - req.req.connection._bytesDispatched;
			var percentage = Math.round(100 - ((100/size) * remaining));
			uploading(size, remaining, percentage);
		}
    }, 250);
    
    //Download progress
    var download_progress = setInterval(function(){
    	if (downloading && req.hasOwnProperty('responseContent')){
    	
	   		//Callback
			var size = req.responseContent.headers['content-length'];
			var remaining = size - req.responseContent.client.bytesRead;
			var percentage = Math.round(100 - ((100/size) * remaining));
			downloading(size, remaining, percentage);
		}
    }, 250);
    
    //Request
	var req = request({
		method: method,
		uri: url.resolve(hostname, func + '/?' + query.stringify(params)),
	}, function (error, response, body) {
		
		clearInterval(upload_progress);
		clearInterval(download_progress);
		
		//Check if stream
		if (!response.headers.hasOwnProperty('content-disposition')){
	
			//Check Error
			if(!error){

				//Response
				try{
					body = JSON.parse(body);
					return callback(body.success, body.message, body.output);
				}catch (error){
					return callback(false, 'Invalid JSON response', {});
				}

			} else {
				return callback(false, error.toString(), {});
			}
		}
	});
	
	//Response
	req.on('response',function (response){
		
		//Stream
		if (stream && response.headers.hasOwnProperty('content-disposition')){
			
			//Pipe
			req.callback = null;
			req.pipe(stream);
			
			//Stream complete
			stream.on('finish', function() {

				clearInterval(upload_progress);
				clearInterval(download_progress);

				//End stream
				return callback(true, 'Response written to stream', stream);
			});
		}else if (!stream && response.headers.hasOwnProperty('content-disposition')){
			
			//No stream
			req.callback = null;
			return callback(false, 'Stream required to download this file.', {})
		}
	});
}

//HTTP POST Request
exports.dinglePOST = function(func, params, callback, uploading, downloading, stream){
	
	//Method
	if (!exports.http && !exports.https){
		return callback(false, 'Could not find HTTP or HTTPS hostname', {});
	}else{
		var hostname = exports.https || exports.http;
	}
	
	//Upload progress
    var upload_progress = setInterval(function(){
	   	if (uploading && !req.hasOwnProperty('responseContent')){
	   	
	   		//Callback
			var size = req.req.connection._httpMessage._headers['content-length'];
			var remaining = size - req.req.connection._bytesDispatched;
			var percentage = Math.round(100 - ((100/size) * remaining));
			uploading(size, remaining, percentage);
		}
    }, 250);
    
    //Download progress
    var download_progress = setInterval(function(){
    	if (downloading && req.hasOwnProperty('responseContent')){
    	
	   		//Callback
			var size = req.responseContent.headers['content-length'];
			var remaining = size - req.responseContent.client.bytesRead;
			var percentage = Math.round(100 - ((100/size) * remaining));
			downloading(size, remaining, percentage);
		}
    }, 250);
    
    //Request
	var req = request({
		method: "POST",
		uri: url.resolve(hostname,func),
		formData: params
	}, function (error, response, body) {
		
		clearInterval(upload_progress);
		clearInterval(download_progress);
		
		//Check if stream
		if (!response.headers.hasOwnProperty('content-disposition')){
	
			//Check Error
			if(!error){

				//Response
				try{
					body = JSON.parse(body);
					return callback(body.success, body.message, body.output);
				}catch (error){
					return callback(false, 'Invalid JSON response', {});
				}

			} else {
				return callback(false, error.toString(), {});
			}
		}
	});
	
	//Response
	req.on('response',function (response){
		
		//Stream
		if (stream && response.headers.hasOwnProperty('content-disposition')){
			
			//Pipe
			req.callback = null;
			req.pipe(stream);
			
			//Stream complete
			stream.on('finish', function() {

				clearInterval(upload_progress);
				clearInterval(download_progress);

				//End stream
				return callback(true, 'Response written to stream', stream);
			});
		}else if (!stream && response.headers.hasOwnProperty('content-disposition')){
			
			//No stream
			req.callback = null;
			return callback(false, 'Stream required to download this file.', {})
		}
	});
}

//TCP Request
exports.dingleTCP = function(func, params, callback){
	
	//Method
	if (!exports.tcp){
		return callback(false, 'Could not find TCP hostname', {});
	}else{
		var hostname = url.parse(exports.tcp);
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
exports.dingleUDP = function(func, params, callback){
	
	//Method
	if (!exports.udp){
		return callback(false, 'Could not find UDP hostname', {});
	}else{
		var hostname = url.parse(exports.udp);
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