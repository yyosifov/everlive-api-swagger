var express = require('express');
var app = express();
var fs = require('fs');
var request = require('superagent');
var async = require('async');
var _ = require('lodash');
var swaggerFormatter = require('./app/swagger-formatter');

var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;  
var ip = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";

app.use(express.static(__dirname + '/app'));

app.get('/spec', function(req, res) {
	/*
	fs.readFile('app/sample.swagger.json', 'utf8', function(err, data) {
		if(err) throw err;

		res.json(JSON.parse(data));
	});
*/
res.json("{}");
});

app.get('/spec/:masterKey/:apiKey', function(req, res) {
	var baseUrl = 'http://api.everlive.com/v1/Metadata/Applications/';
	var apiKey = req.params.apiKey,
		masterKey = req.params.masterKey,
		authorization = 'Masterkey ' + masterKey;

		//console.log('starting');
	async.waterfall([
		function loadTypes(callback) {
				request
				.get(baseUrl + apiKey + '/Types')
				.set('Authorization', authorization)
				.set('Accept', 'application/json')
				.end(function(err, typesResponse) {
					if(err) {
						return res.send(err);
					}
					//console.log('loaded types');
					callback(null, typesResponse.body.Result);
				});
			},
			function loadFields(types, callback) {
				var fullTypes = [];
				//console.log('loading fields');
				async.each(types, function(type, cb) {
					var clonedType = _.cloneDeep(type);

					request
						.get(baseUrl + apiKey + '/Types/' + type.Id + '/Fields')
						.set('Authorization', authorization)
						.set('Accept', 'application/json')
						.end(function(err, fieldsResponse) {
							if(err) return cb(err);

							clonedType.fields = fieldsResponse.body.Result;

							fullTypes.push(clonedType);
							cb();
						});
					}, function(err) {
						if(err) return callback(err);

						callback(null, fullTypes);
					});
			}, function formatSwagger(types, callback) {
				var swaggerFormat = swaggerFormatter.format(types, apiKey);
				callback(null, swaggerFormat);
			}
	], function(err, swaggerFormat) {
		if(err) return res.status(400).send(err);

		res.json(swaggerFormat);
	});
});

app.listen(port, ip, function() {
  console.log("Node server running at http://" + ip + ":" + port);
});
