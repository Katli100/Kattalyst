# Clean home navigation

## Upload the update

1. Unzip Kattalyst-clean-home-update.zip.
2. Open the extracted folder and select all 36 files inside it. Select the files themselves, rather than their enclosing folder.
3. In the main branch of Katli100/Kattalyst, open the level containing index.html and assets.
4. Use Add file > Upload files > choose your files, upload the 36 files at this level, replace matching files, and commit to main.
5. Wait for GitHub Pages to finish deploying, then press Ctrl+Shift+R on the website.

Keep the existing assets folder in place. This package includes the previous navigation, image-viewer, wording, and Home-card changes, plus the message form and simplified Home layout. No image upload is needed.

## Activate message delivery once

The new note card opens a private contact form. It posts to FormSubmit and is addressed to kl4370@nyu.edu, the email already listed on the portfolio. Submissions are private messages, not public comments.

1. After uploading, open Get in touch on the public GitHub Pages site and choose Write a message.
2. Send a short test note using an email you can receive replies at. Complete FormSubmit’s spam check if prompted.
3. Open the activation email in the kl4370@nyu.edu inbox and confirm the form. Check Spam if needed.
4. Confirm that the test note arrives. FormSubmit holds submissions until the form is confirmed.

The form interface, validation, and return links have been checked. Inbox delivery has not been verified because the recipient must confirm the email address. No test messages were sent during development.

FormSubmit’s setup information: https://formsubmit.co/ and https://formsubmit.co/help

The form keeps FormSubmit’s default spam checks and includes a honeypot. No submission data is saved in the visitor’s browser. To change the destination later, update the form action in contact.html and confirm the new recipient address with FormSubmit.

## Latest visual changes

Home now has two clear entrances: Product design and Graphic design. The random-project circle, its script, and its styling have been removed. The collection cards sit closer together, retain their full clickable areas, and keep the staggered project previews.

The moving page-wide pastel color washes are more visible: the container uses full opacity, and each gradient has an 80% color stop. They still shift as you scroll, and reduced-motion preferences retain a static background. This change applies across every page. Home’s separate decorative shape behind the cards retains its lighter appearance. Text, borders, navigation, and contact form colors retain their contrast. Name, email, and message remain required, including rejection of names that contain only spaces.

The note card still opens the private message form, with a pale butter-yellow background behind the envelope. Follow the one-time activation steps above if delivery has not yet been activated.

All pages and media paths retain the repaired flat layout. Active code lives in dist/. Future updates should preserve it rather than introducing a product/ folder or an extra folder containing another site copy.
