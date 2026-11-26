export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function pad(n: number, size = 2) {
  return String(n).padStart(size, "0");
}
