import { parseAsString, parseAsInteger, parseAsArrayOf, createSearchParamsCache } from 'nuqs/server';

export const searchParamsParsers = {
  type: parseAsString.withOptions({ shallow: false }),
  tags: parseAsArrayOf(parseAsString).withOptions({ shallow: false }),
  search: parseAsString.withOptions({ shallow: false }),
  country: parseAsString.withOptions({ shallow: false }),
  sort: parseAsString.withOptions({ shallow: false }),
  stayType: parseAsString.withOptions({ shallow: false }),
  maxPrice: parseAsInteger.withOptions({ shallow: false }),
  amenities: parseAsArrayOf(parseAsString).withOptions({ shallow: false }),
};

export const searchParamsCache = createSearchParamsCache(searchParamsParsers);
