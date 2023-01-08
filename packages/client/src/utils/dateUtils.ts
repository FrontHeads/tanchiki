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

const padTo2Digits = (num: number) => {
  return num.toString().padStart(2, '0');
};

export const convertMsToTime = (milliseconds: number) => {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;

  hours = hours % 24;

  return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
};
