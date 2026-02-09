from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()

    # Initialize page
    page = context.new_page()

    # Set local storage to bypass disclaimer
    page.goto("http://localhost:3000/")
    page.evaluate("localStorage.setItem('fiberglass_disclaimer_accepted', 'true')")

    # Reload to apply
    page.reload()

    # Navigate to Education Hub
    print("Navigating to Education Hub...")
    page.goto("http://localhost:3000/#/hub")

    # Wait for the heading to appear
    print("Waiting for 'Education Nexus' heading...")
    page.wait_for_selector("text=Education Nexus", timeout=10000)

    # Verify content
    heading = page.locator("text=Education Nexus")
    if heading.is_visible():
        print("Education Hub verified.")
    else:
        print("Education Hub NOT verified.")
        exit(1)

    # Take screenshot of Education Hub
    page.screenshot(path="verification/education_hub.png")

    # Navigate to Report Incident
    print("Navigating to Incident Registry...")
    page.goto("http://localhost:3000/#/report")

    # Wait for heading
    print("Waiting for 'Incident Registry' heading...")
    page.wait_for_selector("text=Incident Registry", timeout=10000)

    # Verify content
    heading = page.locator("text=Incident Registry")
    if heading.is_visible():
        print("Incident Registry verified.")
    else:
        print("Incident Registry NOT verified.")
        exit(1)

    # Take screenshot of Report Incident
    page.screenshot(path="verification/report_incident.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
