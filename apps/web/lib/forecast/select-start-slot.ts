import { toLondonHour } from "./london-time";
import type { ForecastSlot } from "./to-forecast-days";

export const MORNING_HOUR = 7;

/**
 * Picks the slot covering 07:00 London, so six-hourly days open at their 06:00
 * block rather than at midnight. Falls back to the first slot when the day ends
 * before the morning, which happens at the truncated tail of the MET window.
 */
export const selectStartSlotIndex = (slots: ForecastSlot[]): number =>
  Math.max(
    slots.findIndex(
      (slot) => toLondonHour(slot.time) + slot.span > MORNING_HOUR,
    ),
    0,
  );
