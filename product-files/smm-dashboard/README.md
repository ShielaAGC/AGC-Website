# SMM Dashboard: product files

What buyers receive after purchasing the ₱149 template.

| File | What it is |
| --- | --- |
| `how-to-use.pdf` | The 10-page How-to-Use guide sent to buyers |
| `how-to-use.html` | Source for the PDF. Edit this, then rebuild. |
| `build-pdf.mjs` | Builds the PDF with Playwright + Chromium |

## Rebuild the PDF

```sh
npm i -D playwright        # once
TEMPLATE_URL="https://nine-wok-abe.notion.site/SMM-Dashboard-3f0edf4e3e698174b24ed6ed03940d88" node build-pdf.mjs
```

`TEMPLATE_URL` is optional. When it's set, the guide gets a clickable "Duplicate the template" button. When it's not, the guide points buyers to the link in their purchase email.

## Delivery checklist

1. In Notion, open **✨ SMM Dashboard** → Share → Publish → turn on **Allow duplicate as template**. Copy the link.
2. In your checkout tool (Stripe, Gumroad, Lemon Squeezy…), create a ₱149 product. Attach `how-to-use.pdf` and put the Notion template link in the delivery email.
3. Paste the checkout link into `CHECKOUT_URL` in `products/smm-dashboard/index.html`.

Keep this folder out of any public deploy: it's the paid deliverable. The landing page lives in `products/smm-dashboard/`.

## Put the landing page on WordPress

### Option A: theme template file (recommended)

`products/smm-dashboard/page-smm-dashboard.php` is a page template that uses your theme's header and footer.

1. Open `page-smm-dashboard.php` and paste your checkout link into `define( 'SMM_CHECKOUT_URL', '' );`.
2. Upload it to your theme folder, `wp-content/themes/<your-theme>/`, using your host's File Manager, FTP, or **Appearance → Theme File Editor**. Use a child theme if you have one, or a theme update will delete the file.
3. Create a page titled "SMM Dashboard" with the slug `smm-dashboard` and publish it. WordPress uses the template automatically because of the slug. You can also pick "SMM Dashboard Landing Page" from the page's **Template** dropdown.

Block themes (Twenty Twenty-Four, Twenty Twenty-Five, etc.) ignore PHP page templates, so on those use Option B.

### Option B: Custom HTML block

`products/smm-dashboard/wordpress-block.html` is the landing page as one snippet for a **Custom HTML** block. Its styles are scoped so they won't clash with your theme, and it has no header of its own because your theme supplies one.

1. In WordPress go to **Pages → Add New**. Title it "SMM Dashboard" and set the URL slug to `smm-dashboard`.
2. In the page settings sidebar, set **Template** to a full-width or blank option (often called "Full Width", "No Sidebar", "Blank" or "Canvas"). Hide the page title if your theme allows it.
3. Click **+** → search **Custom HTML** → add the block.
4. Open `wordpress-block.html`, copy everything, and paste it into the block.
5. Paste your checkout link between the quotes in `const CHECKOUT_URL = "";` near the bottom of the snippet.
6. Click **Preview**, then **Publish**. The page will be at `yoursite.com/smm-dashboard/`.

Notes:
- You need an Administrator account. WordPress strips the `<script>` part for other roles, which stops the buy buttons from linking to checkout.
- If you use Elementor, add an **HTML** widget to a page set to "Elementor Full Width" or "Elementor Canvas" and paste the snippet there instead.
- After editing `index.html`, run `python3 build-wordpress.py` in `products/smm-dashboard/` to regenerate both the snippet and the PHP template.
