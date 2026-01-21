const express = require("express");
const cors = require("cors");
const uploadRoutes = require("./src/routes/uploadRoutes");

const app = express();
app.use(cors());

app.use(express.json());

app.use("/upload", uploadRoutes);


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

/* ---------- SERVER ---------- */
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
