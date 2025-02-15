import { NextResponse } from "next/server";
import puppeteer, { Browser, Page } from "puppeteer";

// Define the type for the scraped data
type ScrapedData = {
  title: string;
  headings: string[];
};

// Define the type for the error response
type ErrorResponse = {
  error: string;
};

// Define the GET handler
export async function GET(): Promise<
  NextResponse<ScrapedData | ErrorResponse>
> {
  // URL to scrape (you can also pass this as a query parameter)
  const url = "https://cactusia.ma";

  let browser: Browser | null = null;

  try {
    // Launch Puppeteer
    browser = await puppeteer.launch({
      headless: true, // Run in headless mode (no browser UI)
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // Required for some environments
    });

    // Open a new page
    const page: Page = await browser.newPage();

    // Navigate to the URL
    await page.goto(url, { waitUntil: "networkidle2" });

    // Scrape data (example: scrape the page title)
    const title: string = await page.title();

    // Scrape more data (example: scrape all the text inside <h1> tags)
    const headings: string[] = await page.$$eval("h1", (elements) =>
      elements.map((el) => el.textContent?.trim() ?? ""),
    );

    // Close the browser
    await browser.close();

    // Return the scraped data as JSON
    return NextResponse.json({ title, headings }, { status: 200 });
  } catch (error) {
    console.error("Error during scraping:", error);

    // Close the browser if it was opened
    if (browser) {
      await browser.close();
    }

    // Return an error response
    return NextResponse.json(
      { error: "Failed to scrape the website" },
      { status: 500 },
    );
  }
}

// Export the GET handler as the default export
export default GET;
