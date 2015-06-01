# Dingle NodeJS
NodeJS Generator for [Dingle](https://github.com/Vmlweb/Dingle)

## Installation

```bash
$ npm install --save dingle-nodejs
```

## Dependancies

You will need the following module in your project:

  * [Request](https://github.com/request/request)
  
```javascript
npm install --save request
```

## Usage

Simply require the dingle generator module and specify the directory to build into:

```javascript
var dingle = require('dingle')({
    http_listen: '0.0.0.0',
    https_listen: '0.0.0.0',
    tcp_listen: '0.0.0.0',
    udp_listen: '0.0.0.0'
});

var generator = require('dingle-nodejs');
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

## Hostnames

When the code is generated your hostnames are automatically taken from the dingle config but you can change it like so:

```javascript
var myapi = require('./MYAPI.js');

myapi.http = "localhost:7691";
myapi.https = "localhost:7691";
myapi.tcp = "localhost:7693";
myapi.udp = "localhost:7694";

myapi.login('admin@myawesomeapi.com', 'mypassword', function(success, message, output){
	console.log(succes;
	console.log(message);
	console.log(output);
});
```
 
## File Uploads

To upload a file simply specify a read stream as a parameter as shown below:

```javascript
var fs = require('fs');
var myapi = require('./MYAPI.js');

myapi.upload_file('admin@myawesomeapi.com', fs.createReadStream("./myawesomefile.png"), function(success, message, output){
	console.log(success);
	console.log(message);
	console.log(output);
}, function (size, remaining, progress){
	console.log('Upload at ' + progress + '%');
}); 
```
 
## File Downloads

When downloading a file you must specify a stream to write to and once the download is complete the stream will be returned in the output variable callback:

```javascript
var fs = require('fs');
var myapi = require('./MYAPI.js');

myapi.download_file('admin@myawesomeapi.com', 'mypassword', function(success, message, output){
	console.log(success);
	console.log(message);
	console.log(output);
}, function (size, remaining, progress){
	console.log('Upload at ' + progress + '%');
}, function (size, remaining, progress){
	console.log('Download at ' + progress + '%');
}, fs.createWriteStream('./myawesomefile.mov'));
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