import { Badge } from "@/components/ui/badge";

export const daysLeftTextBadge = (date: Date) => {
  const days = daysLeft(date);
  if (days === 0) {
    return <Badge variant="default">Today</Badge>;
  }
  if (days === 1) {
    return <Badge variant="secondary">Tomorrow</Badge>;
  }
  if (days < 0) {
    return <Badge variant="destructive">{Math.abs(days)} days ago</Badge>;
  }
  return <Badge variant="outline">{days} days left</Badge>;
};

export const daysLeft = (date: Date) => {
  return Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
};











export function timeSince(startDate: Date, endDate: Date): string {
  // Calculate the difference in milliseconds
  const timeDifference = endDate.getTime() - startDate.getTime();

  // Convert milliseconds to seconds
  const seconds = Math.floor(timeDifference / 1000);

  // Define time intervals in seconds
  const intervals = {
    year: 31536000,
    month: 2592000,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  // Calculate the time passed for each interval
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const intervalCount = Math.floor(seconds / secondsInUnit);
    if (intervalCount >= 1) {
      return `${intervalCount} ${unit}${intervalCount === 1 ? "" : "s"} ago`;
    }
  }

  // If less than a second has passed
  return "Just now";
}


