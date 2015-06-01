var http = require('http');
var request = require('request');
var query = require('querystring');
var path = require('path');
var net = require('net');
var dgram = require("dgram");
var url = require('url');

//Hostnames
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
	if (exports.https){
		var hostname = 'https://' + exports.https + '/';
	}else if (exports.http){
		var hostname = 'http://' + exports.http + '/';
	}else{
		return callback(false, 'Could not find HTTP or HTTPS hostname', {});
	}
	
	//Upload progress
    var upload_progress = setInterval(function(){
	   	if (uploading && !req.hasOwnProperty('responseContent')){
	   	
	   		//Callback
			var size = req.req.connection._httpMessage._headers['content-length'];
			var remaining = size - req.req.connection._bytesDispatched;
			var percentage = Math.round(100 - ((100/size) * remaining));
			uploading(size, Math.max(0, remaining), percentage);
		}
    }, 250);
    
    //Download progress
    var download_progress = setInterval(function(){
    	if (downloading && req.hasOwnProperty('responseContent')){
    	
	   		//Callback
			var size = req.responseContent.headers['content-length'];
			var remaining = size - req.responseContent.client.bytesRead;
			var percentage = Math.round(100 - ((100/size) * remaining));
			downloading(size, Math.max(0, remaining), percentage);
		}
    }, 250);
    
    //Request
	var req = request({
		method: method,
		uri: url.resolve(hostname, func + '/?' + query.stringify(params)),
	}, function (error, response, body) {
		
		//Clear progress
		clearInterval(upload_progress);
		clearInterval(download_progress);
		
		//Check Error
		if(error){
			if (error.code == 'ENOTFOUND'){
				return callback(false, 'Could not find server, please check your internet connection', {});
			}else if (error.code == 'ECONNREFUSED'){
				return callback(false, 'Could not connect to server, please contact administrator', {});
			}else{
				return callback(false, error.toString(), {});
			}
		}else{
		
			//Check if stream
			if (!response.headers.hasOwnProperty('content-disposition')){

				//Response
				try{
					body = JSON.parse(body);
					return callback(body.success, body.message, body.output);
				}catch (error){
					return callback(false, 'Invalid JSON response', {});
				}
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
	if (exports.https){
		var hostname = 'https://' + exports.https + '/';
	}else if (exports.http){
		var hostname = 'http://' + exports.http + '/';
	}else{
		return callback(false, 'Could not find HTTP or HTTPS hostname', {});
	}
	
	//Upload progress
    var upload_progress = setInterval(function(){
	   	if (uploading && !req.hasOwnProperty('responseContent')){
	   	
	   		//Callback
			var size = req.req.connection._httpMessage._headers['content-length'];
			var remaining = size - req.req.connection._bytesDispatched;
			var percentage = Math.round(100 - ((100/size) * remaining));
			uploading(size, Math.max(0, remaining), percentage);
		}
    }, 250);
    
    //Download progress
    var download_progress = setInterval(function(){
    	if (downloading && req.hasOwnProperty('responseContent')){
    	
	   		//Callback
			var size = req.responseContent.headers['content-length'];
			var remaining = size - req.responseContent.client.bytesRead;
			var percentage = Math.round(100 - ((100/size) * remaining));
			downloading(size, Math.max(0, remaining), percentage);
		}
    }, 250);
    
    //Request
	var req = request({
		method: "POST",
		uri: url.resolve(hostname,func),
		formData: params
	}, function (error, response, body) {
		
		//Clear progress
		clearInterval(upload_progress);
		clearInterval(download_progress);
		
		//Check Error
		if(error){
			if (error.code == 'ENOTFOUND'){
				return callback(false, 'Could not find server, please check your internet connection', {});
			}else if (error.code == 'ECONNREFUSED'){
				return callback(false, 'Could not connect to server, please contact administrator', {});
			}else{
				return callback(false, error.toString(), {});
			}
		}else{
		
			//Check if stream
			if (!response.headers.hasOwnProperty('content-disposition')){

				//Response
				try{
					body = JSON.parse(body);
					return callback(body.success, body.message, body.output);
				}catch (error){
					return callback(false, 'Invalid JSON response', {});
				}
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
	if (exports.tcp){
		var hostname = 'tcp://' + exports.tcp + '/';
	}else{
		return callback(false, 'Could not find TCP hostname', {});
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
	if (exports.udp){
		var hostname = 'udp://' + exports.udp + '/';
	}else{
		return callback(false, 'Could not find UDP hostname', {});
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
exports.name = function(name, callback, uploading, stream, downloading){
	
	//Parameters
	var params = {};
	if (email != null){ 
		if (typeof file == "object"){
			params["email"] = email;
		}else{
			params["email"] = email.toString();
		}
	}
	
	//Execute
	exports.sendRequest('name', [ "METHOD" ], params, callback, uploading, stream, downloading);
}
*/
<functions>