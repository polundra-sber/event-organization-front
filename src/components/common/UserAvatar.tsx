export function getInitials(name?: string | null, surname?: string | null): string {
  const firstInitial = name?.charAt(0).toUpperCase() || "?";
  const lastInitial = surname?.charAt(0).toUpperCase() || "?";
  return `${firstInitial}.${lastInitial}.`;
}
