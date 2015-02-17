var _ = require('lodash')
var async = require('async')
var child = require('child_process')

run('node parseMsdnMethodUrls.js > urls.json')(function(err) {
	if (err) {
		console.error(err)
		return process.exit(1)
	}

	var urls = require('./urls.json')

	var commandTemplate = _.template('node parseMsdnMethod.js --url="${url}" | node renderTemplate.js --template=vbMethodTemplate')

	var work = []

	for (var i = 0; i < urls.length; i++) {
		var context = { url: urls[i] }
		work.push(run(commandTemplate(context)))
	}

	async.parallel(work, function(err, results) {
		if (err) {
			console.error(err)
			return process.exit(1)
		}

		for (var z = 0; z < results.length; z++) {
			console.log(results[z][0])
			if (results[z][1])
				console.error(results[z][1])
		}
	})


})

function run(cmd) {
	console.error(cmd)
	return function (callback) {		
		child.exec(cmd, callback)
	}
}
