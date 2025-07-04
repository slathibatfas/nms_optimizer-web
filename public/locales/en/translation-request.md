## Help Translate the NMS Optimizer

The app is currently English-only, but analytics show visitors from all over the world. I’d love to make it more accessible to the global No Man’s Sky community — and that’s where you come in.

## How You Can Help

I’m looking for bilingual players to help translate the app — especially to edit and proof the AI generated **French**, **German**, **Spanish** translations, or to do other languages with strong NMS player communities.

You don’t need to be a professional translator — just fluent, familiar with the game, and willing to help out. It'll definitely be better than this ChatGPT mess! You’ll be credited (or remain anonymous if you prefer).

Most strings are short UI labels, tooltips, or fun status messages.

Translations are managed using [`i18next`](https://www.i18next.com/), with simple JSON and Markdown files.

## If You're Comfortable With GitHub

**Fork the repo:**  
 [github.com/jbelew/nms_optimizer-web](https://github.com/jbelew/nms_optimizer-web)

**Update or Create the Translation Files:**

- Application UI labels are located in `/src/i18n/locales/[language_code]/translation.json`.
- Larger dialog box content is stored as pure Markdown files inside `/public/locales/[language_code]/`.

You can update existing files or create a new folder for your language using the [ISO 639-1 code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) (e.g., `de` for German). Copy the relevant Markdown files and JSON files into that folder, then update the content accordingly.

> _Example:_ Create `/public/locales/de/about.md` for dialog content and `/src/i18n/locales/de/translation.json` for UI labels.

**Submit a pull request** when you're done.

## Not Into Pull Requests?

No problem — just head over to the [GitHub Discussions page](https://github.com/jbelew/nms_optimizer-web/discussions) and start a new thread.

You can paste your translations there or ask questions if you’re not sure where to begin. I’ll take it from there.

## Notes

`randomMessages` is just that — a list of random messages that show when optimization takes longer than a couple of seconds. No need to translate them all, just come up with a few that make sense in your language.

Thanks for helping make the No Man's Sky Technology Layout Optimizer AI better for everyone! Let me know if you have any questions — happy to help.
