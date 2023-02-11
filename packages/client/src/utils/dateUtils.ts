const getPaddedDatePart = (part: number) => String(part).padStart(2, '0');

const isToday = (date: Date) => {
  const today = new Date();

  return (
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate()
  );
};

export default function simplifyDate(dateString: string): string {
  const date = new Date(dateString);

  const hours = getPaddedDatePart(date.getHours());
  const minutes = getPaddedDatePart(date.getMinutes());

  const day = getPaddedDatePart(date.getDate());
  const month = getPaddedDatePart(date.getMonth() + 1);
  const year = date.getFullYear();

  const simpleDate = isToday(date) ? `сегодня` : `${day}.${month}.${year}`;

  return `${simpleDate} в ${hours}:${minutes}`;
}
