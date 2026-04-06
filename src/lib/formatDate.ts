import { format, formatDistanceToNow, differenceInMinutes, differenceInHours, differenceInDays, isThisYear } from "date-fns";
import { vi } from "date-fns/locale";

/**
 * Smart date formatter:
 * - < 1 min  → "vừa xong"
 * - < 1 hour → "X phút trước"
 * - < 24h    → "X giờ trước"
 * - < 7 days → "X ngày trước"
 * - same year → "d MMM" (e.g. "5 thg 4")
 * - older    → "d MMM yyyy"
 */
export function formatDate(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return "—";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return "—";

  const now = new Date();
  const mins = differenceInMinutes(now, date);
  const hours = differenceInHours(now, date);
  const days = differenceInDays(now, date);

  if (mins < 1) return "vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 7) return `${days} ngày trước`;
  if (isThisYear(date)) return format(date, "d MMM", { locale: vi });
  return format(date, "d MMM yyyy", { locale: vi });
}

/** Full datetime, always shown */
export function formatDateFull(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return "—";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return "—";
  return format(date, "HH:mm - dd/MM/yyyy");
}
