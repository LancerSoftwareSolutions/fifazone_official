# FifaZone Official — Sample Site

Static site: HTML, CSS, vanilla JS. No build step, no dependencies.

## Deploy on GitHub Pages

1. Push this folder to a new GitHub repo (root of the repo, or a `/docs` folder — either works).
2. In the repo: **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Pick the branch (usually `main`) and the folder (`/root` or `/docs`, matching step 1).
5. Save. GitHub gives you a URL like `https://<username>.github.io/<repo>/` — live in 1–2 minutes.

## Updating the live site

Push new commits to the branch you picked in step 4 — Pages redeploys automatically, no extra steps.

## File structure

```
index.html
style.css
main.js
README.md
```

All asset paths are relative to index.html, so the site works when these files are kept together in the same folder.
