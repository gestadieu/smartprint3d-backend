require('dotenv').config();
const {
  google
} = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

const sheets = google.sheets('v4');


class PreSurvey {

  constructor() {
    this.spreadsheetId = process.env.SPREADSHEET_ID;
    this.sheetName = 'PreSurvey'; //process.env.SHEET_NAME;
  }
  // set name(name) {
  //   this._name = name.charAt(0).toUpperCase() + name.slice(1);
  // }
  // get name() {
  //   return this._name;
  // }

  async authToken() {
    const auth = new google.auth.GoogleAuth({
      scopes: SCOPES
    });
    const authToken = await auth.getClient();
    return authToken;
  }

  async addRows(data) {
    try {
      const a = this.dataToArray(data);
      const auth = await this.authToken();
      const res = await sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        auth,
        range: this.sheetName,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [a],
        },
      });
      return res.data;
    } catch (error) {
      console.log(error.message, error.stack);
    }
  }

  dataToArray(data) {
    const questions = ['q1', 'q2', 'q3', 'q4', 'q51', 'q52', 'q53', 'q54', 'q55', 'q56', , 'q57', 'q6', , 'q7', , 'q8', , 'q91', 'q92', 'q10']; //, 'q10other'];
    let a = ['phonenb', 'email'];
    questions.forEach(el => {
      if (el in data && el == 'q10') {
        let tp = data.q10.toString();
        tp += ('q10other' in data) ? ',' + data.q10other : '';
        a.push(tp);
      } else {
        a.push((el in data) ? data[el] : '')
      }
    })
    return a;
  }
}


async function getAuthToken() {
  const auth = new google.auth.GoogleAuth({
    scopes: SCOPES
  });
  const authToken = await auth.getClient();
  return authToken;
}

async function getSpreadSheet({
  spreadsheetId,
  auth
}) {
  const res = await sheets.spreadsheets.get({
    spreadsheetId,
    auth,
  });
  return res;
}

async function getSpreadSheetValues({
  spreadsheetId,
  auth,
  sheetName
}) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    auth,
    range: sheetName
  });
  return res;
}

async function addRows({
  spreadsheetId,
  auth,
  sheetName,
  rows
}) {
  const range = sheetName;
  const res = await sheets.spreadsheets.values.append({
    spreadsheetId,
    auth,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: rows,
    },
  });
  console.log(res.data);
  return res.data;
}


module.exports = {
  PreSurvey
}