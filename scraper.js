const puppeteer = require('puppeteer')

const REGISTRY_API_URL = 'https://docs.microsoft.com/en-us/previous-versions/windows/desktop/regprov/stdregprov'
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36'

module.exports.launch = async ({
	userAgent = USER_AGENT,
	headless = true,
	url,
	silent = true
}) => {

	const browser = await launch(headless, userAgent)
	const page = await browser.newPage()

	await page.goto(url)

	if (!silent) {
		browser.on('targetcreated', async (target) => {
			console.log('TARGET CREATED')
			console.log('target type:', target.type())
			console.log('target url:', target.url())
		})

		browser.on('targetchanged', async (target) => {
			console.log('TARGET changed')
			console.log('target type:', target.type())
			console.log('target url:', target.url())
		})

		page.on('console', msg => console.log(`PAGE console: ${msg.text()}`))
		page.on('pageerror', err => console.log(`PAGE error: ${err.toString()}`))
	}

	process.on('SIGINT', shutdown)

	return { page, shutdown, browser }
	
	async function shutdown() {
		if (browser) {
			await browser.close()
		}
	}
}

async function launch(headless, userAgent) {
	return await puppeteer.launch({
		headless,
		args: [
			`--user-agent=${userAgent}`
		]
	})
}

function sleep(ms = 0) {
	return new Promise(r => setTimeout(r, ms))
}