/**
 * "A week in Marcus's pocket" - every string and every glyph the before/after
 * section draws.
 *
 * The two artboards are different compositions, not one that reflows: desktop
 * shows ten notifications against five calm cards, mobile shows three against
 * three, and six of those rows are worded differently. So there are four
 * arrays here, not two with a slice. Nothing is derived from anything else -
 * a mobile row that looks like a truncation of its desktop twin is the
 * client's own edit, and deriving it would quietly repair copy we were told
 * not to touch.
 *
 * Apostrophes are U+2019 throughout (RULINGS.md §02 ruling 10). The artboards
 * mix straight and curly; normalising is typographic, not editorial. The three
 * em-dashes are U+2014 with a space either side, exactly as drawn - docs/brand.md
 * bans them in Bramble's own voice, but these are the names trades gave
 * themselves in the client's copy.
 */

/** Which Lucide glyph a row draws. Resolved to a component in `icons.ts`. */
export type PhoneIcon =
  | "message-square"
  | "mail"
  | "message-circle"
  | "phone-missed"
  | "phone"
  | "check"
  | "receipt"
  | "sprout"
  | "hard-hat";

export type Notification = {
  sender: string;
  time: string;
  message: string;
  channel: string;
  /** The icon tile's fill. Channel-coloured, except "Missed call" - see below. */
  tile: string;
  icon: PhoneIcon;
};

export type CalmCard = {
  icon: PhoneIcon;
  title: string;
  sub: string;
  /**
   * The green line at the foot of the card. Text, never a control: it is a
   * depiction of a button inside a depiction of a phone, and rendering it as
   * one would add five inert tab stops. Absent on mobile, where the artboard
   * draws none.
   */
  action?: string;
};

/*
  The three channel tile colours. Rust for SMS, umber for email, and a mid
  bronze for WhatsApp that has no place in the token system - it exists only
  here, so it stays a local constant rather than becoming a token nobody else
  can use (RULINGS.md §02 ruling 5).

  "Missed call" takes the SMS rust rather than a fourth colour of its own.
  That is as drawn.
*/
const TILE_SMS = "#96602B"; // --color-rust
const TILE_EMAIL = "#6E4119"; // --color-umber
const TILE_WHATSAPP = "#8A6A2F";

/** The left phone, desktop: ten notifications, in arrival order. */
export const NOTIFICATIONS: readonly Notification[] = [
  {
    sender: "Sarah Whitcombe",
    time: "11:42 pm",
    message: "Any update on that quote?",
    channel: "SMS",
    tile: TILE_SMS,
    icon: "message-square",
  },
  {
    sender: "Mark Deakin",
    time: "11:44 pm",
    message: "Did you get my email about the paving change?",
    channel: "Email",
    tile: TILE_EMAIL,
    icon: "mail",
  },
  {
    sender: "Jo Harcourt",
    time: "11:51 pm",
    message: "Can you look at the retaining wall this week?",
    channel: "WhatsApp",
    tile: TILE_WHATSAPP,
    icon: "message-circle",
  },
  {
    sender: "Unknown number",
    time: "12:06 am",
    message: "Still waiting on that variation price",
    channel: "SMS",
    tile: TILE_SMS,
    icon: "message-square",
  },
  {
    sender: "Trent — Voltaic Electrical",
    time: "12:11 am",
    message: "Where’s the switchboard? Can’t price the garden lighting without it.",
    channel: "Email",
    tile: TILE_EMAIL,
    icon: "mail",
  },
  {
    sender: "Dan — Stonemason",
    time: "12:14 am",
    message: "Need the paver count before I order",
    channel: "WhatsApp",
    tile: TILE_WHATSAPP,
    icon: "message-circle",
  },
  {
    sender: "Dave — Plumbers Inc",
    time: "12:26 am",
    message: "Price attached for the pool plumbing. Need it back by Tues.",
    channel: "Email",
    tile: TILE_EMAIL,
    icon: "mail",
  },
  {
    sender: "Priya Raman",
    time: "12:31 am",
    message: "Following up again. Is the quote coming?",
    channel: "Email",
    tile: TILE_EMAIL,
    icon: "mail",
  },
  {
    sender: "Kingsley job",
    time: "12:48 am",
    message: "3 missed calls",
    channel: "Missed call",
    tile: TILE_SMS,
    icon: "phone-missed",
  },
  {
    sender: "Tony Alvarez",
    time: "1:02 am",
    message: "Any chance of a price by Friday?",
    channel: "SMS",
    tile: TILE_SMS,
    icon: "message-square",
  },
];

/** The right phone, desktop: five calm cards, in stagger order. */
export const CALM_CARDS: readonly CalmCard[] = [
  {
    icon: "phone",
    title: "Sarah opened your quote three times today",
    sub: "She keeps going back to the paving. Worth a call.",
    action: "Call Sarah",
  },
  {
    icon: "check",
    title: "Variation priced and sent to Mark",
    sub: "Extra bluestone and base. $2,840, from your own rates.",
    action: "Sent 4:12 pm",
  },
  {
    icon: "receipt",
    title: "Ana’s invoice cleared, $21,400",
    sub: "Mosman retaining and steps. Paid overnight, job closed off.",
    action: "View receipt",
  },
  {
    icon: "sprout",
    title: "Jo Harcourt wraps Friday",
    sub: "Get the after shots and ask her for a review while you’re there.",
    action: "Remind me Friday",
  },
  {
    icon: "hard-hat",
    title: "Dave from Plumbers Inc",
    sub: "Pool plumbing Bronte job, $4,180.",
    action: "Review all 3 plumber quotes",
  },
];

/**
 * The left phone, mobile: three notifications.
 *
 * A different three, in a different order, with row 2's message cut short of
 * desktop's. They are deliberately NOT in time order - 12:26 sits above 12:14 -
 * which is how the artboard draws them.
 */
export const NOTIFICATIONS_MOBILE: readonly Notification[] = [
  {
    sender: "Sarah Whitcombe",
    time: "11:42 pm",
    message: "Any update on that quote?",
    channel: "SMS",
    tile: TILE_SMS,
    icon: "message-square",
  },
  {
    sender: "Dave — Plumbers Inc",
    time: "12:26 am",
    message: "Price attached for the pool plumbing.",
    channel: "Email",
    tile: TILE_EMAIL,
    icon: "mail",
  },
  {
    sender: "Dan — Stonemason",
    time: "12:14 am",
    message: "Need the paver count before I order",
    channel: "WhatsApp",
    tile: TILE_WHATSAPP,
    icon: "message-circle",
  },
];

/**
 * The right phone, mobile: three of the desktop five, reordered and retitled.
 *
 * Row 1 drops " today", row 2 gains " sent his price", row 3's sub drops
 * ", job closed off." The Check/variation and Sprout/Jo cards do not appear at
 * all. No action labels on this side.
 */
export const CALM_CARDS_MOBILE: readonly CalmCard[] = [
  {
    icon: "phone",
    title: "Sarah opened your quote three times",
    sub: "She keeps going back to the paving. Worth a call.",
  },
  {
    icon: "hard-hat",
    title: "Dave from Plumbers Inc sent his price",
    sub: "Pool plumbing Bronte job, $4,180.",
  },
  {
    icon: "receipt",
    title: "Ana’s invoice cleared, $21,400",
    sub: "Mosman retaining and steps. Paid overnight.",
  },
];

/**
 * The five unread counts the rust pill crossfades between, in DOM order.
 *
 * [LOG] The count FALLS from 31 to 23 at 11.5s while cards 9 and 10 are still
 * arriving, with nothing dismissed to explain it. That is the client's data,
 * not a bug in the crossfade, so it ships as drawn.
 *
 * `31 unread` is the frame the reduced-motion resting state pins to: it is the
 * peak, it holds longest in the live loop, and it is exactly what the mobile
 * artboard draws statically, so the two breakpoints agree.
 */
export const UNREAD_COUNTS = ["4 unread", "9 unread", "16 unread", "31 unread", "23 unread"] as const;

/** The index of the count above that the reduced-motion frame rests on. */
export const UNREAD_REST_INDEX = 3;

/** Everything outside the two phone frames, which stays fully readable. */
export const COPY = {
  eyebrow: "A week in Marcus’s pocket",
  heading: "You’re on the tools. Bramble’s running the office.",
  /* Mobile drops ", so the job moves forward while you sleep." Both ship. */
  body: "Quoting, chasing, variations, invoices. It all lands on you, at night, after a full day on the tools. Bramble runs the lot from first enquiry to final payment, so the job moves forward while you sleep.",
  bodyMobile:
    "Quoting, chasing, variations, invoices. It all lands on you, at night, after a full day on the tools. Bramble runs the lot from first enquiry to final payment.",
  pillBefore: "Before Bramble",
  pillAfter: "With Bramble",
  /* Four captions, four different strings. None is reused across breakpoints. */
  captionBefore:
    "Everyone wants an answer, and they all want it from you, now. You reply when you can and the quotes wait until Sunday.",
  captionAfter:
    "Bramble priced the variation and managed the contractors’ prices. Marcus opens his phone already knowing who to call first.",
  captionBeforeMobile: "They keep coming, and the quotes wait until Sunday.",
  captionAfterMobile:
    "Marcus opens his phone and already knows where every job is at, and who to call first.",
  greeting: "Morning, Marcus. Here’s your day.",
  clockBefore: "12:06 am",
  clockAfter: "7:05 am",
  badge: "All handled",
} as const;

/**
 * What a screen reader gets instead of the two phones.
 *
 * Each frame is one `role="img"`, so the ~120 words of invented notifications
 * inside it collapse to a sentence (RULINGS.md §05 ruling 7). Serialised they
 * are a 45-second recital of fiction that buries the caption carrying the
 * actual argument - and because the feed is on a 16s loop, a virtual cursor
 * would otherwise read out cards sitting at `max-height: 0`.
 */
export const PHONE_LABELS = {
  before:
    "A phone at 12:06 am showing 31 unread messages — ten SMS, email, WhatsApp and missed-call notifications from clients and trades, every one asking for a price or an update.",
  after:
    "The same phone at 7:05 am with Bramble running — a short, calm list: Sarah has opened your quote three times, the variation is priced and sent, Ana’s invoice has cleared, Jo wraps Friday, and Dave’s plumbing price is in.",
} as const;
