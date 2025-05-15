import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS);

    const auth = new GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const { firstName, lastName, email, phone, reference } = req.body || {};
    if (!firstName || !lastName || !email || !phone) {
      res.status(400).json({ error: 'Missing required fields.' });
      return;
    }

    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles',
    });

    const values = [[timestamp, firstName, lastName, email, phone, reference || '']];

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
