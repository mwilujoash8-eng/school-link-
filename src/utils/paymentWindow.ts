/**
 * Official Payment Processing Window Utility for SchoolLink
 * Regulatory Policy: All subscription & official payments must be processed
 * exclusively on Weekends (Saturday - Sunday) between 3:00 PM and 7:30 PM CAT (15:00 - 19:30).
 */

export interface PaymentWindowStatus {
  isWindowOpen: boolean;
  dayName: string;
  currentTimeFormatted: string;
  timeRemainingText?: string;
  nextWindowText: string;
  windowScheduleText: string;
}

export function getPaymentWindowStatus(simulatedDate?: Date): PaymentWindowStatus {
  const now = simulatedDate || new Date();
  const day = now.getDay(); // 0 is Sunday, 6 is Saturday
  const hours = now.getHours();
  const minutes = now.getMinutes();

  const isWeekend = day === 0 || day === 6;
  const currentTotalMinutes = hours * 60 + minutes;
  const startMinutes = 15 * 60; // 3:00 PM -> 15:00 = 900 minutes
  const endMinutes = 19 * 60 + 30; // 7:30 PM -> 19:30 = 1170 minutes

  const isWindowOpen = isWeekend && currentTotalMinutes >= startMinutes && currentTotalMinutes <= endMinutes;

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = daysOfWeek[day];
  const currentTimeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  let timeRemainingText: string | undefined;
  if (isWindowOpen) {
    const diffMins = endMinutes - currentTotalMinutes;
    const remHours = Math.floor(diffMins / 60);
    const remMins = diffMins % 60;
    timeRemainingText = remHours > 0 ? `${remHours}h ${remMins}m remaining today` : `${remMins}m remaining today`;
  }

  let nextWindowText: string;
  if (isWindowOpen) {
    nextWindowText = 'Clearance Gateway is ACTIVE until 7:30 PM CAT today!';
  } else if (day === 6 && currentTotalMinutes < startMinutes) {
    nextWindowText = 'Clearance Gateway opens today (Saturday) at 3:00 PM CAT';
  } else if (day === 0 && currentTotalMinutes < startMinutes) {
    nextWindowText = 'Clearance Gateway opens today (Sunday) at 3:00 PM CAT';
  } else if (day === 6 && currentTotalMinutes > endMinutes) {
    nextWindowText = 'Next clearance window opens tomorrow (Sunday) at 3:00 PM CAT';
  } else {
    nextWindowText = 'Next clearance window opens this Saturday at 3:00 PM CAT';
  }

  return {
    isWindowOpen,
    dayName,
    currentTimeFormatted,
    timeRemainingText,
    nextWindowText,
    windowScheduleText: 'Saturday & Sunday • 3:00 PM – 7:30 PM CAT (15:00 – 19:30)',
  };
}
