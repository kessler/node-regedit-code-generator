const cp = require('child_process')
const { promisify } = require('util')
const exec = promisify(cp.exec)
const map = require('@kessler/async-map-limit')

async function main() {
	console.error('loading method urls from msdn')
	const { stdout, stderr } = await exec('node parseMsdnMethodUrls.js')

	const urls = JSON.parse(stdout)
	console.error(`found ${urls.length} methods`)
	const result = await map(urls, executeOne, 2)
	console.log(result.join('\n'))
}

main()

function commandTemplate(url) {
	return `node parseMsdnMethod.js --url="${url}" | node renderTemplate.js --template=vbMethodTemplate`
}

async function executeOne(url) {
	const { stdout, stderr } = await exec(commandTemplate(url))
	console.error(`done with ${url}`)
	return stdout
}
