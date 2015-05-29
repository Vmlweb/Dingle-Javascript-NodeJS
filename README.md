# Dingle Swift Alamofire
Swift Alamofire Generator for [Dingle](https://github.com/Vmlweb/Dingle)

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
	console.log(success);
	console.log(message);
	console.log(output);
});
```
 
## File Uploads

To upload a file simply specify a read speed as a parameter like so:

Then simply drop the files generated into your node project and use like so:

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

Coming Soon...

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