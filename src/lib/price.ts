export type PriceFormatOptions = {
  from?: boolean; // prefix with "from"
  max?: number;   // when provided, shows a range amount–max
  currency?: string; // ISO 4217 currency code, defaults to USD
  locale?: string;   // BCP 47 locale, defaults to en-US
};

export function formatCurrency(amount: number, currency = "USD", locale = "en-US") {
  try {
    return new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    // Fallback if Intl fails or unsupported currency
    return `$${Math.round(amount)}`;
  }
}

export function formatPrice(amount: number, opts: PriceFormatOptions = {}) {
  const { from, max, currency = "USD", locale = "en-US" } = opts;
  if (typeof max === "number" && max > amount) {
    return `${formatCurrency(amount, currency, locale)}–${formatCurrency(max, currency, locale)}`;
  }
  const base = formatCurrency(amount, currency, locale);
  return from ? `from ${base}` : base;
}
