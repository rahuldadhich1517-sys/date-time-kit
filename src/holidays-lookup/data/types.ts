export interface Holiday {
  date: string;
  name: string;
  country: string;
  type?: "public" | "national" | "bank" | "observance";
}

export type HolidayCountry = "IN" | "US" | "GB" | "CA" | "AU";
