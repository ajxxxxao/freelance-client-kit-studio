export function isRequired(value) {
  return String(value || "").trim().length > 0;
}

export function isValidEmail(value) {
  if (!value) {
    return true;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}

export function isPositiveNumber(value) {
  const number = Number(value);

  return Number.isFinite(number) && number >= 0;
}
