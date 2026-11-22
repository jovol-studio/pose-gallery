# Pose Gallery — local reference library

Open **index.html** directly in a current Chrome, Edge, Firefox, or Safari browser. No container, Node.js, package installation, build, web server, or internet connection is needed.

Keep these files together when copying the gallery:

- `index.html` — entry point and page structure
- `styles.css` — responsive layout
- `app.js` — search, filters, pagination, and image previews
- `catalog.js` — local metadata, loaded with a classic script (no fetch or ES modules)
- `img/` — full-size images, organized into `pose/`, `costume/`, and `portrait/`
- `thumbs/` — thumbnails, organized into `pose/`, `costume/`, and `portrait/`
- `LICENSE` — GNU General Public License v3 text
- `attribution.html` — bilingual image source, app inspiration, and rights notice

## Browsing

The gallery starts with poses. Switch to Costumes or Portraits to browse the other included collections. There are 1,439 pose images, 1,407 costume images, and 1,499 portrait images. The interface and all image titles use Traditional Hong Kong Chinese with English alongside. Search uses Traditional Chinese, English titles, IDs, category/angle labels, and costume keywords. Catalogue records store the Chinese title in `name` and its English counterpart in `nameEn`. The search index is built from these bilingual records without legacy Simplified Chinese aliases.

Filter by collection, pose type, hair length, or angle. Poses can be grouped by pose or shown as individual images. Results are paginated in sets of 48. Safe mode is enabled on each opening and hides the same categories as the original application.

Click a reference to view the original. Use the angle buttons to compare a pose's views. Left/right arrows move between filtered references; up/down arrows change the angle within a group; Escape closes the preview. Use **Open original** to view the full-size image in a separate tab.

Everything needed for the gallery is local. Footer attribution links are optional external links. The app does not make API calls or save settings, and it works with browser storage disabled.

## Simplified application

This version replaces the React/TypeScript/Vite application with plain HTML, CSS, and JavaScript. The AI generation studio, API proxy, ComfyUI plugin, deployment configuration, package dependencies, and maintenance scripts have been removed. Pose originals are stored in `img/pose/` and their thumbnails in `thumbs/pose/`; costume and portrait assets use their corresponding collection folders. To edit catalogue records, update `catalog.js` directly.

## Attribution and rights

The `LICENSE` file contains the GNU General Public License v3 text. Image attribution and rights information are provided separately in [attribution.html](attribution.html). Reference images and original catalogue data remain subject to their owners’ terms; this app does not grant additional image usage or redistribution rights. 

- 圖片來源及本應用程式的構思源自 [Pose Gallery](https://ai-pose-gallery.pages.dev/)。
- Image source and inspiration for this app: [Pose Gallery](https://ai-pose-gallery.pages.dev/).
- Original reference imagery: [ギア (@giaaibusi)](https://x.com/giaaibusi).
- Chinese catalogue and original project: [Anhao / ai-pose-gallery-zh](https://github.com/anhao/ai-pose-gallery-zh).
- Original collections: [poses](https://ai-pose-gallery.pages.dev/), [costumes](https://ai-costume-gallery.pages.dev/), and [portraits](https://ai-portrait-gallery.pages.dev/).


