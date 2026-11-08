# Personal Habit Tracker — iPhone PWA

A minimalist habit tracker designed for iPhone Safari. It stores habit data in this browser on your device and supports offline use after the first successful load.

## Publish it using only your iPhone

This project must be served over HTTPS for Add to Home Screen and offline service-worker support. One approachable free route is GitHub Pages.

1. Open Safari and sign in to GitHub (create a free account if needed).
2. Create a new public repository named `my-habit-tracker`.
3. In the repository, use **Add file → Upload files** and upload every file from this folder (including both PNG icons). If the mobile upload flow makes selecting multiple files difficult, use GitHub's browser desktop-site option.
4. Commit the files to the `main` branch.
5. Open the repository's **Settings → Pages**.
6. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/(root)`, then Save.
7. Wait for GitHub Pages to publish. Your app address will look like `https://YOUR-USERNAME.github.io/my-habit-tracker/`.
8. Open that address in Safari on your iPhone. Tap Share → **Add to Home Screen** → Add.
9. Launch **Habits** from the Home Screen. Open it once while online so its files can be cached for offline use.

## Use the app
- Tap **＋** to add a habit and choose its category.
- Tap the circle to mark today's habit complete or undo it.
- Filter by category using the chips.
- Tap the three-dot control on a habit to delete it.
- The daily progress and seven-day completion dots update automatically.

## Privacy and limitations
- Habit data is stored in local browser storage on this iPhone. It is not uploaded to GitHub or a server.
- Avoid clearing Safari website data for the app's domain unless you have exported/backed up your habits (this starter does not yet include export).
- This first version has daily habits, categories, a progress bar, and a simple seven-day view. It does not yet have reminders, iCloud sync, or detailed per-habit history.
- GitHub Pages hosts the app's code publicly if the repository is public; your habit entries remain in local browser storage and are not part of the repository.
