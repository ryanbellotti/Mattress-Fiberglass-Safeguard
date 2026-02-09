from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Set local storage
    page.goto("http://localhost:3000/")
    page.evaluate("localStorage.setItem('fiberglass_disclaimer_accepted', 'true')")
    page.reload()

    # Navigate to Organization Resources
    print("Navigating to Organization Resources...")
    page.goto("http://localhost:3000/#/org-resources")

    # Wait for heading
    print("Waiting for 'Official Repository' heading...")
    page.wait_for_selector("text=Official Repository", timeout=10000)

    # Verify link
    link = page.locator("text=Open in new tab")
    if link.is_visible():
        print("Fallback link verified.")
    else:
        print("Fallback link NOT verified.")
        exit(1)

    # Screenshot
    page.screenshot(path="verification/org_resources.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
