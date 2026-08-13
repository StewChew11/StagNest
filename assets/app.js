/* ==========================================================================
   StagNest — shared behavior (chrome injection, favorites, listing cards)
   Plain globals, no modules, so this works when opened straight from disk.
   ========================================================================== */

// Brand mark: a house with an antlered stag inside, a palm tree beside it,
// and waves underneath — house + stag + Fairfield-beach-town references.
var STAG = '<svg viewBox="-15 -25 300 240" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">' +
  '<path d="M115 14 L24 86 V182 M115 14 L206 86 V182" stroke-width="6"/>' +
  '<rect x="88" y="6" width="14" height="32" stroke-width="5"/>' +
  '<path d="M115,100 L138,109 L131,152 L115,172 L99,152 L92,109 Z" fill="currentColor" stroke="none"/>' +
  '<path d="M98,104 C82,92 68,75 58,55 C50,40 42,20 35,5" stroke-width="7"/>' +
  '<path d="M68,75 C50,65 35,58 25,50" stroke-width="6"/>' +
  '<path d="M50,45 C35,38 22,32 15,25" stroke-width="6"/>' +
  '<path d="M40,22 C30,18 22,15 16,14" stroke-width="5"/>' +
  '<path d="M132,104 C148,92 162,75 172,55 C180,40 188,20 195,5" stroke-width="7"/>' +
  '<path d="M162,75 C180,65 195,58 205,50" stroke-width="6"/>' +
  '<path d="M180,45 C195,38 208,32 215,25" stroke-width="6"/>' +
  '<path d="M190,22 C200,18 208,15 214,14" stroke-width="5"/>' +
  '<path d="M212,192 C202,158 198,118 206,86 C210,72 216,62 224,52 C218,66 213,88 214,118 C215,148 219,175 226,192 Z" fill="currentColor" stroke="none"/>' +
  '<path d="M220,50 Q200,24 182,34 Q204,48 220,50 Z" fill="currentColor" stroke="none"/>' +
  '<path d="M220,50 Q207,24 220,4 Q233,26 220,50 Z" fill="currentColor" stroke="none"/>' +
  '<path d="M220,50 Q243,22 253,15 Q245,42 220,50 Z" fill="currentColor" stroke="none"/>' +
  '<path d="M220,50 Q251,38 270,44 Q248,54 220,50 Z" fill="currentColor" stroke="none"/>' +
  '<path d="M220,50 Q249,60 264,78 Q234,64 220,50 Z" fill="currentColor" stroke="none"/>' +
  '<path d="M220,50 Q231,68 236,90 Q214,70 220,50 Z" fill="currentColor" stroke="none"/>' +
  '<path d="M0,178 C22,167 44,167 66,178 C88,189 110,189 132,178 C154,167 176,167 198,178 C220,189 242,189 260,178" stroke-width="6"/>' +
  '<path d="M18,190 C40,180 62,180 84,190 C106,200 128,200 150,190 C168,182 186,182 200,188" stroke-width="6"/>' +
  '</svg>';

var ICONS = {
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 8.6c0 5.6-8.8 10.9-8.8 10.9S3.2 14.2 3.2 8.6a5 5 0 0 1 9-3 5 5 0 0 1 8.6 3Z"/></svg>',
  bed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7"/><path d="M3 18v2M21 18v2M3 13h18"/><path d="M7 11V8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v3"/></svg>',
  bath: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3Z"/><path d="M7 12V6a2 2 0 0 1 3-1.7"/><path d="M4 19v1M18 19v1"/></svg>',
  walk: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="13" cy="4" r="1.6" fill="currentColor" stroke="none"/><path d="M9 21l2-6 2 2 3 4M7 15l2-4-1-4 4-1 3 3 3-1"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10.5V20a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4a2 2 0 0 0-4 0v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9.5"/><path d="m2.5 11.5 9-8 9 8"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2.5l2.9 6.2 6.7.7-5 4.6 1.4 6.6-6-3.4-6 3.4 1.4-6.6-5-4.6 6.7-.7L12 2.5Z"/></svg>',
  chevronLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
  chevronRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>'
};

/* -------------------------------------------------------------------------
   Amenity icon lookup — keyword-matched so the amenities grid on
   listing.html doesn't just repeat the same checkmark for everything.
   ------------------------------------------------------------------------- */
var AMENITY_ICONS = {
  laundry: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="13" r="5"/><circle cx="8" cy="6.3" r=".6" fill="currentColor" stroke="none"/><circle cx="11" cy="6.3" r=".6" fill="currentColor" stroke="none"/></svg>',
  parking: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 16V9l2-4h14l2 4v7"/><path d="M3 16h18M6.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/></svg>',
  kitchen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16v3a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-3Z"/><path d="M2 12h20M7 12V8a5 5 0 0 1 10 0v4"/></svg>',
  air: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M4.5 6l15 12M19.5 6l-15 12M2 12h20"/></svg>',
  yard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 6 11h3l-4 7h5v4h4v-4h5l-4-7h3L12 2Z"/></svg>',
  furnished: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 13V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M3 13h18v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4Z"/><path d="M5 18v2M19 18v2"/></svg>',
  closet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a2 2 0 1 1 2 2c0 .8-.9 1-2 2"/><path d="M12 7v2M3 20h18M12 9l9 6H3l9-6Z"/></svg>',
  wifi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8.5a16 16 0 0 1 20 0M5.5 12.5a11 11 0 0 1 13 0M9 16.5a6 6 0 0 1 6 0"/><circle cx="12" cy="20" r="1" fill="currentColor" stroke="none"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"/></svg>',
  shop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h12l1 12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  storage: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8 12 3l9 5-9 5-9-5Z"/><path d="M3 8v9l9 5 9-5V8M12 13v9"/></svg>',
  shower: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c3 4 5 6.5 5 9.5a5 5 0 0 1-10 0C7 9.5 9 7 12 3Z"/></svg>'
};

var AMENITY_ICON_RULES = [
  [/dishwasher/i, "kitchen"],
  [/laundry|washer/i, "laundry"],
  [/parking|garage/i, "parking"],
  [/kitchen/i, "kitchen"],
  [/air|thermostat/i, "air"],
  [/yard|porch|deck/i, "yard"],
  [/furnished|common room/i, "furnished"],
  [/closet/i, "closet"],
  [/internet|cable|wifi/i, "wifi"],
  [/trash/i, "trash"],
  [/shop/i, "shop"],
  [/storage|shed|basement/i, "storage"],
  [/shower/i, "shower"]
];

function amenityIcon(text) {
  for (var i = 0; i < AMENITY_ICON_RULES.length; i++) {
    if (AMENITY_ICON_RULES[i][0].test(text)) return AMENITY_ICONS[AMENITY_ICON_RULES[i][1]];
  }
  return ICONS.check;
}

/* -------------------------------------------------------------------------
   Street name — "142 North Benson Rd, Fairfield, CT" -> "North Benson Rd".
   Cards show a neighborhood/street, not the exact number, like Airbnb/Zillow.
   ------------------------------------------------------------------------- */
function streetName(address) {
  var first = address.split(",")[0].trim();
  return first.replace(/^\d+\s+/, "");
}

/* -------------------------------------------------------------------------
   Star rating / "New" badge — shared by listing cards and the detail page.
   ------------------------------------------------------------------------- */
function ratingLine(listing) {
  if (!listing.reviewCount || listing.reviewCount < 3) {
    return '<span class="badge badge-blue">New</span>';
  }
  return '<span class="rating-line">' + ICONS.star + listing.rating.toFixed(1) +
    '<span class="rating-line-count"> · ' + listing.reviewCount + ' review' + (listing.reviewCount === 1 ? "" : "s") + '</span></span>';
}

var NAV_LINKS = [
  { href: "browse.html", label: "Browse" },
  { href: "about.html", label: "About" },
  { href: "list-property.html", label: "List your property" }
];

function currentPage() {
  var p = location.pathname.split("/").pop();
  return p === "" ? "index.html" : p;
}

function renderChrome() {
  var navEl = document.getElementById("nav");
  var footEl = document.getElementById("footer");
  var page = currentPage();

  if (navEl) {
    var linksHtml = NAV_LINKS.map(function (l) {
      var active = l.href === page ? " active" : "";
      return '<a href="' + l.href + '" class="' + active.trim() + '">' + l.label + "</a>";
    }).join("");

    var drawerHtml = NAV_LINKS.map(function (l) {
      return '<a href="' + l.href + '">' + l.label + "</a>";
    }).join("");

    navEl.innerHTML =
      '<nav class="nav">' +
        '<div class="nav-inner">' +
          '<a href="index.html" class="brand">' +
            '<span class="brand-badge stag-slot"></span>' +
            '<span class="brand-text"><span>StagNest</span><span class="brand-kicker">Fairfield housing</span></span>' +
          '</a>' +
          '<div class="nav-links">' + linksHtml + '</div>' +
          '<div class="nav-actions">' +
            '<a href="signin.html" class="btn btn-primary btn-lg">Sign in</a>' +
            '<button class="nav-menu-btn btn-ghost" id="navMenuBtn" aria-label="Open menu">' + ICONS.menu + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="nav-drawer" id="navDrawer">' +
          drawerHtml +
          '<div class="nav-drawer-actions">' +
            '<a href="signin.html" class="btn btn-primary btn-block btn-lg">Sign in</a>' +
          '</div>' +
        '</div>' +
      '</nav>';

    var menuBtn = document.getElementById("navMenuBtn");
    var drawer = document.getElementById("navDrawer");
    if (menuBtn && drawer) {
      menuBtn.addEventListener("click", function () {
        var open = drawer.classList.toggle("open");
        menuBtn.innerHTML = open ? ICONS.close : ICONS.menu;
      });
      drawer.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          drawer.classList.remove("open");
          menuBtn.innerHTML = ICONS.menu;
        });
      });
    }
  }

  if (footEl) {
    footEl.innerHTML =
      '<footer class="site">' +
        '<div class="container">' +
          '<div class="footer-grid">' +
            '<div>' +
              '<div class="footer-brand">' +
                '<span class="brand-badge stag-slot"></span>' +
                '<span class="brand-text"><span>StagNest</span><span class="brand-kicker">Fairfield housing</span></span>' +
              '</div>' +
              '<p>A verified off-campus housing marketplace built for Fairfield University students. Real listings, real reviews, no scams.</p>' +
            '</div>' +
            '<div class="footer-col"><h4>Explore</h4><ul>' +
              '<li><a href="browse.html">Browse listings</a></li>' +
              '<li><a href="about.html">About StagNest</a></li>' +
              '<li><a href="list-property.html">List your property</a></li>' +
            '</ul></div>' +
            '<div class="footer-col"><h4>Account</h4><ul>' +
              '<li><a href="signin.html">Sign in</a></li>' +
              '<li><a href="dashboard.html">Student dashboard</a></li>' +
              '<li><a href="rental.html">Tenant portal</a></li>' +
              '<li><a href="manage.html">Landlord manager</a></li>' +
            '</ul></div>' +
            '<div class="footer-col"><h4>Company</h4><ul>' +
              '<li><a href="about.html">Our mission</a></li>' +
              '<li><a href="about.html#faq">FAQ</a></li>' +
              '<li><a href="mailto:hello@stagnest.app">Contact</a></li>' +
            '</ul></div>' +
          '</div>' +
          '<div class="footer-bottom">' +
            '<span>&copy; 2026 StagNest. Built for the Fairfield University community.</span>' +
            '<span>Not affiliated with Fairfield University.</span>' +
          '</div>' +
        '</div>' +
      '</footer>';
  }

  document.querySelectorAll(".stag-slot").forEach(function (el) {
    el.innerHTML = STAG;
  });

  setFavicon();
}

function setFavicon() {
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">' +
    '<rect width="48" height="48" rx="11" fill="#BA0C2F"/>' +
    '<g transform="translate(2,8) scale(0.1556)" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M115 14 L24 86 V182 M115 14 L206 86 V182" stroke-width="6"/>' +
    '<rect x="88" y="6" width="14" height="32" stroke-width="5"/>' +
    '<path d="M115,100 L138,109 L131,152 L115,172 L99,152 L92,109 Z" fill="#ffffff" stroke="none"/>' +
    '<path d="M98,104 C82,92 68,75 58,55 C50,40 42,20 35,5" stroke-width="7"/>' +
    '<path d="M68,75 C50,65 35,58 25,50" stroke-width="6"/>' +
    '<path d="M50,45 C35,38 22,32 15,25" stroke-width="6"/>' +
    '<path d="M40,22 C30,18 22,15 16,14" stroke-width="5"/>' +
    '<path d="M132,104 C148,92 162,75 172,55 C180,40 188,20 195,5" stroke-width="7"/>' +
    '<path d="M162,75 C180,65 195,58 205,50" stroke-width="6"/>' +
    '<path d="M180,45 C195,38 208,32 215,25" stroke-width="6"/>' +
    '<path d="M190,22 C200,18 208,15 214,14" stroke-width="5"/>' +
    '<path d="M212,192 C202,158 198,118 206,86 C210,72 216,62 224,52 C218,66 213,88 214,118 C215,148 219,175 226,192 Z" fill="#ffffff" stroke="none"/>' +
    '<path d="M220,50 Q200,24 182,34 Q204,48 220,50 Z" fill="#ffffff" stroke="none"/>' +
    '<path d="M220,50 Q207,24 220,4 Q233,26 220,50 Z" fill="#ffffff" stroke="none"/>' +
    '<path d="M220,50 Q243,22 253,15 Q245,42 220,50 Z" fill="#ffffff" stroke="none"/>' +
    '<path d="M220,50 Q251,38 270,44 Q248,54 220,50 Z" fill="#ffffff" stroke="none"/>' +
    '<path d="M220,50 Q249,60 264,78 Q234,64 220,50 Z" fill="#ffffff" stroke="none"/>' +
    '<path d="M220,50 Q231,68 236,90 Q214,70 220,50 Z" fill="#ffffff" stroke="none"/>' +
    '<path d="M0,178 C22,167 44,167 66,178 C88,189 110,189 132,178 C154,167 176,167 198,178 C220,189 242,189 260,178" stroke-width="6"/>' +
    '<path d="M18,190 C40,180 62,180 84,190 C106,200 128,200 150,190 C168,182 186,182 200,188" stroke-width="6"/>' +
    '</g></svg>';
  var url = "data:image/svg+xml," + encodeURIComponent(svg);
  var link = document.querySelector('link[rel="icon"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.type = "image/svg+xml";
  link.href = url;
}

/* -------------------------------------------------------------------------
   Favorites (localStorage)
   ------------------------------------------------------------------------- */
var FAV_KEY = "stagnest_favorites";

function getFavs() {
  try {
    var raw = localStorage.getItem(FAV_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function isFav(id) {
  return getFavs().indexOf(Number(id)) !== -1;
}

function toggleFav(id) {
  id = Number(id);
  var favs = getFavs();
  var idx = favs.indexOf(id);
  if (idx === -1) {
    favs.push(id);
  } else {
    favs.splice(idx, 1);
  }
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
  return favs.indexOf(id) !== -1;
}

function onSave(btn, id, evt) {
  if (evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }
  var nowFav = toggleFav(id);
  if (btn) {
    btn.classList.toggle("fav", nowFav);
    var svgFill = nowFav ? "currentColor" : "none";
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="' + svgFill + '" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 8.6c0 5.6-8.8 10.9-8.8 10.9S3.2 14.2 3.2 8.6a5 5 0 0 1 9-3 5 5 0 0 1 8.6 3Z"/></svg>';
  }
  if (typeof window.onFavChanged === "function") {
    window.onFavChanged();
  }
}

/* -------------------------------------------------------------------------
   Listing card renderer
   ------------------------------------------------------------------------- */
function listingCard(listing) {
  var fav = isFav(listing.id);
  var verifiedBadge = listing.verified
    ? '<span class="badge badge-green">' + ICONS.check + " Verified</span>"
    : "";
  return (
    '<a href="listing.html?id=' + listing.id + '" class="listing">' +
      '<div class="listing-photo" style="background:linear-gradient(135deg,' + listing.color + 'cc,' + listing.color + '66)">' +
        ICONS.home +
        '<img src="' + listing.photos[0] + '" alt="' + listing.title + '" loading="lazy" onerror="this.remove()">' +
        '<div class="listing-badges">' + verifiedBadge + "</div>" +
        '<button type="button" class="listing-save' + (fav ? " fav" : "") + '" onclick="onSave(this,' + listing.id + ',event)">' +
          '<svg viewBox="0 0 24 24" fill="' + (fav ? "currentColor" : "none") + '" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 8.6c0 5.6-8.8 10.9-8.8 10.9S3.2 14.2 3.2 8.6a5 5 0 0 1 9-3 5 5 0 0 1 8.6 3Z"/></svg>' +
        "</button>" +
      "</div>" +
      '<div class="listing-body">' +
        '<div class="listing-title-row">' +
          '<h3 class="listing-title">' + listing.title + "</h3>" +
          ratingLine(listing) +
        "</div>" +
        '<div class="listing-neighborhood">' + streetName(listing.address) + "</div>" +
        '<div class="listing-detail-line">' + listing.beds + " bd · " + listing.baths + " ba · " + listing.r.campus + " min to campus</div>" +
        '<div class="listing-price"><strong>' + window.money(listing.rent) + "</strong><span> / mo</span></div>" +
      "</div>" +
    "</a>"
  );
}

document.addEventListener("DOMContentLoaded", renderChrome);
