const fs = require("fs/promises");
const {
  isValidLine,
  extractDate,
  extractUser,
  parseDate,
} = require("../utils/parse");

exports.uploadChat = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Chat file missing" });
  }

  try {
    const content = await fs.readFile(req.file.path, "utf-8");
    await fs.unlink(req.file.path); // cleanup

    const lines = content.split("\n");

    const datesSet = new Set();
    lines.forEach((line) => {
      if (isValidLine(line)) {
        datesSet.add(extractDate(line));
      }
    });

    const last7Days = [...datesSet]
      .sort((a, b) => parseDate(b) - parseDate(a))
      .slice(0, 7)
      .reverse();

    const joined = {};
    const active = {};

    last7Days.forEach((d) => {
      joined[d] = new Set();
      active[d] = new Set();
    });

    lines.forEach((line) => {
      if (!isValidLine(line)) return;

      const date = extractDate(line);
      const user = extractUser(line);

      if (!last7Days.includes(date) || !user) return;

      if (line.includes("joined using")) {
        joined[date].add(user);
      } else {
        active[date].add(user);
      }
    });

    const userDayCount = {};
    last7Days.forEach((day) => {
      active[day].forEach((user) => {
        userDayCount[user] = (userDayCount[user] || 0) + 1;
      });
    });

    const activeUsersAtLeast4Days = Object.keys(userDayCount).filter(
      (u) => userDayCount[u] >= 4
    );

    res.json({
      dates: last7Days,
      joined: last7Days.map((d) => joined[d].size),
      active: last7Days.map((d) => active[d].size),
      activeUsersAtLeast4Days,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to process chat file" });
  }
};
