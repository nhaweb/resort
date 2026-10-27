/** @type {import('./types').Dictionary} */
const en = {
  meta: {
    title: "PML Privilege Resort · Nine villas on a private limestone cove",
    description:
      "A private cove resort of nine limestone villas. Days follow the tide, not a timetable.",
  },
  ui: {
    skipToContent: "Skip to content",
    loadingPml: "Loading PML Privilege Resort",
    loadingPlace: "Costa Blanca",
    enquire: "Book a stay",
    menu: "Menu",
    close: "Close",
    primaryNav: "Primary",
    language: "Language",
    heroAlt:
      "Private limestone cove with calm water between pale cliffs at golden hour",
    introClipCaption: "Open water beyond the cove, the same coastal light.",
    seaClipAlt: "Ocean waves on a coastal beach",
    showcaseTitle: "Nine villas",
    showcaseIntro: "Each villa faces a different cut of the cove.",
    tideTitle: "Choose your light",
    tideLead:
      "The cove changes by the hour. Pick a tide window to see which path is open and which villas catch that light.",
    tideLegend: "Tide hour",
    galleryOpen: "Open {id} — {caption}",
    galleryClose: "Close gallery",
    previous: "Previous",
    next: "Next",
    footerVisit: "Visit",
    footerExplore: "Explore",
    footerContact: "Contact",
    footerHours: "Hours",
    footerLegal: "© 2026 PML Privilege Resort · Concept resort · Sample content",
    footerImagery: "Imagery",
    footerFootage: "Footage",
    footerFootageCredit:
      "“Ocean waves at Lækjavik beach, Iceland” by Alexander Grebenkov",
    footerStillsNote: "Still photographs were generated for this concept.",
    footerPolicies: "Policies",
    footerPrivacy: "Privacy",
  },
  site: {
    name: "PML Privilege Resort",
    tagline: "Nine villas on a private limestone cove",
    email: "stay@pml.com",
    phone: "+34 612 00 00 00",
    address: ["PML Privilege Resort", "Costa Blanca, Spain"],
    hours: [
      { days: "Arrivals", time: "15:00–19:00" },
      { days: "Departures", time: "before 11:00" },
      { days: "Kitchen", time: "07:30–22:00" },
    ],
    boat: "18 minutes by launch from the harbour",
  },
  nav: [
    { href: "/rooms", label: "Villas" },
    { href: "/gallery", label: "Gallery" },
    { href: "/book", label: "Stay" },
  ],
  hero: {
    title: "Nine stone villas",
    under: "A private cove resort on the Costa Blanca.",
    support: "Days follow the tide, not a timetable. Nine villas only.",
    cta: "Choose a villa",
    ctaHref: "/rooms",
  },
  intro: {
    title: "A bay held in stone",
    body: "The cove faces east. Morning light hits the water first, then climbs the cut of the cliff until every terrace turns the colour of warm limestone. Guests come for that slow turn of light, and for the path that appears only when the tide goes out.",
    image: {
      src: "/images/orilla-shore.jpg",
      alt: "Pale sand shore between limestone cliffs on a calm private cove",
    },
  },
  villas: [
    {
      id: "east-cut",
      name: "East Cut",
      line: "Sunrise over open water.",
      materials: "Limestone · linen · bronze",
      aspect: "east",
      image: "/images/orilla-villa-interior.jpg",
      alt: "Villa bedroom with linen bedding and a sea-facing window",
      description:
        "East Cut faces the open water, so the first light of the day lands on the bed before it reaches the cove. A low limestone wall frames the terrace, and the bronze shutters fold back to leave the room open to the morning air. It is the quietest villa at dawn and the first to warm.",
      amenities: [
        "King bed",
        "Sea-facing terrace",
        "Rain shower",
        "Linen bedding",
        "Daily breakfast",
      ],
      images: [
        {
          src: "/images/orilla-shore.jpg",
          alt: "Pale sand shore below the villa at first light",
        },
      ],
    },
    {
      id: "shelf",
      name: "The Shelf",
      line: "A terrace level with the waterline.",
      materials: "Travertine · walnut · linen",
      aspect: "south",
      image: "/images/orilla-pool.jpg",
      alt: "Cliffside plunge pool overlooking a turquoise cove at dusk",
      description:
        "The Shelf sits a few steps above the waterline, with a plunge pool cut into the stone terrace. At high tide the sea is almost within reach of the pool edge. Walnut joinery and travertine floors keep the interior cool through the afternoon.",
      amenities: [
        "Plunge pool",
        "Sea terrace",
        "King bed",
        "Outdoor shower",
        "Daily breakfast",
      ],
      images: [
        {
          src: "/images/orilla-tide-steps.jpg",
          alt: "Limestone steps leading from the terrace into shallow water",
        },
      ],
    },
    {
      id: "high-ledge",
      name: "High Ledge",
      line: "Wind, shade, and a long horizon.",
      materials: "Stone · teak · bronze",
      aspect: "west",
      image: "/images/orilla-cliff-portrait.jpg",
      alt: "Limestone cliff face with carved openings above the sea",
      description:
        "High Ledge is carved into the upper cliff, with deep openings that shade the rooms and catch the sea wind. The horizon runs the full width of the terrace. Late afternoon turns the stone gold, and the sun sets directly in front of the bed.",
      amenities: [
        "Cliff terrace",
        "King bed",
        "Teak daybed",
        "Sunset view",
        "Daily breakfast",
      ],
      images: [
        {
          src: "/images/orilla-aerial.jpg",
          alt: "Aerial view of the cove with villas set along the cliff",
        },
      ],
    },
    {
      id: "low-path",
      name: "Low Path",
      line: "Steps into the bay at low tide.",
      materials: "Limestone · rope · teak",
      aspect: "east",
      image: "/images/orilla-tide-steps.jpg",
      alt: "Limestone steps descending into clear shallow sea water",
      description:
        "Low Path opens directly onto the tide steps. When the water drops, the stairs appear and you can walk barefoot into the shallows without leaving the villa. The rooms are simple and cool, built for sandy feet and wet towels.",
      amenities: [
        "Private tide steps",
        "Queen bed",
        "Sea terrace",
        "Outdoor shower",
        "Daily breakfast",
      ],
      images: [
        {
          src: "/images/orilla-shore.jpg",
          alt: "Calm shallow water along the cove shore",
        },
      ],
    },
    {
      id: "dining-house",
      name: "Dining House",
      line: "One long table for the cove.",
      materials: "Stone · linen · candlelight",
      aspect: "south",
      image: "/images/orilla-dining.jpg",
      alt: "Open-air dining terrace overlooking the sea at blue hour",
      description:
        "Dining House is the largest villa, built around the long table where the cove gathers for dinner. Guests staying here host the evening: the kitchen sets the table on the terrace and the candles are lit at dusk. Two bedrooms open onto the same terrace.",
      amenities: [
        "Two bedrooms",
        "Private dining terrace",
        "Chef’s kitchen access",
        "Sea terrace",
        "Daily breakfast",
      ],
      images: [
        {
          src: "/images/orilla-villa-interior.jpg",
          alt: "Bedroom with linen bedding and a window onto the sea",
        },
      ],
    },
    {
      id: "bath-house",
      name: "Bath House",
      line: "Steam, stone, and a sea window.",
      materials: "Travertine · bronze · linen",
      aspect: "west",
      image: "/images/orilla-bath.jpg",
      alt: "Travertine bathroom with bronze fixtures and a sea window",
      description:
        "Bath House puts the bathroom at the centre of the stay. A deep stone bath sits under a wide window onto the sea, beside a steam room cut into the cliff. The bedroom is small and calm, with the best western light in the evening.",
      amenities: [
        "Stone soaking bath",
        "Steam room",
        "King bed",
        "Sea window",
        "Daily breakfast",
      ],
      images: [
        {
          src: "/images/orilla-shore.jpg",
          alt: "Quiet shore between pale limestone cliffs",
        },
      ],
    },
    {
      id: "north-cut",
      name: "North Cut",
      line: "Shade all afternoon, stars at night.",
      materials: "Limestone · linen · teak",
      aspect: "north",
      image: "/images/orilla-shore.jpg",
      alt: "Calm cove shore between limestone cliffs",
      description:
        "North Cut sits in the shade of the cliff and stays cool all afternoon. With no lights on the headland behind it, the night sky is very clear from the terrace. It suits guests who prefer shade and stillness to sun.",
      amenities: [
        "Shaded terrace",
        "King bed",
        "Stargazing deck",
        "Rain shower",
        "Daily breakfast",
      ],
      images: [
        {
          src: "/images/orilla-cliff-portrait.jpg",
          alt: "Carved limestone openings above the water",
        },
      ],
    },
    {
      id: "mid-terrace",
      name: "Mid Terrace",
      line: "Halfway up the cliff, wind and water.",
      materials: "Stone · bronze · linen",
      aspect: "south",
      image: "/images/orilla-aerial.jpg",
      alt: "Aerial view of limestone cove and cliff villas",
      description:
        "Mid Terrace is set halfway up the cliff, with a view of both the cove and the open sea. Wind moves through the rooms on most days, and the terrace holds the afternoon sun. A path of stone steps connects it to the water below.",
      amenities: [
        "Panoramic terrace",
        "King bed",
        "Plunge pool",
        "Cliff path to the cove",
        "Daily breakfast",
      ],
      images: [
        {
          src: "/images/orilla-pool.jpg",
          alt: "Plunge pool above the cove at dusk",
        },
      ],
    },
    {
      id: "last-light",
      name: "Last Light",
      line: "The final villa before the point.",
      materials: "Walnut · travertine · bronze",
      aspect: "west",
      image: "/images/orilla-hero.jpg",
      alt: "Golden hour light on the limestone cove",
      description:
        "Last Light is the final villa before the point, set apart from the others. It keeps the sun the longest, and the terrace is private on three sides. Walnut and travertine give the rooms a warm, quiet feel after dark.",
      amenities: [
        "Private terrace",
        "King bed",
        "Plunge pool",
        "Sunset view",
        "Daily breakfast",
      ],
      images: [
        {
          src: "/images/orilla-dining.jpg",
          alt: "Dining terrace above the bay at blue hour",
        },
      ],
    },
  ],
  rhythm: {
    title: "The day follows water",
    lead: "PML Privilege Resort does not run on spa slots. The cove sets the order.",
    steps: [
      {
        verb: "Arrive",
        text: "The launch crosses the bay in eighteen minutes. Bags go ahead; you walk the last cut of stone barefoot if the tide allows.",
      },
      {
        verb: "Wait",
        text: "High water holds the path closed. Read, swim from the shelf, watch the colour change on the cliff.",
      },
      {
        verb: "Walk",
        text: "At low tide the limestone stairs appear. Guests follow them into the shallows, the cove’s quiet ritual.",
      },
      {
        verb: "Stay",
        text: "Dusk turns the water bronze. Dinner is one table. Nine villas, never a crowd.",
      },
    ],
  },
  gallery: {
    metaTitle: "Gallery · PML Privilege Resort",
    metaDescription:
      "Limestone, still water, and rooms cut for shade — views of the PML Privilege Resort cove.",
    eyebrow: "The cove",
    title: "Stone, water, quiet",
    description:
      "Limestone, still water, and rooms cut for shade — six views of the same calm.",
    images: [
      {
        id: "01",
        src: "/images/orilla-aerial.jpg",
        alt: "Aerial view of a limestone cove with villas along the cliffs",
        caption: "Cliffside villas",
        aspect: "landscape",
        span: { cols: 8, rows: 2 },
      },
      {
        id: "02",
        src: "/images/orilla-bath.jpg",
        alt: "Stone bath with a sea window",
        caption: "Stone bath",
        aspect: "landscape",
        span: { cols: 4, rows: 1 },
      },
      {
        id: "03",
        src: "/images/orilla-tide-steps.jpg",
        alt: "Tide steps into clear water",
        caption: "Tide steps",
        aspect: "landscape",
        span: { cols: 4, rows: 1 },
      },
      {
        id: "04",
        src: "/images/orilla-villa-interior.jpg",
        alt: "Quiet villa interior with sea light",
        caption: "Quiet interiors",
        aspect: "portrait",
        span: { cols: 4, rows: 1 },
      },
      {
        id: "05",
        src: "/images/orilla-pool.jpg",
        alt: "Cliff plunge pool at dusk",
        caption: "Cliff pool",
        aspect: "landscape",
        span: { cols: 5, rows: 1 },
      },
      {
        id: "06",
        src: "/images/orilla-dining.jpg",
        alt: "Evening dining terrace above the bay",
        caption: "Evening terrace",
        aspect: "portrait",
        span: { cols: 3, rows: 1 },
      },
    ],
  },
  about: {
    title: "Nine villas. One cove.",
    lead: "PML Privilege Resort is a private stay, not a hotel wing. Day guests are not received. The kitchen, the launch, and the path into the bay exist for the people sleeping in the stone.",
    facts: [
      { label: "Villas", value: "Nine" },
      { label: "Boat", value: "18 min" },
      { label: "Season", value: "Apr–Oct" },
      { label: "From", value: "€680 / night" },
    ],
    image: {
      src: "/images/orilla-aerial.jpg",
      alt: "Wide view of the limestone cove and cliffside villas",
    },
    tile: {
      src: "/images/orilla-cliff-portrait.jpg",
      alt: "Close view of carved limestone openings above the water",
    },
  },
  tides: [
    {
      id: "morning",
      label: "Morning",
      hours: "06:00–10:00",
      path: "Low path open. Stairs clear for a quiet swim.",
      light: "East-facing villas catch first light on the water.",
      recommend: ["East Cut", "Low Path"],
      image: "/images/orilla-shore.jpg",
    },
    {
      id: "noon",
      label: "Noon",
      hours: "11:00–15:00",
      path: "High water. Swim from the shelf; path closed.",
      light: "South terraces hold shade under the cliff lip.",
      recommend: ["The Shelf", "Dining House"],
      image: "/images/orilla-pool.jpg",
    },
    {
      id: "dusk",
      label: "Dusk",
      hours: "17:30–20:00",
      path: "Tide falling. Path returns for the bronze swim.",
      light: "West ledges turn warm; water takes the bronze cast.",
      recommend: ["High Ledge", "Bath House"],
      image: "/images/orilla-dining.jpg",
    },
    {
      id: "night",
      label: "Night",
      hours: "21:00–00:00",
      path: "Path lit by low bronze markers along the stone.",
      light: "Interior lamps only. The cove goes dark and still.",
      recommend: ["Bath House", "Dining House"],
      image: "/images/orilla-villa-interior.jpg",
    },
  ],
  faq: {
    title: "Before you come",
    facts: [
      "PML Privilege Resort, Costa Blanca",
      "Launch from the harbour, 18 minutes",
      "Adults preferred · children by arrangement",
    ],
    items: [
      {
        q: "How do we arrive?",
        a: "We meet you at the harbour. The launch is timed to weather and tide. Cars stay on the mainland.",
      },
      {
        q: "Can we visit for a meal only?",
        a: "No. PML Privilege Resort is reserved for overnight guests so the cove stays quiet.",
      },
      {
        q: "What is included?",
        a: "Villa, daily housekeeping, breakfast, the launch, and access to the tide path when the water allows.",
      },
      {
        q: "When is the path open?",
        a: "Roughly around low tide, twice a day. Exact times are posted each morning at the shelf.",
      },
      {
        q: "Is there a minimum stay?",
        a: "The booking form requires two nights. In high season, roughly July and August, we prefer three — email us if you need fewer than that and we will say whether the cove can take the dates.",
      },
      {
        q: "Is this a real property?",
        a: "PML Privilege Resort is a design concept for this site. Imagery is generated for the brief; booking runs in test/demo payment mode until live inventory is connected.",
      },
    ],
    imageTall: {
      src: "/images/orilla-cliff-portrait.jpg",
      alt: "Tall view of limestone cliff architecture above the sea",
    },
    imageSquare: {
      src: "/images/orilla-tide-steps.jpg",
      alt: "Stone steps into shallow water at low tide",
    },
  },
  cta: {
    title: "Hold a few nights",
    body: "Choose a villa, then your dates, and pay in full to confirm the stay. Holds last fifteen minutes.",
    button: "Choose your villa",
    href: "/rooms",
    image: {
      src: "/images/orilla-hero.jpg",
      alt: "Limestone cove at golden hour with calm water between cliffs",
    },
  },
  contact: {
    title: "Plan a stay",
    image: {
      src: "/images/orilla-pool.jpg",
      alt: "Cliffside pool overlooking the cove",
    },
  },
  rooms: {
    metaTitle: "Villas · PML Privilege Resort",
    metaDescription:
      "Nine limestone villas on a private cove. Browse each villa, then check dates and book.",
    title: "Nine villas",
    lead: "Each villa faces a different cut of the cove. Choose one, then pick your dates.",
    viewVilla: "View villa",
    bookThis: "Book this villa",
    changeVilla: "Change villa",
    chooseVillaFirst:
      "Start by choosing a villa. You can also pick one from the list below.",
    browseRooms: "Browse villas",
    backToRooms: "All villas",
    fromRate: "From",
    perNight: "night",
    rateOnRequest: "Rate shown at booking",
    maxGuests: "Up to {max} guests",
    guestsLabel: "Guests",
    amenitiesTitle: "In the villa",
    materialsTitle: "Materials",
    stayTitle: "The stay",
    aspectFacing: "Faces {aspect}",
    aspectEast: "east light",
    aspectWest: "west light",
    aspectSouth: "south light",
    aspectNorth: "north shade",
    coveTitle: "Below the terrace",
    coveLead:
      "The same water every villa shares — calm in the morning, bronze at dusk.",
    coveClipAlt: "Ocean waves on the Costa Blanca coast",
    relatedTitle: "Same cut of light",
    relatedLead: "Other villas that catch this aspect of the cove.",
    closeTitle: "Hold these nights",
    closeBody: "Check dates for {name}. One villa, clear nights, full payment.",
    soldOutTitle: "These dates are taken",
    soldOutBody:
      "Leave a note and we will write back with the nearest open nights for this villa, or another villa that suits.",
    enquiryName: "Full name",
    enquiryEmail: "Email",
    enquiryMessage: "Message (optional)",
    enquirySubmit: "Send enquiry",
    enquirySending: "Sending…",
    enquirySuccess: "Thank you. We will reply by email shortly.",
    enquiryError: "Could not send your enquiry. Please try again or email us.",
  },
  booking: {
    metaTitle: "Book a stay · PML Privilege Resort",
    metaDescription:
      "Check villa availability, hold dates, and pay securely for your PML Privilege Resort stay.",
    title: "Book your nights",
    lead: "One villa, clear dates, full payment. The cove stays quiet because we never overbook.",
    fields: {
      villa: "Villa",
      checkIn: "Check-in",
      checkOut: "Check-out",
      guests: "Guests",
      name: "Full name",
      email: "Email",
      phone: "Phone (optional)",
    },
    night: "night",
    maxGuests: "Up to {max} guests",
    summaryTitle: "Stay total",
    summaryHint: "Pick dates to see the full-stay price.",
    nightsLabel: "{n} nights · full stay",
    fullStayNote:
      "Payment covers the full stay. No deposit-only option in this MVP.",
    holdNote:
      "A successful hold keeps the villa for {minutes} minutes while you pay.",
    minStayNote:
      "At least two nights. In high season we prefer three — the stay policies explain how to ask.",
    termsLead: "I have read and agree to the",
    termsLink: "stay policies",
    checking: "Checking availability…",
    loadingVillas: "Loading villas…",
    selectedVilla: "Your villa",
    selectPlaceholder: "Select a villa",
    payCta: "Hold & pay",
    holding: "Creating hold…",
    redirecting: "Redirecting to payment…",
    backHome: "Back to PML Privilege Resort",
    tryAgain: "Try booking again",
    cancelledNotice:
      "Payment was cancelled. Your hold may still be active — you can try again.",
    errors: {
      loadVillas: "Could not load villas.",
      dbHint:
        "Check BOOKING_STORE / DATABASE_URL. For Postgres: docker compose up -d, then npm run db:migrate && npm run db:seed.",
      availability: "Could not check availability.",
      pickVilla: "Choose a villa.",
      unavailable: "Those dates are not available.",
      tooManyGuests: "This villa allows up to {max} guests.",
      create: "Could not create the reservation.",
      pay: "Could not start payment.",
      missingReservation: "Missing reservation reference.",
      loadReservation: "Could not load reservation.",
      invalidDates: "Invalid check-in or check-out date.",
      pastCheckIn: "Check-in must be today or later.",
      minStay: "Minimum stay is {n} nights.",
      acceptTerms: "Please accept the stay policies before paying.",
    },
    success: {
      metaTitle: "Booking confirmation · PML Privilege Resort",
      loading: "Confirming your stay…",
      paidEyebrow: "Confirmed",
      paidTitle: "You’re booked",
      paidBody:
        "Payment received. Keep this reference for arrival and the harbour launch.",
      pendingEyebrow: "Pending",
      pendingTitle: "Payment not confirmed yet",
      pendingBody:
        "If you just paid, wait a moment and refresh. Otherwise start a new booking.",
      mockNote: "Demo payment mode — no real charge was made.",
      reference: "Reference",
    },
  },
  policies: {
    metaTitle: "Stay policies · PML Privilege Resort",
    metaDescription:
      "Minimum nights, full payment, holds, changes, and arrival times for a stay at PML Privilege Resort.",
    title: "Stay policies",
    lead: "What the booking form enforces, and how to change a stay after you have paid.",
    sections: [
      {
        title: "Minimum stay",
        body: "The form accepts two nights or more. In high season, roughly July and August, we prefer three nights. If you need fewer than three in those months, email {email} and we will say whether the cove can take the dates. Fewer than two nights cannot be booked online.",
      },
      {
        title: "Payment",
        body: "You pay for the full stay to confirm. There is no deposit-only option. After you submit, we hold the villa for fifteen minutes while payment completes. If you leave checkout, that hold may stay active until it expires.",
      },
      {
        title: "Cancellation and changes",
        body: "There is no self-serve cancellation. To change dates or ask about a refund after payment, email {email}. We reply in person; the site does not refund automatically. Leaving checkout before payment does not confirm the stay.",
      },
      {
        title: "Arrival and departure",
        body: "Arrivals are between 15:00 and 19:00. Departures are before 11:00. We meet you at the harbour; the launch takes about eighteen minutes and runs with weather and tide. Cars stay on the mainland.",
      },
    ],
  },
  privacy: {
    metaTitle: "Privacy · PML Privilege Resort",
    metaDescription:
      "What PML Privilege Resort collects when you enquire or book, and who receives it.",
    title: "Privacy",
    lead: "We collect only what we need to hold a villa and meet you at the harbour.",
    sections: [
      {
        title: "What we collect",
        body: "When you book or send an enquiry we store your name, email, phone if you give one, the villa, dates, and guest count. Payment is handled by our payment provider. We do not store card numbers on this site.",
      },
      {
        title: "Why",
        body: "To check availability, confirm the stay, time the launch, and reply if the dates are taken. Enquiry messages are read by the resort desk.",
      },
      {
        title: "Who sees it",
        body: "PML Privilege Resort staff who run reservations, and the payment provider that processes the charge. We do not sell guest details.",
      },
      {
        title: "How long, and how to ask",
        body: "We keep reservation records for the stay and for accounting. To ask what we hold about you, or to correct it, email {email}.",
      },
    ],
  },
  credits: [
    {
      title: "PML Privilege Resort cove hero",
      note: "Generated for this concept",
    },
    {
      title: "Villa, pool, dining, bath, aerial, shore, tide steps",
      note: "Generated imagery for the PML Privilege Resort brief",
    },
  ],
};

export default en;
