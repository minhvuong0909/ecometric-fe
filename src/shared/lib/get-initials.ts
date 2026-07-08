/** Derives up to 2 uppercase initials from a name or email string. */
export function getInitials(source: string | null | undefined): string {
  const value = (source ?? "").trim();
  if (!value) return "EM";
  const parts = value.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return value.slice(0, 2).toUpperCase();
}
