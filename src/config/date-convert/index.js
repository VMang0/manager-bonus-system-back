export const dateConvert = (dateStr) => {
  const date = new Date(dateStr);
  const offset = date.getTimezoneOffset();
  const localTime = date.getTime() - offset * 60 * 1000;
  const localDate = new Date(localTime);
  return localDate.toISOString();
};

export const dateEndConvert = (dateStr) => {
  const date = new Date(dateStr);
  date.setHours(23, 59, 59, 999);
  const offset = date.getTimezoneOffset();
  const localTime = date.getTime() - offset * 60 * 1000;
  const localDate = new Date(localTime);
  return localDate.toISOString();
};

