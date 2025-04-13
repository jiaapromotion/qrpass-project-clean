const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { google } = require("googleapis");
require("dotenv").config();
const fs = require("fs");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Google Sheets Integration
const credentials = JSON.parse(fs.readFileSync("credentials.json"));
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheets = google.sheets({ version: "v4", auth });

const SPREADSHEET_ID = "1ZnKm2cma8y9k6WMcT1YG3tqCjqq2VBILDEAaCBcyDtA";

app.post("/register", async (req, res) => {
  try {
    const { name, email, phone, amount } = req.body;
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A:D",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[name, email, phone, amount]],
      },
    });
    res.status(200).send("Registered Successfully");
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Something went wrong");
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));