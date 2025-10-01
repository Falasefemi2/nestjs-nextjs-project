/** @format */

type User = {
  id: number;
  email: string;
  name: string;
  role: string;
};

export const ROLE_ROUTES = {
  admin: "/admin",
  user: "/user",
} as const;

export const getRedirectUrlForUser = (
  user: User & { role?: string }
): string => {
  const rawRoles = user.role;
  if (!rawRoles) return "/";

  const userRoles =
    Array.isArray(rawRoles) ? rawRoles
    : typeof rawRoles === "string" ?
      rawRoles
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean)
    : [];

  const normalizedRoles = userRoles.map((role) => role.toLowerCase());

  const rolePriority = ["admin", "user"];

  for (const role of rolePriority) {
    if (
      normalizedRoles.includes(role) &&
      ROLE_ROUTES[role as keyof typeof ROLE_ROUTES]
    ) {
      return ROLE_ROUTES[role as keyof typeof ROLE_ROUTES];
    }
  }

  return "/";
};
