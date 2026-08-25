// JungleX handles are shown as "City{N}" — e.g. City1, City2 — rather than
// a bare "#N". Ties the system-assigned identifier into the platform's
// city/civilization framing instead of reading as a generic serial number.
// The underlying data is still just an integer (profiles.handle_number);
// this is purely a display/routing convention on top of it.

// Display text — shown to people, safe anywhere in the UI.
export const formatHandle = (handleNumber: number): string => `@City${handleNumber}`;

// URL path segment — used in links and routes. Kept symbol-free even
// though '@' (unlike '#') is technically safe in a URL path — no need to
// carry the symbol into routing when the plain form already works.
export const handleToPath = (handleNumber: number): string => `City${handleNumber}`;

// Parses a route param like "City1" or "city1" (and tolerates a leading
// '@' if one somehow ends up there) back into its numeric handle number.
export const parseHandleParam = (param: string | undefined): number | null => {
  if (!param) return null;
  const match = param.match(/^@?city(\d+)$/i);
  if (!match) return null;
  return Number(match[1]);
};
