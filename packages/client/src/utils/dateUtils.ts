export default function simplifyDate(dateString: string): string {
  const date = new Date(dateString);

  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');

  let result = '';

  if (isToday(date)) {
    result = `сегодня`;
  } else {
    result =
      ('0' + date.getDate()).slice(-2) + '.' + ('0' + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear();
  }

  return result + ' в ' + hours + ':' + minutes;
}

function isToday(date: Date) {
  const today = new Date();

  return (
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate()
  );
}
