const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: "./.env" });
const app = express();

const PORT = process.env.PORT || 5000;

const User = require("./routes/User");

app.use(cors());
app.use(express.json());

const URL = process.env.MONGODB_URL;

mongoose
  .connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("connection success");
});

app.use("/api/user", User);

app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
