import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  nameid?: string;
  sub?: string;
  [key: string]: any;
}

export function getUserIdFromToken(): string | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    // Standard claim for user ID in .NET is nameid or sub
    return decoded.nameid || decoded.sub || decoded.id || null;
  } catch {
    return null;
  }
}
