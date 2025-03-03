// const express = require("express");
// const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const app = require("./app");

// const app = express();

// app.use(cors());
// app.use(express.json());
app.use("/api/auth", userRoutes); // Authentication routes


app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
