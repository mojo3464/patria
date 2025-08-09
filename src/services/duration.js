export function getDuration(from, to) {
  const [fromH, fromM] = from.split(":").map(Number);
  const [toH, toM] = to.split(":").map(Number);

  let start = fromH * 60 + fromM;
  let end = toH * 60 + toM;

  // If shift ends next day
  if (end < start) end += 24 * 60;

  const totalMinutes = end - start;
  const hours = Math.floor(totalMinutes / 60);

  return hours;
}
export function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0"); // Ensures 2 digits
  const minutes = now.getMinutes().toString().padStart(2, "0"); // Ensures 2 digits
  return `${hours}:${minutes}`;
}
