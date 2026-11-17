/**
 * search.js — Fuzzy search utility for FixMate.
 * Addresses HomeGenie Issue #3: search only matched exact categories,
 * not vague terms like "ac cleaning".
 *
 * This utility tokenizes the query and matches against service name,
 * category, description, and tags — giving partial/fuzzy matches.
 */

/**
 * Normalises a string for search comparison.
 */
function normalise(str) {
  return str.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
}

/**
 * Checks if `text` contains `token` as a substring.
 */
function containsToken(text, token) {
  return normalise(text).includes(token);
}

/**
 * Searches services using fuzzy/token-based matching.
 * Each query word is checked against name, category, description, tags.
 * A service matches if ALL query tokens match at least one field.
 *
 * @param {Array} services — full list of service objects
 * @param {string} query — user's search string
 * @returns {Array} — matching services, sorted by relevance score
 */
export function searchServices(services, query) {
  if (!query || !query.trim()) return services;

  const tokens = normalise(query).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return services;

  const scored = services
    .map((service) => {
      let score = 0;
      let allTokensMatch = true;

      for (const token of tokens) {
        let tokenFound = false;

        // Name match (highest weight)
        if (containsToken(service.name, token)) {
          score += 10;
          tokenFound = true;
        }
        // Category match
        if (containsToken(service.category, token)) {
          score += 8;
          tokenFound = true;
        }
        // Tag match
        if (service.tags && service.tags.some((tag) => containsToken(tag, token))) {
          score += 6;
          tokenFound = true;
        }
        // Description match
        if (containsToken(service.description, token)) {
          score += 3;
          tokenFound = true;
        }
        // Short description match
        if (service.shortDescription && containsToken(service.shortDescription, token)) {
          score += 4;
          tokenFound = true;
        }

        if (!tokenFound) {
          allTokensMatch = false;
        }
      }

      return { service, score, allTokensMatch };
    })
    .filter((item) => {
      // If multi-word query, require all tokens to match.
      // If single word, any match is fine.
      if (tokens.length === 1) return item.score > 0;
      return item.allTokensMatch;
    })
    .sort((a, b) => b.score - a.score);

  return scored.map((item) => item.service);
}
