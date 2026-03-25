import { DateTime } from "luxon";

export const createId = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

export const currency = new Intl.NumberFormat("es-BO", {
  style: "currency",
  currency: "BOB",
  minimumFractionDigits: 2
});

export const formatDate = (value: string) =>
  DateTime.fromISO(value).setLocale("es-BO").toLocaleString(DateTime.DATE_MED);

export const formatDateTime = (value: string) =>
  DateTime.fromISO(value).setLocale("es-BO").toLocaleString(DateTime.DATETIME_MED);

export const toInputDateTime = (value: string | Date) => {
  const dateTime =
    typeof value === "string" ? DateTime.fromISO(value) : DateTime.fromJSDate(value);

  return dateTime.toFormat("yyyy-LL-dd'T'HH:mm:ss");
};

export const getDefaultPurchaseDateTime = () => {
  return DateTime.local().set({
    hour: 8,
    minute: 0,
    second: 0,
    millisecond: 0
  }).toFormat("yyyy-LL-dd'T'HH:mm:ss");
};

export const inputDateTimeToIso = (value: string) => {
  return DateTime.fromISO(value).set({ millisecond: 0 }).toUTC().toISO() ?? value;
};

export const toMillis = (value: string) => DateTime.fromISO(value).toMillis();

export const sortByIsoDesc = <T>(items: T[], getValue: (item: T) => string) =>
  [...items].sort((left, right) => toMillis(getValue(right)) - toMillis(getValue(left)));

export const splitImageUrls = (value?: string) =>
  (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export const joinImageUrls = (values: string[]) => values.filter(Boolean).join(",");
