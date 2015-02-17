var xray = require('x-ray')
var argv = require('minimist')(process.argv.slice(2))

var IN_MARKER = '[in'
var OUT_MARKER = '[out'

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
		parameters: ['h2:contains(Parameters) + dl > dt'],
		descriptions: ['h2:contains(Parameters) + dl > dd'],
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
			var description = result.descriptions[i] || ''			
			var parameterName = parameter.substring(0, parameter.indexOf(' '))

			if (parameter.indexOf(IN_MARKER) > -1 || description.indexOf(IN_MARKER) > -1) {
				result.inParameters.push(parameterName)
			} else if (parameter.indexOf(OUT_MARKER) > -1 || description.indexOf(OUT_MARKER) > -1) {
				result.outParameters.push(parameterName)
			} else {
				console.error('warning: parameter %s is not marked as [in] or [out] assuming [in] in %s', parameterName, argv.url)
				result.inParameters.push(parameterName)
			}
		}

		// here comes the ifs. this is due to an error in msdn docs marked uValue as an in param when in fact its an out param
		// I'll try to code this so if and when they fix it, it will go unnoticed...
		if (result.functionName === 'GetQWORDValue' && result.outParameters.length === 0) {
			var index = result.inParameters.indexOf('uValue')
			// remove from in params and put where it belongs!
			if (index > -1) {
				result.inParameters.splice(index, 1)
				result.outParameters.push('uValue')
			}
		}

		console.log(JSON.stringify(result))
	})
