var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var val = require('validator');
var replace = require("replaceall");

//Generate
exports.generate = function(dingle, directory){
	directory = path.join(process.cwd(), directory);
	
	//Hostname
	var hostnames = '';
	if (dingle.config.https.listen != '' && dingle.config.https.hostname != ''){
		hostnames += 'exports.https = "' + dingle.config.https.hostname + ':' + dingle.config.https.port + '";\n';
	}
	if (dingle.config.http.listen != '' && dingle.config.http.hostname != '' ){
		hostnames += 'exports.http = "' + dingle.config.http.hostname + ':' + dingle.config.http.port + '";\n';
	}
	if (dingle.config.tcp.listen != '' && dingle.config.tcp.hostname != '' ){
		hostnames += 'exports.tcp = "' + dingle.config.tcp.hostname + ':' + dingle.config.tcp.port + '";\n';
	}
	if (dingle.config.udp.listen != '' && dingle.config.udp.hostname != '' ){
		hostnames += 'exports.udp = "' + dingle.config.udp.hostname + ':' + dingle.config.udp.port + '";\n';
	}
	
	//Generate
	var functions = '';
	for (func in dingle.functions){
		functions += generate(dingle.functions[func]) + '';
	}
	
	//Make
	var filename = path.join(directory, dingle.config.app.prefix + '.js');
	var contents = fs.readFileSync(path.join(__dirname + '/request.js')).toString();
	contents = replace("<hostnames>", hostnames, contents);
	contents = replace("<functions>", functions, contents);
	
	//Write file
	mkdirp(path.dirname(filename), function (error) {
		if (error){
			throw error;
		}else{
			fs.writeFile(filename, contents, function(error){
				if (error){
					throw error;
				}else{
					return;
				}
			});
		}
	});
}

//Each Call
function generate(func){
	
	//Parameters
	var param_keys = [];
	for(var key in func.params) { param_keys.push(key); }
	
	//Parameters
	var method_values = [];
	for(var key in func.methods) { method_values.push(func.methods[key]); }
	
	//Generate
	var str = '//Request\n';
	str += 'exports.' + func.name + ' = function(' + param_keys.join(', ') + ', callback, uploading, stream, downloading){\n';
	str += '\n';
	str += '	//Parameters\n';
	str += '	var params = {};\n';
	for (param in func.params){
		str += '	if (' + param + ' != null){ \n';
		str += '		if (typeof file == "object"){\n';
		str += '			params["' + param + '"] = ' + param + ';\n';
		str += '		}else{\n';
		str += '			params["' + param + '"] = ' + param + '.toString();\n';
		str += '		}\n';
		str += '	}\n';
	}
	str += '	\n';
	str += '	//Execute\n';
	str += '	exports.sendRequest("' + func.name + '", [ "' + method_values.join('", "') + '" ], params, callback, uploading, stream, downloading);\n';
	str += '}\n';
	return str;
}