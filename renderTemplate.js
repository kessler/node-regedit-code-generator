var argv = require('minimist')(process.argv.slice(2))
var _ = require('lodash')
var fs = require('fs')

var template = fs.readFileSync(argv.template)
var stdin = process.stdin

var json = ''

// consume all incoming data first
function read() {
	var line
	while(line = stdin.read()) {
		json += line.toString('utf8')
	}

	stdin.once('readable', read)
}

stdin.once('readable', read)
stdin.once('end', function () {
	json = JSON.parse(json)
	console.log(_.template(template)(json))
})
