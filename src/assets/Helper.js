export const issueDescriptions = {
  ERROR_TIMEOUT:
    "The request to the server timed out, indicating performance or connectivity issues.",
  ERROR_SLOW_TTFB:
    "The server took too long to respond with the first byte, affecting site speed.",
  ERROR_NOT_VALID_HEADINGS:
    "Heading tags (H1, H2, etc.) are misused or not in proper order.",
  ERROR_LONG_DESCRIPTION:
    "The meta description is too long, which may affect search snippet display.",
  ERROR_LONG_TITLE:
    "The page title is too long, possibly truncated in search results.",
  NON_CANONICAL_IN_SITEMAP:
    "Non-canonical URLs are listed in the sitemap, causing SEO issues.",
  ERROR_IMAGES_NO_ALT:
    "Images are missing ALT text, which reduces accessibility and SEO value.",
  ERROR_SHORT_DESCRIPTION:
    "The meta description is too short and lacks meaningful information.",
  ERROR_LONG_ALT_TEXT:
    "ALT attributes are too long, which may appear spammy to search engines.",
  ERROR_MULTIPLE_SLASHES:
    "URLs contain multiple consecutive slashes, which may cause duplicate content issues.",
  ERROR_UNDERSCORE_URL:
    "URLs contain underscores instead of hyphens, which is not SEO-friendly.",
  ERROR_TOO_MANY_LINKS:
    "Page contains too many links, which may dilute link equity.",
  ERROR_IMG_SIZE_ATTR:
    "Image tags are missing width/height attributes, causing layout shifts.",
  ERROR_EXTERNAL_WITHOUT_NOFOLLOW:
    "External links lack 'nofollow' attribute, passing unwanted link equity.",
  ERROR_MISSING_CSP:
    "Missing Content Security Policy (CSP), exposing the site to security risks.",
  ERROR_CONTENT_TYPE_OPTIONS:
    "Missing X-Content-Type-Options header, increasing vulnerability to MIME sniffing.",
  ERROR_EXTERNAL_LINK_REDIRECT:
    "External links redirect instead of pointing directly to target content.",
  ERROR_EXTERNAL_LINK_BROKEN: "External links are broken and return errors.",
  ERROR_DUPLICATED_ID:
    "HTML elements have duplicate IDs, which can break scripts and accessibility.",
  ERROR_LARGE_IMAGE: "Page contains large images that may slow down loading.",
  ERROR_PAGE_DEPTH:
    "Page is too deep in site structure, making it harder to crawl and index.",
  ERROR_MISSING_HSTS:
    "Missing HTTP Strict Transport Security (HSTS) header, weakening HTTPS security.",
  ERROR_DOM_SIZE: "The DOM tree is too large, causing performance issues.",
  ERROR_ORPHAN:
    "Orphan pages are not linked internally, making them hard to discover.",
  ERROR_INCORRECT_MEDIA_TYPE:
    "Incorrect media type declared in headers or content.",

  // Passed Issues (still useful descriptions)
  BLOCKED_IN_SITEMAP:
    "Pages blocked by robots.txt are still present in sitemap.",
  DEAD_END:
    "Page has no internal links pointing outward (dead end for crawlers).",
  ERROR_30x: "Page returns a 3xx redirect error.",
  ERROR_40x: "Page returns a client error (4xx status).",
  ERROR_50x: "Page returns a server error (5xx status).",
  ERROR_BLOCKED:
    "Page is blocked from crawling (robots.txt, meta robots, or headers).",
  ERROR_CANONICAL_ERROR:
    "Canonical tag points to an invalid or conflicting URL.",
  ERROR_CANONICAL_MISMATCH: "Canonical tag does not match preferred URL.",
  ERROR_CANONICAL_REDIRECT: "Canonical tag points to a URL that redirects.",
  ERROR_CANONICALIZED_NON_CANONICAL:
    "Page is canonicalized incorrectly to a non-canonical page.",
  ERROR_CANONICALIZED_NON_INDEXABLE:
    "Page is canonicalized to a non-indexable URL.",
  ERROR_DUPLICATED_CONTENT: "Duplicate content detected across multiple pages.",
  ERROR_DUPLICATED_DESCRIPTION:
    "Multiple pages share the same meta description.",
  ERROR_DUPLICATED_TITLE: "Multiple pages share the same title tag.",
  ERROR_EMPTY_DESCRIPTION: "Page has no meta description.",
  ERROR_EMPTY_TITLE: "Page has no title tag.",
  ERROR_HREFLANG_ERROR: "Hreflang implementation contains errors.",
  ERROR_HREFLANG_MISMATCHING_LANG:
    "Hreflang attribute contains mismatching language codes.",
  ERROR_HREFLANG_NO_INDEXABLE: "Hreflang points to non-indexable URLs.",
  ERROR_HREFLANG_REDIRECT: "Hreflang points to URLs that redirect.",
  ERROR_HREFLANG_RELATIVE_URL:
    "Hreflang uses relative URLs instead of absolute.",
  ERROR_HREFLANG_RETURN: "Hreflang links do not have proper return links.",
  ERROR_HREFLANG_SELF_REFERENCE:
    "Hreflang self-reference missing or incorrect.",
  ERROR_HREFLANG_TO_NON_CANONICAL: "Hreflang points to non-canonical URLs.",
  ERROR_HREFLANG_XDEFAULT: "Missing or incorrect x-default hreflang attribute.",
  ERROR_HTTP_FORM: "Form submits over HTTP instead of HTTPS.",
  ERROR_HTTP_LINKS: "Page contains HTTP links instead of HTTPS.",
  ERROR_INSECURE_FORM:
    "Forms are not secure (no HTTPS or missing security attributes).",
  ERROR_INTERNAL_NOFOLLOW:
    "Internal links use 'nofollow', blocking equity flow.",
  ERROR_LITTLE_CONTENT: "Page has too little textual content (thin content).",
  ERROR_LOCALHOST_LINKS: "Page contains links to localhost (development URLs).",
  ERROR_METAS_IN_BODY:
    "Meta tags are placed inside the body instead of the head.",
  ERROR_MISSING_VIEWPORT:
    "Page is missing a viewport meta tag for mobile devices.",
  ERROR_MULTIPLE_CANONICAL_TAGS: "Page contains multiple canonical tags.",
  ERROR_MULTIPLE_DESCRIPTIONS: "Page contains multiple meta descriptions.",
  ERROR_MULTIPLE_LANG_REFERENCE: "Page contains multiple language references.",
  ERROR_MULTIPLE_TITLES: "Page contains multiple title tags.",
  ERROR_NO_H1: "Page is missing an H1 heading.",
  ERROR_NO_INDEXABLE: "Page is not indexable by search engines.",
  ERROR_NO_LANG: "Page is missing a language attribute in the HTML tag.",
  ERROR_NOFOLLOW_INDEXABLE: "Nofollow used incorrectly on indexable pages.",
  ERROR_NOIMAGEINDEX: "Page disallows image indexing.",
  ERROR_NOSNIPPET: "Page disallows text snippets in search results.",
  ERROR_PAGINATION_LINKS: "Pagination links are missing or incorrect.",
  ERROR_PICTURE_MISSONG_IMG: "Picture element is missing an img fallback.",
  ERROR_REDIRECT_CHAIN: "Page is part of a redirect chain.",
  ERROR_REDIRECT_LOOP: "Page is stuck in a redirect loop.",
  ERROR_RELATIVE_CANONICAL_URL:
    "Canonical tag uses relative URL instead of absolute.",
  ERROR_SHORT_TITLE: "Title tag is too short and lacks detail.",
  ERROR_SPACE_URL: "URL contains spaces, which is invalid.",
  HTTP_SCHEME: "Page uses insecure HTTP instead of HTTPS.",
  INCOMING_FOLLOW_NOFOLLOW:
    "Incoming links mix follow and nofollow attributes incorrectly.",
  INVALID_LANG: "Page uses an invalid language code.",
  NO_INDEX_IN_SITEMAP: "Noindex pages are included in the sitemap.",
};

export const issues = {
  CriticalIssues: "Critical Issues",
  AlertIssues: "Alert Issues",
  WarningIssues: "Warning Issues",
  PassedIssues: "Passed Issues",
};
