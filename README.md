# StagNest

A verified off-campus housing marketplace for Fairfield University students — plain HTML, CSS, and vanilla JavaScript. No build step, no npm, no server, no database.

## Run it

Open `index.html` directly in a browser, or right-click it in VS Code and choose **"Open with Live Server"**. There is nothing to install.

## Structure

```
index.html          Landing (marketing)
browse.html          Search + filters + list/map
listing.html          Property detail (reads ?id=)
about.html            About + FAQ
list-property.html    Landlord listing form + confirmation
signin.html            Fairfield-email sign-in (demo)
dashboard.html         Student: saved / applications / documents / alerts
rental.html            Tenant portal: rent / maintenance / lease / messages
manage.html            Landlord: rent roll / maintenance / applications / listings
admin.html             Admin (not linked in nav — see below)
assets/styles.css      Design system + all components
assets/data.js         window.CONFIG, window.LISTINGS, window.money
assets/app.js          Logo, nav/footer injection, favorites, listing-card renderer
```

## What's real vs. simulated

This is a front-end demo. Sample data lives in `assets/data.js`; favorites are the only thing that persist (in `localStorage`). Sign-in, applications, payments, and admin actions all update the page in memory but reset on reload — there is no backend, no real accounts, and no real payments. For that, see the separate Next.js app spec.

## Config

- **Google Maps (optional):** paste a key into `window.CONFIG.MAPS_KEY` in `assets/data.js` to enable the live map on `browse.html`. Leave it blank to use the built-in schematic map — it works fully offline.
- **Campus point:** `window.CONFIG.CAMPUS` is set to Fairfield University.

## The admin page

`admin.html` is intentionally left out of the site navigation, but hiding it from the nav does not make it private — anyone who opens the file directly or views source can reach it. There is no way to truly protect it on a static site. If you deploy this site publicly and don't want admin reachable, delete `admin.html` before uploading.

## Deploy

It's just files. Drag the project folder onto [Netlify Drop](https://app.netlify.com/drop), or push it to GitHub and enable GitHub Pages, or upload it to any static host.
