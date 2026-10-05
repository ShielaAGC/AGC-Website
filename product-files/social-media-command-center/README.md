# Social Media Command Center: product files

What buyers receive after purchasing the $149 template.

| File | What it is |
| --- | --- |
| `how-to-use.pdf` | The 10-page How-to-Use guide sent to buyers |
| `how-to-use.html` | Source for the PDF. Edit this, then rebuild. |
| `build-pdf.mjs` | Builds the PDF with Playwright + Chromium |

## Rebuild the PDF

```sh
npm i -D playwright        # once
TEMPLATE_URL="https://<your-published-notion-template-link>" node build-pdf.mjs
```

`TEMPLATE_URL` is optional. When it's set, the guide gets a clickable "Duplicate the template" button. When it's not, the guide points buyers to the link in their purchase email.

## Delivery checklist

1. In Notion, open **✨ Social Media Command Center** → Share → Publish → turn on **Allow duplicate as template**. Copy the link.
2. In your checkout tool (Stripe, Gumroad, Lemon Squeezy…), create a $149 product. Attach `how-to-use.pdf` and put the Notion template link in the delivery email.
3. Paste the checkout link into `CHECKOUT_URL` in `products/social-media-command-center/index.html`.

Keep this folder out of any public deploy: it's the paid deliverable. The landing page lives in `products/social-media-command-center/`.
