/* ==========================================================================
   StagNest — sample data + config
   Plain globals, no modules, so this works when opened straight from disk.
   ========================================================================== */

window.CONFIG = {
  // Paste a Google Maps JS API key here to enable the live map on browse.html.
  // Leave blank to use the schematic price-pin map (fully usable, works offline).
  MAPS_KEY: "",
  CAMPUS: { lat: 41.1553, lng: -73.2586 }
};

// Shared interior shots reused across every listing's photo gallery (kitchen,
// living room, bedroom, bathroom) — each listing adds one unique exterior
// photo in front of this set.
var INTERIOR_KIT = [
  "https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80"
];

window.LISTINGS = [
  {
    id: 1,
    title: "Sunny 4-bed near North Benson",
    address: "142 North Benson Rd, Fairfield, CT",
    lat: 41.1601, lng: -73.2612,
    rent: 3600, beds: 4, baths: 2,
    furnished: true,
    avail: "Jun 1, 2026", lease: "12 months", deposit: 3600,
    parking: "Driveway, 4 spots",
    color: "#BA0C2F",
    photos: ["https://images.unsplash.com/photo-1592595896616-c37162298647?auto=format&fit=crop&w=1200&q=80"].concat(INTERIOR_KIT),
    verified: true,
    landlord: "Marie Costa",
    resp: "Usually replies same day",
    rating: 4.8,
    reviewCount: 32,
    reviews: [
      { name: "J. Kwan", initials: "JK", rating: 5, date: "Jul 2026", text: "Marie's been great with maintenance all year. The kitchen redo is legit — makes the whole downstairs feel bigger. Walk to campus is exactly what they say, maybe 6-7 min if you're not rushing." },
      { name: "D. Ruiz", initials: "DR", rating: 5, date: "Mar 2026", text: "Lived here fall semester. Backyard got a ton of use once it warmed up. Only downside is the driveway gets tight with four cars, but otherwise no complaints." }
    ],
    desc: "Redid the kitchen and both bathrooms last summer. Nothing else on North Benson is this new. Campus is six minutes away if you cut through by the tennis courts — less if you jaywalk, not that I'd recommend it. Backyard's fenced, which matters more than you'd think once it's actually not 15 degrees out. Marie's a Fairfield grad herself, so she gets what a group house actually needs (garbage disposal died on a Tuesday; she had someone out by Wednesday).",
    amenities: ["In-unit laundry", "Dishwasher", "Central air", "Fenced yard", "High-speed internet ready", "Off-street parking"],
    r: { campus: 6, campusDriveMin: 2, seagrapeWalkMin: 12, downtownWalkMin: 16, safety: 9, quiet: 7, conv: 8 }
  },
  {
    id: 2,
    title: "Renovated 3-bed on Reef Rd",
    address: "58 Reef Rd, Fairfield, CT",
    lat: 41.1487, lng: -73.2545,
    rent: 3150, beds: 3, baths: 2,
    furnished: false,
    avail: "Aug 15, 2026", lease: "12 months", deposit: 3150,
    parking: "2 driveway spots",
    color: "#1F5FA6",
    photos: ["https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1200&q=80"].concat(INTERIOR_KIT),
    verified: true,
    landlord: "Tom DiPietro",
    resp: "Responds within a day",
    rating: 4.6,
    reviewCount: 19,
    reviews: [
      { name: "J. Marsh", initials: "JM", rating: 5, date: "Aug 2025", text: "Tom fixed the dishwasher within a day when it broke in October. Basement's a little damp in spring but nothing crazy. Great location if you actually want to walk to the beach." },
      { name: "A. Patel", initials: "AP", rating: 4, date: "Dec 2025", text: "Solid house, walk-in closets are bigger than I expected. Heat runs a little uneven upstairs but we just used a space heater in the back bedroom." }
    ],
    desc: "Tom gutted the kitchen and both bathrooms before we signed. The only original thing left is the walk-in closets, and honestly? Huge. No complaints. Cut down Reef and you're at the beach in eight minutes, give or take. One catch — the basement floods a bit when it really pours. Nothing's ever been ruined by it, but keep your stuff off the floor down there. Learned that one the easy way, not the hard way.",
    amenities: ["Finished basement", "Washer/dryer", "Hardwood floors", "Storage shed"],
    r: { campus: 11, campusDriveMin: 4, seagrapeWalkMin: 15, downtownWalkMin: 13, safety: 8, quiet: 8, conv: 7 }
  },
  {
    id: 3,
    title: "5-bed party-friendly on Jefferson",
    address: "27 Jefferson St, Fairfield, CT",
    lat: 41.1622, lng: -73.2578,
    rent: 4500, beds: 5, baths: 3,
    furnished: true,
    avail: "Jun 1, 2026", lease: "12 months", deposit: 4500,
    parking: "Street parking",
    color: "#8A5206",
    photos: ["https://images.unsplash.com/photo-1598228723793-52759bba239c?auto=format&fit=crop&w=1200&q=80"].concat(INTERIOR_KIT),
    verified: true,
    landlord: "Fairfield Rentals LLC",
    resp: "Responds within 4 hours",
    rating: 4.2,
    reviewCount: 41,
    reviews: [
      { name: "C. Boone", initials: "CB", rating: 4, date: "May 2026", text: "Exactly what you'd expect from a Jefferson house — loud, a little beat up, but everyone had their own room and the deck got a lot of use. Landlord's slow on small stuff but handled the heater going out fast." },
      { name: "M. Tran", initials: "MT", rating: 3, date: "Feb 2026", text: "Furniture's seen better days and the common room carpet needs replacing, but the location can't be beat if you're trying to walk everywhere. Wouldn't recommend if you actually want quiet." }
    ],
    desc: "A Jefferson Hill staple — steps from the crowd, built for a group that actually hangs out together. Big common room, a deck that gets real use, and enough bedrooms that nobody's fighting over space. Furnished throughout with pieces built to survive a group house, not just decorate one.",
    amenities: ["Furnished", "Deck", "Large common room", "Cable ready", "Trash included"],
    r: { campus: 4, campusDriveMin: 2, seagrapeWalkMin: 5, downtownWalkMin: 14, safety: 6, quiet: 4, conv: 8 }
  },
  {
    id: 4,
    title: "Quiet 2-bed cottage, Old Post Rd",
    address: "301 Old Post Rd, Fairfield, CT",
    lat: 41.1519, lng: -73.2701,
    rent: 2400, beds: 2, baths: 1,
    furnished: false,
    avail: "Sep 1, 2026", lease: "12 months", deposit: 2400,
    parking: "1 driveway spot",
    color: "#0F6E56",
    photos: ["https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=1200&q=80"].concat(INTERIOR_KIT),
    verified: false,
    landlord: "Ellen Ryder",
    resp: "Checks messages most evenings",
    rating: null,
    reviewCount: 0,
    reviews: [],
    desc: "Not for everyone, honestly. This street is older couples and a handful of grad students — if you want to hear a party through the wall, keep scrolling. What you get instead: quiet. Real quiet. Small yard out back for a grill, and enough distance from campus (18 minutes on foot) that freshmen probably shouldn't bother. Got a car, or don't mind the walk? Worth it just for the silence alone.",
    amenities: ["Private yard", "Washer/dryer hookup", "Off-street parking"],
    r: { campus: 18, campusDriveMin: 6, seagrapeWalkMin: 22, downtownWalkMin: 8, safety: 9, quiet: 10, conv: 5 }
  },
  {
    id: 5,
    title: "Beachside 4-bed, Fairfield Beach Rd",
    address: "612 Fairfield Beach Rd, Fairfield, CT",
    lat: 41.1425, lng: -73.2489,
    rent: 3900, beds: 4, baths: 2,
    furnished: true,
    avail: "Jun 1, 2026", lease: "12 months", deposit: 3900,
    parking: "Driveway, 3 spots",
    color: "#BA0C2F",
    photos: ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80"].concat(INTERIOR_KIT),
    verified: true,
    landlord: "Marie Costa",
    resp: "Usually replies same day",
    rating: 4.9,
    reviewCount: 27,
    reviews: [
      { name: "S. Huang", initials: "SH", rating: 5, date: "Sep 2025", text: "Best senior year decision we made. Watched sunsets from the porch more nights than not. Marie mentioned the storm windows upfront so no surprises when the nor'easter hit in November." },
      { name: "L. Osei", initials: "LO", rating: 5, date: "Jun 2026", text: "Bike to campus is closer to 12-13 minutes than 10 if the wind's against you, but otherwise everything in the listing was accurate. Worth every penny for the summer months alone." }
    ],
    desc: "Come June, this is the house everyone wishes they'd signed for. Porch wraps clear around the front; on a good clear day you can see water from the upstairs bedrooms, no exaggeration. Bike to campus in about ten minutes — less if the wind's at your back, more if it isn't. Winters get salty and a little rough (ask Marie about the storm windows, she'll walk you through it), but May through October? Worth every bit of it.",
    amenities: ["Wraparound porch", "Outdoor shower", "Furnished", "Bike storage", "In-unit laundry"],
    r: { campus: 14, campusDriveMin: 5, seagrapeWalkMin: 18, downtownWalkMin: 20, safety: 8, quiet: 8, conv: 6 }
  },
  {
    id: 6,
    title: "Modern 3-bed townhome, Melville Ave",
    address: "84 Melville Ave, Fairfield, CT",
    lat: 41.1578, lng: -73.2633,
    rent: 3300, beds: 3, baths: 2.5,
    furnished: false,
    avail: "Jul 1, 2026", lease: "12 months", deposit: 3300,
    parking: "Attached garage",
    color: "#1F5FA6",
    photos: ["https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80"].concat(INTERIOR_KIT),
    verified: true,
    landlord: "Coastal Property Group",
    resp: "Responds within an hour",
    rating: 4.7,
    reviewCount: 15,
    reviews: [
      { name: "R. Fenn", initials: "RF", rating: 5, date: "Nov 2025", text: "Garage is clutch in the winter, no scraping ice off the windshield. Feels more like an apartment than a typical rental house, which some of my friends thought was a downside but I liked it." },
      { name: "K. Ng", initials: "KN", rating: 4, date: "Apr 2026", text: "Smart thermostat actually works, kept our heating bill lower than the house we had sophomore year. Coastal Property Group is responsive but very by-the-book about the lease terms." }
    ],
    desc: "Newer construction, a private garage, finishes that don't demand upkeep. If you want the space of a house without the upkeep of one — this is closer to an apartment that happens to have room to breathe.",
    amenities: ["Attached garage", "Central air", "Dishwasher", "Walk-in closets", "Smart thermostat"],
    r: { campus: 8, campusDriveMin: 3, seagrapeWalkMin: 10, downtownWalkMin: 10, safety: 9, quiet: 7, conv: 9 }
  },
  {
    id: 7,
    title: "Value 3-bed near Post Rd shops",
    address: "1190 Post Rd, Fairfield, CT",
    lat: 41.1462, lng: -73.2612,
    rent: 2850, beds: 3, baths: 1.5,
    furnished: false,
    avail: "Aug 1, 2026", lease: "12 months", deposit: 2850,
    parking: "Street parking",
    color: "#8A5206",
    photos: ["https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200&q=80"].concat(INTERIOR_KIT),
    verified: false,
    landlord: "Rick Alessi",
    resp: "Picks up the phone, doesn't always text back fast",
    rating: 4.1,
    reviewCount: 22,
    reviews: [
      { name: "B. Walsh", initials: "BW", rating: 4, date: "Jan 2026", text: "You get what you pay for but that's kind of the point — it's cheap for Fairfield. Rick picked up when I called about the water heater and had someone out same week." },
      { name: "T. Suarez", initials: "TS", rating: 3, date: "Oct 2025", text: "Finishes are dated for sure, and the walls are thin between bedrooms. But saved us real money compared to the houses near campus, and Post Rd shops being close was genuinely convenient." }
    ],
    desc: "Won't lie to you — the finishes are nothing special. This isn't a renovation show, it's a rental. But the rent's lower than almost everything else on here, Post Rd shops are an easy walk, and Rick picks up the phone. Actually picks up. Something breaks, he's not ghosting you for three weeks. If you'd rather put the savings toward literally anything else, this is your house.",
    amenities: ["Close to shops", "Washer/dryer hookup"],
    r: { campus: 16, campusDriveMin: 5, seagrapeWalkMin: 14, downtownWalkMin: 6, safety: 7, quiet: 6, conv: 9 }
  },
  {
    id: 8,
    title: "Spacious 6-bed, Kings Highway",
    address: "45 Kings Highway Cutoff, Fairfield, CT",
    lat: 41.1668, lng: -73.2549,
    rent: 5100, beds: 6, baths: 3,
    furnished: true,
    avail: "Jun 1, 2026", lease: "12 months", deposit: 5100,
    parking: "Driveway, 5 spots",
    color: "#0F6E56",
    photos: ["https://images.unsplash.com/photo-1591474200742-8e512e6f98f8?auto=format&fit=crop&w=1200&q=80"].concat(INTERIOR_KIT),
    verified: true,
    landlord: "Fairfield Rentals LLC",
    resp: "Responds within 4 hours",
    rating: 4.5,
    reviewCount: 38,
    reviews: [
      { name: "N. Ghosh", initials: "NG", rating: 5, date: "Aug 2025", text: "Two kitchens sounds excessive until you're trying to cook dinner for six people at once. Basement fit a full setup for movie nights. Definitely a group house, not for anyone who wants quiet." },
      { name: "E. Cole", initials: "EC", rating: 4, date: "Mar 2026", text: "Big house, big yard, exactly as advertised. A little bit of a walk to campus and the bars so budget extra time, but worth it for the space if you're renting with a large group." }
    ],
    desc: "One of the biggest group houses near campus, full stop. Two full kitchens — because six people sharing one stove by October is a friendship-ender — and a finished basement with real square footage. Built for the friend group that refuses to split up senior year.",
    amenities: ["Two kitchens", "Finished basement", "Furnished", "Large yard", "Off-street parking"],
    r: { campus: 9, campusDriveMin: 3, seagrapeWalkMin: 13, downtownWalkMin: 17, safety: 7, quiet: 5, conv: 7 }
  },
  {
    id: 9,
    title: "Bright 2-bed near South Pine Creek",
    address: "77 South Pine Creek Rd, Fairfield, CT",
    lat: 41.1391, lng: -73.2678,
    rent: 2200, beds: 2, baths: 1,
    furnished: false,
    avail: "Sep 1, 2026", lease: "12 months", deposit: 2200,
    parking: "1 driveway spot",
    color: "#BA0C2F",
    photos: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"].concat(INTERIOR_KIT),
    verified: true,
    landlord: "Ellen Ryder",
    resp: "Checks messages most evenings",
    rating: 4.8,
    reviewCount: 9,
    reviews: [
      { name: "P. Vance", initials: "PV", rating: 5, date: "May 2026", text: "Quiet is an understatement — perfect if you actually need to study. Ellen's easy to reach and the afternoon light in the living room is real, not just a listing thing." },
      { name: "H. Jin", initials: "HJ", rating: 5, date: "Feb 2026", text: "Ran the marsh trail behind the house probably 3x a week all spring. You definitely need a car or a bike out here though, it's far from everything else." }
    ],
    desc: "Small, sure. But the afternoon light in here is something else. Used to run the marsh trail behind South Pine Creek most mornings before class — if that's your thing, you'll love it here. Not close to much else, I won't pretend otherwise. Bring a bike or a car. What you get in return: real quiet, and a landlord in Ellen who's genuinely easy to deal with.",
    amenities: ["Updated kitchen", "Hardwood floors", "Storage shed", "Off-street parking"],
    r: { campus: 22, campusDriveMin: 7, seagrapeWalkMin: 25, downtownWalkMin: 19, safety: 9, quiet: 9, conv: 4 }
  }
];

window.money = (n) => "$" + Number(n).toLocaleString();
