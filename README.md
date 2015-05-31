# Dingle Javascript NodeJS
Javascript NodeJS Generator for [Dingle](https://github.com/Vmlweb/Dingle)

## Installation

```bash
$ npm install --save dingle-javascript-nodejs
```

## Dependancies

You will need the following modules in your project:

  * [Request](https://github.com/request/request)

## Usage

Simply require the dingle generator module and specify the directory to build into:

```javascript
var dingle = require('dingle')({
    http_listen: '0.0.0.0',
    https_listen: '0.0.0.0',
    tcp_listen: '0.0.0.0',
    udp_listen: '0.0.0.0'
});

var generator = require('dingle-javascript-nodejs');
generator.generate(dingle, './exports/nodejs');
```

Then simply drop the files generated into your node project and use like so:

```javascript
var myapi = require('./MYAPI.js');

myapi.login('admin@myawesomeapi.com', 'mypassword', function(success, message, output){
	console.log(succes;
	console.log(message);
	console.log(output);
});
```

When the code is generated your hostnames are automatically taken from the dingle config but you can change it like so:

```javascript
var myapi = require('./MYAPI.js');

myapi.hostnames["HTTP"] = "http://localhost:7691";
myapi.hostnames["HTTPS"] = "https://localhost:7691";
myapi.hostnames["TCP"] = "tcp://localhost:7693";
myapi.hostnames["UDP"] = "udp://localhost:7694";

myapi.login('admin@myawesomeapi.com', 'mypassword', function(success, message, output){
	console.log(succes;
	console.log(message);
	console.log(output);
});
```
 
## File Uploads

To upload a file simply specify a read stream as a parameter like so:

```javascript
var fs = require('fs');
var myapi = require('./MYAPI.js');

myapi.upload_file('admin@myawesomeapi.com', fs.createReadStream("./myawesomefile.png"), function(success, message, output){
	console.log(success);
	console.log(message);
	console.log(output);
}); 
```
 
## File Downloads

When downloading a file the data is returned via the output variable as a buffer and can be written to file:

```javascript
var fs = require('fs');
var myapi = require('./MYAPI.js');

myapi.upload_file('admin@myawesomeapi.com', fs.createReadStream("./myawesomefile.png"), function(success, message, output){
	
	//Check download and write to file
	if (Buffer.isBuffer(output)){
		fs.writeFile('./myawesomefile.png', output);
	}
}); 
```

## Methods

The following methods are supported:

  * TCP
  * UDP
  * POST
  * GET
  * PUT
  * DELETE
  * OPTIONS
  * HEAD
  * PATCH
  * TRACE
  * CONNECT