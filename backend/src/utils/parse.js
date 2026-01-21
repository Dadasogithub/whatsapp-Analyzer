const isValidLine = (line) =>
  /^\d{1,2}\/\d{1,2}\/\d{2,4}/.test(line);

const extractDate = (line) => line.split(",")[0].trim();

const extractUser = (line) => {
  const parts = line.split(" - ");
  if (parts.length < 2) return null;
  return parts[1].split(":")[0]?.trim();
};

const parseDate = (dateStr) => {
  const [d, m, y] = dateStr.split("/").map(Number);
  return new Date(y, m - 1, d);
};

module.exports = {
  isValidLine,
  extractDate,
  extractUser,
  parseDate,
};
