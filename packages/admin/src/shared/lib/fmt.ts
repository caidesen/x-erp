import dayjs from "dayjs";

export function fullDateFormat(date: string | Date) {
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
}
