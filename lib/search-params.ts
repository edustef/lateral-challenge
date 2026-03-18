import { parseAsString, createSearchParamsCache } from 'nuqs/server';

// Parser definitions (shared between client and server)
// shallow: false ensures URL changes trigger a server re-render so getStays() re-fetches
export const searchParamsParsers = {
  type: parseAsString.withOptions({ shallow: false }),
  vibe: parseAsString.withOptions({ shallow: false }),
  search: parseAsString.withOptions({ shallow: false }),
  sort: parseAsString.withOptions({ shallow: false }),
};

// Server-side cache for RSC
export const searchParamsCache = createSearchParamsCache(searchParamsParsers);
