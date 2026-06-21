from playwright.sync_api import sync_playwright, expect
import sys, json

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto('http://localhost:5173', wait_until='networkidle')
        # Wait for the background layer to have a non-empty background-image
        bg_layer = page.locator('.bg-layer.visible')
        # Wait for CSS to be applied (timeout 5s)
        try:
            bg_layer.wait_for(state='attached', timeout=5000)
        except Exception as e:
            print('Background layer not found', e)
            browser.close()
            sys.exit(1)
        # Get the computed background-image value
        bg_style = page.evaluate("""
            (el) => getComputedStyle(el).backgroundImage
        """, bg_layer.element_handle())
        print('Background image CSS:', bg_style)
        # Extract URL
        import re
        match = re.search(r"url\\(['\"]?(.*?)['\"]?\\)", bg_style)
        if match:
            url = match.group(1)
            print('Extracted URL:', url)
        else:
            print('No URL found')
        browser.close()

if __name__ == '__main__':
    main()
