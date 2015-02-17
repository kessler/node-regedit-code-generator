var xray = require('x-ray')
var argv = require('minimist')(process.argv.slice(2))

xray(argv.url || 'https://msdn.microsoft.com/en-us/library/aa393664(v=vs.85).aspx')
	.select(['table#memberListMethods a[href]'])
	.run(function(err, result) {
		if (err) return console.error(err)

		console.log(JSON.stringify(result))
	})
