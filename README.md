# Discovery Studio

See how your UEFN island's promotional media will look across Fortnite's menus before you upload it to the Creator Portal. Free, and it runs entirely in your browser.

**Open it: https://puzzler-dev.github.io/discovery-studio/**

Made by [Puzzler Creations](https://github.com/puzzler-dev). The starter project is our island ARCADE CHESS; replace it with your own media.

## What it does

- **Eight previews**: Discover rows, the featured banner, mobile, the island details page, the pre-game lobby, a news spotlight, a creator post and community events.
- **Lobby preview**: your lobby background behind a party of 0–4 players. The pads and the glossy floor mirror your art the way they do in game, so you can see what lands behind the party and the menus.
- **A/B variants**: five artwork slots per variant (landscape with text, landscape art only, portrait with text, portrait art only, transparent logo), compared side by side.
- **File checks** against the Creator Portal upload limits: dimensions, file type, file size, video length and logo transparency.
- **Framing, logo placement and logo on/off** per preview, plus safe-area guides for the UI.
- **Export** any preview as a PNG, or a JSON checklist of your files.

## How to use it

1. Open the site and choose **Import media**. Drop in your thumbnails, logo, lobby background, screenshots and videos, then assign each file to a slot.
2. Switch between the preview tabs. Choose **Art only** to compose the art-only thumbnails with your logo, and use the **Logo** switch under Preview layers to show or hide it on any tab. Drag the framing sliders to see different crops.
3. Under **Island details**, set your island's title, creator name and description so the simulated UI shows your text.
4. Check **Delivery checklist** before you upload, and export the previews you want to share.

## Your files stay on your computer

Nothing is uploaded. Imported files are kept in your browser's storage (IndexedDB) on this device only. Clearing your browser's site data removes them, so keep your original files.

## Accuracy

The menus are rebuilt in HTML and CSS from 1920 × 1080 in-game screenshots. Layouts, pads and floor were measured from those screenshots, but fonts, lighting and animation are approximate, and Fortnite's UI changes over time. The mobile layout is illustrative. Player counts, dates and engagement numbers are examples. File checks follow the Creator Portal limits as of October 11, 2026, with an optional profile for the changes Epic announced for October 22.

## Run it locally

Needs Node.js 20 or newer; there is nothing to install.

```
npm start
```

Then open http://127.0.0.1:4173. It needs a local server because it uses JavaScript modules. `npm test` runs the checks.

## Feedback

Found something that doesn't match the game, or want another placement? [Open an issue](https://github.com/puzzler-dev/discovery-studio/issues).

## Credits

- The example islands in the Discover rows are creator-made islands, with thumbnails sourced through [Fortnite.gg](https://fortnite.gg/discover). Each creator and island is listed in `dist/assets/context/sources.json`.
- PNG export uses [html-to-image](https://github.com/bubkoo/html-to-image) 1.11.13 (MIT); its license is in `dist/html-to-image.LICENSE.txt`.
- The ESRB Teen badge is shown as an example rating, as it appears in game.

## Disclaimer

Discovery Studio is a free fan-made tool. It is not an Epic Games product and is not affiliated with Epic Games.

Portions of the materials used are trademarks and/or copyrighted works of Epic Games, Inc. All rights reserved by Epic. This material is not official and is not endorsed by Epic.

## License

Free to use. The code is © Puzzler Creations, all rights reserved; it is not open-source licensed.
