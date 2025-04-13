const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { google } = require('googleapis');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

app.post('/payment-success', async (req, res) => {
  const { name, email, phone, amount } = req.body;
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A:D',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[name, email, phone, amount]]
      }
    });
    res.status(200).send("Registered successfully after payment.");
  } catch (err) {
    console.error("Sheet error:", err);
    res.status(500).send("Error saving to sheet.");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});