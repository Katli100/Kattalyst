# Apply the image and stylesheet repair

This repair matches the layout of the uploaded Kattalyst repository. Project pages are next to index.html, and all images stay in assets/.

1. Unzip Kattalyst-image-fix.zip.
2. Copy all 22 extracted files into the existing repository folder containing index.html. Replace files with the same names.
3. Keep the existing assets folder and its contents in place. This patch does not require an image upload.
4. Commit and push the changes, or upload the 22 files through GitHub's Upload files screen in the repository root and commit them.
5. After GitHub Pages finishes deploying, hard-refresh the website and check Home, Product, Graphics, and a project page.

The pages now use site.css for shared/main styling and product.css for product styling. Their different names prevent the former style.css collision. The old style.css can remain; no repaired page links to it.

All media references are relative to the repository's current layout. The restored pocket-whiteboard section, P&G cover thumbnail, image galleries, and interaction scripts are retained.

For future updates, use this repaired layout as the starting point. Old packages that expect a product/ subfolder should not be uploaded over these pages.
