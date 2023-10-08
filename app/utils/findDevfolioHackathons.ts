import puppeteer, { Page } from 'puppeteer';

async function autoScroll(page: Page) {
	await page.evaluate(async () => {
		await new Promise<void>((resolve, reject) => {
			let totalHeight = 0;
			const distance = 100;
			const timer = setInterval(() => {
				const scrollHeight = document.body.scrollHeight;
				window.scrollBy(0, distance);
				totalHeight += distance;

				if (totalHeight >= scrollHeight) {
					clearInterval(timer);
					resolve();
				}
			}, 100);
		});
	});
}

export const findDevfolioHackathons = async () => {
	// Launch a headless Chromium browser
	const browser = await puppeteer.launch();

	// Create a new page
	const page = await browser.newPage();

	// Navigate to a website
	await page.goto('https://devfolio.co/hackathons/open');

	// Do the actual shit here
	// Wait for the page to load and the elements to be available (adjust as needed)
	await page.waitForSelector('.Link__LinkBase-sc-af40de1d-0.lkflLS');

	// Scroll down to the end of the page
	await autoScroll(page);

	// Extract all <a> elements with the specified class name
	const links = await page.$$eval(
		'.Link__LinkBase-sc-af40de1d-0.lkflLS',
		(elements) => {
			return elements.map((element) => {
				return {
					text: element.textContent,
					href: element.getAttribute('href'),
				};
			});
		}
	);

	// Loop through each link and visit the page
	const hackathonsInfo = [];
	for (const link of links) {
		const newPage = await browser.newPage();
		await newPage.goto(link.href!);

		// Wait for all elements with the class name "sc-tQuYZ OgIvI" to be available
		await newPage.waitForSelector('.sc-tQuYZ.OgIvI');

		// Extract all elements with the class name "sc-tQuYZ OgIvI"
		const elements = await newPage.$$eval('.sc-tQuYZ.OgIvI', (elements) => {
			return elements.map((element) => element.textContent);
		});
		elements.unshift(link.text);
		elements.push(link.href);
		hackathonsInfo.push(elements);

		// Close the new page
		await newPage.close();
	}

	// Close the browser
	await browser.close();

	return hackathonsInfo;
};
