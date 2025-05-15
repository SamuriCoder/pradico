// api/register.js
import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Destructure fields from request body
    const { firstName, lastName, email, phone, reference } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Parse credentials from environment variable
    const CREDENTIALS = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS);
    const auth = new google.auth.GoogleAuth({
      credentials: CREDENTIALS,
      scopes: SCOPES,
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles',
    });

    const values = [
      [timestamp, firstName, lastName, email, phone, reference || '']
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'Sheet1!A1',
      valueInputOption: 'USER_ENTERED',
      resource: { values },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error appending to Google Sheet:', error);
    res.status(500).json({ error: 'Failed to register. Please try again.' });
  }
}