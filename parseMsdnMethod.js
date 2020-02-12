const scraper = require('./scraper')
const argv = require('minimist')(process.argv.slice(2))

async function main() {
	const { url } = argv
	if (!url) {
		throw new Error('must run with --url')
	}

	const { shutdown, page, browser } = await scraper.launch({ url })

	try {

		await page.waitForSelector('code.lang-mof')
		const fnElement = await page.$('code.lang-mof')
		const text = await page.evaluate(element => element.textContent, fnElement)

		const lines = text.split('\n')

		let [returnType, functionName] = lines[0].split(' ')
		functionName = functionName.slice(0, -1)

		const inParameters = []
		const outParameters = []

		const params = lines
			.slice(1, lines.indexOf(');'))
			.forEach(param => {
				param = param.trim()
				param = param.replace(/[\s]{2,}/g, ' ')
				let [direction, type, name, ...rest] = param.split(' ')
				name = name.replace(/,$/, '')
				name = name.replace(/\[\]$/, '')

				// let [_, defaultValue] = rest
				// if (defaultValue) {
				// 	defaultValue = defaultValue.replace(/,$/, '')
				// }
				if (direction === '[in]') {
					inParameters.push(name)
				} else if (direction === '[out]') {
					outParameters.push(name)
				} else {
					console.error('warning: parameter %s is not marked as [in] or [out] assuming [in] in %s', name, url)
					inParameters.push(name)
				}
			})

			console.log(JSON.stringify({
				inParameters,
				outParameters,
				functionName,
				returnType
			}))

	} finally {
		shutdown()
	}
}

main()