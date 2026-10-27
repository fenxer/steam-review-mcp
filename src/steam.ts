const REVIEWS_ENDPOINT =
  "https://api.steampowered.com/IUserReviewsService/GetAppReviews/v1/";
const STORE_ENDPOINT =
  "https://api.steampowered.com/IStoreBrowseService/GetItems/v1/";

export const USER_AGENT = "steam-mcp/1.1";

export const DISPLAY_LANGUAGES = [
  "arabic",
  "bulgarian",
  "schinese",
  "tchinese",
  "czech",
  "danish",
  "dutch",
  "english",
  "finnish",
  "french",
  "german",
  "greek",
  "hungarian",
  "indonesian",
  "italian",
  "japanese",
  "koreana",
  "norwegian",
  "polish",
  "portuguese",
  "brazilian",
  "romanian",
  "russian",
  "spanish",
  "latam",
  "swedish",
  "thai",
  "turkish",
  "ukrainian",
  "vietnamese",
] as const;

export const REVIEW_LANGUAGES = ["all", ...DISPLAY_LANGUAGES] as const;

export const FILTERS = {
  all: 0,
  recent: 1,
  updated: 2,
  funny: 3,
} as const;

export const REVIEW_TYPES = {
  all: 0,
  positive: 1,
  negative: 2,
} as const;

export const PURCHASE_TYPES = {
  steam: 0,
  all: 1,
  non_steam_purchase: 2,
} as const;

export type ReviewLanguage = (typeof REVIEW_LANGUAGES)[number];
export type DisplayLanguage = (typeof DISPLAY_LANGUAGES)[number];
export type ReviewFilter = keyof typeof FILTERS;
export type ReviewType = keyof typeof REVIEW_TYPES;
export type PurchaseType = keyof typeof PURCHASE_TYPES;

export interface ReviewQuery {
  appid: string;
  filter: ReviewFilter;
  language: ReviewLanguage;
  day_range: number;
  cursor: string;
  review_type: ReviewType;
  purchase_type: PurchaseType;
  num_per_page: number;
  display_language: DisplayLanguage;
}

export interface GameReviews {
  success: boolean;
  review_score: number | null;
  review_score_desc: string | null;
  total_positive: number | null;
  total_negative: number | null;
  total_reviews: number | null;
  total_matching: number | null;
  day_range_used: number | null;
  cursor: string | null;
  reviews: string[];
}

export interface GameInfo {
  name: string | null;
  detailed_description: string | null;
}

export interface SteamReviewResult {
  game_reviews: GameReviews;
  game_info: GameInfo;
}

export function parseAppId(appid: string): number {
  if (!/^[1-9]\d*$/.test(appid)) {
    throw new Error(`Invalid Steam app id: ${appid}`);
  }
  const value = Number(appid);
  if (!Number.isSafeInteger(value) || value > 0xffffffff) {
    throw new Error(`Invalid Steam app id: ${appid}`);
  }
  return value;
}

export function cleanReviewText(text: string): string {
  if (!text) return "";

  let cleanText = text.replace(/<\/?[^>]+(>|$)/g, "");
  cleanText = cleanText
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "")
    .replace(/&#39;/g, "")
    .replace(/&nbsp;/g, " ");
  cleanText = cleanText
    .replace(/\r\n/g, "\\n")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\n");
  cleanText = cleanText.replace(/["']/g, "");
  cleanText = cleanText.replace(/\s+/g, " ");
  return cleanText.trim();
}

export function stripBbcode(text: string): string {
  return text
    .replace(/\[url=([^\]]+)\]([\s\S]*?)\[\/url\]/gi, "$2")
    .replace(/\[\/?(?:[a-z0-9*]+)(?:=[^\]]+)?\]/gi, "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function buildReviewsInput(query: ReviewQuery): Record<string, unknown> {
  return {
    appid: parseAppId(query.appid),
    filter: FILTERS[query.filter],
    languages: [query.language],
    day_range: query.day_range,
    cursor: query.cursor,
    review_type: REVIEW_TYPES[query.review_type],
    purchase_type: PURCHASE_TYPES[query.purchase_type],
    num_per_page: query.num_per_page,
    display_language: query.display_language,
  };
}

export function buildStoreInput(query: ReviewQuery): Record<string, unknown> {
  return {
    ids: [{ appid: parseAppId(query.appid) }],
    context: {
      country_code: "US",
      language: query.display_language,
      steam_realm: 1,
    },
    data_request: {
      include_basic_info: true,
      include_full_description: true,
    },
  };
}

function numberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function stringOrNull(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

export function normalizeReviewsPayload(body: unknown): GameReviews {
  if (!body || typeof body !== "object") {
    throw new Error("Steam reviews response was not a JSON object");
  }
  const response = (body as { response?: unknown }).response;
  if (!response || typeof response !== "object") {
    throw new Error("Steam reviews response did not include a response object");
  }
  const payload = response as {
    query_summary?: unknown;
    reviews?: unknown;
    cursor?: unknown;
    day_range_used?: unknown;
    total_matching?: unknown;
  };
  const summary =
    payload.query_summary && typeof payload.query_summary === "object"
      ? (payload.query_summary as Record<string, unknown>)
      : null;
  const reviews = Array.isArray(payload.reviews) ? payload.reviews : [];

  return {
    success: true,
    review_score: numberOrNull(summary?.review_score),
    review_score_desc: stringOrNull(summary?.review_score_desc),
    total_positive: numberOrNull(summary?.total_positive),
    total_negative: numberOrNull(summary?.total_negative),
    total_reviews: numberOrNull(summary?.total_reviews),
    total_matching: numberOrNull(payload.total_matching),
    day_range_used: numberOrNull(payload.day_range_used),
    cursor: stringOrNull(payload.cursor),
    reviews: reviews.map((review) => {
      const text =
        review && typeof review === "object"
          ? (review as { review?: unknown }).review
          : "";
      return cleanReviewText(typeof text === "string" ? text : "");
    }),
  };
}

export function normalizeStorePayload(body: unknown): GameInfo {
  if (!body || typeof body !== "object") {
    throw new Error("Steam store response was not a JSON object");
  }
  const response = (body as { response?: unknown }).response;
  const items =
    response && typeof response === "object"
      ? (response as { store_items?: unknown }).store_items
      : undefined;
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Steam store response did not include the app");
  }
  const item = items[0] as {
    success?: unknown;
    name?: unknown;
    full_description_bbcode?: unknown;
    basic_info?: { short_description?: unknown };
  };
  if (item.success !== 1) {
    throw new Error("Steam store item lookup failed");
  }
  const description = stripBbcode(
    typeof item.full_description_bbcode === "string"
      ? item.full_description_bbcode
      : "",
  );
  const shortDescription =
    typeof item.basic_info?.short_description === "string"
      ? item.basic_info.short_description.trim()
      : "";

  return {
    name: stringOrNull(item.name),
    detailed_description: description || shortDescription || null,
  };
}

async function steamGet(
  endpoint: string,
  input: Record<string, unknown>,
  apiKey: string | undefined,
  fetchImpl: typeof fetch,
): Promise<unknown> {
  const url = new URL(endpoint);
  url.searchParams.set("input_json", JSON.stringify(input));
  if (apiKey) url.searchParams.set("key", apiKey);

  let response: Response;
  try {
    response = await fetchImpl(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/json",
      },
    });
  } catch (error) {
    const cause =
      error && typeof error === "object" && "cause" in error ? error.cause : undefined;
    const code =
      cause && typeof cause === "object" && "code" in cause && typeof cause.code === "string"
        ? ` (${cause.code})`
        : "";
    throw new Error(`Steam API request failed before a response was received${code}`);
  }

  if (response.status === 429) {
    throw new Error("Steam API rate limited the request (HTTP 429)");
  }
  if (!response.ok) {
    throw new Error(`Steam API request failed (HTTP ${response.status})`);
  }

  const text = await response.text();
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error("Steam API returned non-JSON");
  }
}

export async function fetchSteamReview(
  query: ReviewQuery,
  options: { fetchImpl?: typeof fetch; apiKey?: string } = {},
): Promise<SteamReviewResult> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const apiKey = options.apiKey?.trim() || undefined;
  const [reviewsBody, storeBody] = await Promise.all([
    steamGet(REVIEWS_ENDPOINT, buildReviewsInput(query), apiKey, fetchImpl),
    steamGet(STORE_ENDPOINT, buildStoreInput(query), apiKey, fetchImpl),
  ]);

  return {
    game_reviews: normalizeReviewsPayload(reviewsBody),
    game_info: normalizeStorePayload(storeBody),
  };
}
