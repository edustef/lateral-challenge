import { parseAsString, createSearchParamsCache } from 'nuqs/server';

// Parser definitions (shared between client and server)
export const searchParamsParsers = {
  type: parseAsString,      // travel type: solo, duo, family, group
  vibe: parseAsString,      // vibe: adventure, culture, disconnect, celebration
  search: parseAsString,    // text search
  sort: parseAsString,      // price-asc, price-desc
};

// Server-side cache for RSC
export const searchParamsCache = createSearchParamsCache(searchParamsParsers);
