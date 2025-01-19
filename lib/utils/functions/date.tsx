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
