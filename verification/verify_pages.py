from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()

        # Inject local storage to bypass disclaimer
        page = context.new_page()
        page.goto("http://localhost:3000")
        page.evaluate("localStorage.setItem('fiberglass_disclaimer_accepted', 'true')")
        page.reload()

        # Wait for content
        page.wait_for_selector("main")
        time.sleep(2)

        # Screenshot Home
        page.screenshot(path="verification/home.png")
        print("Home screenshot taken")

        # Navigate to AI Assistant
        page.goto("http://localhost:3000/#/assistant")
        time.sleep(2)
        page.screenshot(path="verification/assistant.png")
        print("Assistant screenshot taken")

        # Navigate to Mattress Checker
        page.goto("http://localhost:3000/#/checker")
        time.sleep(2)
        page.screenshot(path="verification/checker.png")
        print("Checker screenshot taken")

        # Navigate to Cleanup Guide
        page.goto("http://localhost:3000/#/cleanup")
        time.sleep(2)
        page.screenshot(path="verification/cleanup.png")
        print("Cleanup screenshot taken")

        browser.close()

if __name__ == "__main__":
    run()
