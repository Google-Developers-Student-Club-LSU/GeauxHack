import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { google } from 'googleapis';
import { env } from '$env/dynamic/private';

const SHEET_RANGE = env.GOOGLE_SHEETS_RANGE || 'Sheet1!A:H';
const EMAIL_COLUMN_INDEX = 2;

function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n')
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
  return google.sheets({ version: 'v4', auth });
}

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();

  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim().toLowerCase();
  const team = String(body.team ?? '').trim();
  const year = String(body.year ?? '').trim();
  const track = String(body.track ?? '').trim();
  const division = String(body.division ?? '').trim();
  const shirtSize = String(body.shirtSize ?? '').trim();
  const dietaryRestriction = String(body.dietaryRestriction ?? '').trim();

  if (!name || !email) {
    return json({ error: 'Name and email are required.' }, { status: 400 });
  }

  const spreadsheetId = env.GOOGLE_SHEETS_ID;

  if (!spreadsheetId || !env.GOOGLE_SHEETS_CLIENT_EMAIL || !env.GOOGLE_SHEETS_PRIVATE_KEY) {
    return json({ error: 'Server is not configured for applications yet.' }, { status: 500 });
  }

  const sheets = getSheetsClient();

  try {
    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: SHEET_RANGE
    });

    const rows = existing.data.values ?? [];
    const alreadyApplied = rows.some(
      (row) => (row[EMAIL_COLUMN_INDEX] ?? '').toString().trim().toLowerCase() === email
    );

    if (alreadyApplied) {
      return json({ error: "Looks like you've already applied with this email." }, { status: 409 });
    }

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: SHEET_RANGE,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [new Date().toISOString(), name, email, team, year, track, division, shirtSize, dietaryRestriction]
        ]
      }
    });

    return json({ success: true });
  } catch (error) {
    console.error('Google Sheets request failed:', error);
    return json(
      { error: 'Could not reach the sheet. Check GOOGLE_SHEETS_ID, GOOGLE_SHEETS_RANGE, and that the sheet is shared with the service account.' },
      { status: 500 }
    );
  }
};