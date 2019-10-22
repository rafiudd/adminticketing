var express = require('express')
var app = express()
var http = require('http');
var url = require('url');
var fs = require('fs');
var axios = require('axios');
var ObjectId = require('mongodb').ObjectId
app.get('/', function(req, res, next) {
	// fetch and sort users collection by id in descending order
    axios.get('http://35.172.178.112:4000/me').then(response => {
    	// console.log("anjing2",response.data);
    	var getData = response.data.data;
    	// var get;
    	// console.log(response.data.data.length);
    	// function getAll() {
	    // 	for (var i = 0; i<getData.length; i++) {
	    // 		var get = getData;
	    // 		// console.log(get)
	    // 		return get;
	    // 	}	
    	// }
    	
    	// console.log('testget',getData);
    	res.render('laporan/all', {
    		data : getData
    	})
    	// console.log(judul)
    	
    	return response;
    })
})

module.exports = app;