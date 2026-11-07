"""
End-to-end tests for Glitzo's Little Lab web application.
Verifies all 4 features:
1. BOOP! button reaction and happy expressions
2. Wave Hello button and tentacle animation
3. One Green Square button and OTERCEL progress tracking
4. Celebration when 3 green squares are completed
"""
import os
import sys
from playwright.sync_api import sync_playwright, expect

def test_glitzo_lab():
    html_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "index.html"))
    file_url = f"file://{html_path}"

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 900})
        page = context.new_page()

        print("Navigating to Glitzo's Lab:", file_url)
        page.goto(file_url)

        # 1. Check title & headers
        expect(page.locator(".lab-title")).to_contain_text("Glitzo's Little Lab")
        expect(page.locator(".motto-box")).to_contain_text("Eight arms. One green square at a time.")

        # 2. Test initial OTERCEL count
        count_badge = page.locator("#otercel-count")
        expect(count_badge).to_have_text("0 / 3 COMPLETED")

        # 3. Test Feature 1: "BOOP!" button
        boop_btn = page.locator("#btn-boop")
        expect(boop_btn).to_be_visible()
        boop_btn.click()
        page.wait_for_timeout(200)

        glitzo_svg = page.locator("#glitzo-svg")
        expect(glitzo_svg).to_have_class("glitzo-svg booped")
        speech_bubble = page.locator("#speech-bubble")
        expect(speech_bubble).to_be_visible()
        mood_val = page.locator("#mood-val")
        expect(mood_val).to_have_text("BOOPED_OVERJOYED")
        print("✓ Feature 1 (BOOP!) verified successfully.")

        # 4. Test Feature 2: "Wave Hello" button
        wave_btn = page.locator("#btn-wave")
        expect(wave_btn).to_be_visible()
        wave_btn.click()
        page.wait_for_timeout(200)

        waving_arm = page.locator("#waving-tentacle")
        expect(waving_arm).to_have_class("tentacle-group t-waving waving-arm-active")
        expect(mood_val).to_have_text("FRIENDLY_GREETING")
        # Check that speech bubble is visible and has greeting content
        expect(speech_bubble).to_be_visible()
        bubble_text = speech_bubble.inner_text()
        assert len(bubble_text.strip()) > 0
        print("✓ Feature 2 (Wave Hello) verified successfully.")

        # 5. Test Feature 3: "One Green Square" button (step 1 and step 2)
        square_btn = page.locator("#btn-square")
        expect(square_btn).to_be_visible()

        # Step 1
        square_btn.click()
        page.wait_for_timeout(200)
        expect(count_badge).to_have_text("1 / 3 COMPLETED")
        slot_1 = page.locator('.square-slot[data-index="1"]')
        expect(slot_1).to_have_class("square-slot filled")

        # Step 2
        square_btn.click()
        page.wait_for_timeout(200)
        expect(count_badge).to_have_text("2 / 3 COMPLETED")
        slot_2 = page.locator('.square-slot[data-index="2"]')
        expect(slot_2).to_have_class("square-slot filled")
        print("✓ Feature 3 (One Green Square increments) verified successfully.")

        # 6. Test Feature 4: 3rd square triggers Celebration
        square_btn.click()
        page.wait_for_timeout(500)
        expect(count_badge).to_have_text("3 / 3 COMPLETED")
        slot_3 = page.locator('.square-slot[data-index="3"]')
        expect(slot_3).to_have_class("square-slot filled")

        celebration_overlay = page.locator("#celebration-overlay")
        expect(celebration_overlay).to_have_class("celebration-overlay active")
        celebration_title = page.locator(".celebration-title")
        expect(celebration_title).to_have_text("OTERCEL COMPLETED!")
        expect(glitzo_svg).to_have_class("glitzo-svg celebrating")
        print("✓ Feature 4 (3 Squares Celebration) verified successfully.")

        # 7. Test Reset Lab functionality
        reset_btn = page.locator("#btn-celebrate-reset")
        reset_btn.click()
        page.wait_for_timeout(200)
        expect(count_badge).to_have_text("0 / 3 COMPLETED")
        expect(slot_1).not_to_have_class("filled")
        expect(celebration_overlay).not_to_have_class("active")
        print("✓ Reset functionality verified successfully.")

        browser.close()
        print("All Glitzo Lab automated tests passed with flying colors! 🐙🎉")

if __name__ == "__main__":
    test_glitzo_lab()
