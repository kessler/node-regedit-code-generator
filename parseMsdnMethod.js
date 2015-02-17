var xray = require('x-ray')
var argv = require('minimist')(process.argv.slice(2))

xray(argv.url)
	.prepare('functionSignatureFormat', function(str) {
		if (str) {
			str = str.replace(/[\n\t\s]+/g, ' ') // replace all newlines, tabs and spaces with a single space			
			str = str.substring(0, str.indexOf(')') + 1) // cut until the closing bracer
			return str.trim()
		}
	})
	.select({
		$root: 'div#mainSection',
		functionSignature: 'pre | functionSignatureFormat',
		parameters: ['h2:contains(Parameters) + dl > dt']
	})
	.run(function(err, result) {
		if (err) return console.error(err)

		var functionSignature = result.functionSignature

		var returnTypeEnd = functionSignature.indexOf(' ')

		result.returnType = functionSignature.substring(0, returnTypeEnd)
		result.returnType = result.returnType.trim()

		result.functionName = functionSignature.substring(returnTypeEnd + 1, functionSignature.indexOf('('))
		result.functionName = result.functionName.trim()

		result.inParameters = []
		result.outParameters = []

		for (var i = 0; i < result.parameters.length; i++) {
			var parameter = result.parameters[i]
			var parameterName = parameter.substring(0, parameter.indexOf(' '))

			if (parameter.indexOf('[in') > -1) {
				result.inParameters.push(parameterName)
			} else if (parameter.indexOf('[out')) {
				result.outParameters.push(parameterName)
			} else {
				throw new Error('invalid parameter, neither in or out: ' + parameter)
			}
		}

		console.log(JSON.stringify(result))
	})
