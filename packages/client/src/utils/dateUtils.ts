export default function simplifyDate(dateString: string): string {
  const date = new Date(dateString);
  const diff = (+new Date() - +date) / 1000;
  console.log('date: ', date);

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
  const seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  minutes = minutes % 60;

  if (hours === 0 && minutes === 0) {
    minutes = 1;
  }

  return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}`;
};
