import dayjs from "dayjs";

export function fullDateFormat(date: string | Date) {
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
}

export function moneyFormat(num: string) {
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
  }).format(Number(num));
}
