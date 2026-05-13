export function parseCsv(content: string): string[][] {
  return content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(1)
    .map((line) => line.split(","));
}
