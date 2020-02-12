const scraper = require('./scraper')
const REGISTRY_API_URL = 'https://docs.microsoft.com/en-us/previous-versions/windows/desktop/regprov/stdregprov'

async function main() {
	const { shutdown, page, browser } = await scraper.launch({ url: REGISTRY_API_URL })
	
	try {	
		await page.waitForSelector('table.table')
		const elementHandles = await page.$$('table.table a')
		const propertyJsHandles = await Promise.all(
			elementHandles.map(handle => handle.getProperty('href'))
		)
		const urls = await Promise.all(
			propertyJsHandles.map(handle => handle.jsonValue())
		)

		console.log(JSON.stringify(urls))
	} finally {
		shutdown()
	}
}

main()
