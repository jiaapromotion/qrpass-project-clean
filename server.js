const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { google } = require("googleapis");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/register", async (req, res) => {
  try {
    const { name, email, phone, amount } = req.body;

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A:D",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [[name, email, phone, amount]],
      },
    });

    res.status(200).send("Registration successful!");
  } catch (error) {
    console.error("Registration failed:", error.message);
    res.status(500).send("Something went wrong on the server.");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
