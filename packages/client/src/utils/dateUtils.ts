export default function simplifyDate(dateString: string): string {
  const date = new Date(dateString);
  const diff = (+new Date() - +date) / 1000;

  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');

  let result = '';

  if (diff > 3600 * 24) {
    const day = date.getDay();
    const month = date.getMonth() - 1;

    result += `${day}.${month} `;
  }

  result += `${hours}:${minutes}`;

  return result;
}
