const express = require('express');
const { google } = require('googleapis');

const app = express();
app.use(express.json());

const authentication = async () => {
    const auth = new google.auth.GoogleAuth({
        keyFile: "creds.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    });
    const client = await auth.getClient();
    const sheets = google.sheets({
        version: 'v4',
        auth: client
    });
    return { sheets }
}
const id = '1A5e0ic-w7YZ9KiocwXRqX0ENrxDbePaWWURan3H401A';

app.get('/', async (req, res) => {
    try {
        const { sheets } = await authentication();
        // reading and storing the sheet
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: id,
            range: 'Sheet1',
        })
        res.send(response.data)
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
})

app.post('/', async (req, res) => {
    try {
        // destructure 'newName' and 'newvalue' from req.body
        const { newName, newCountry ,newValue } = req.body;
        const { sheets } = await authentication();
        // writing data to a spreadsheet
        const writeReq = await sheets.spreadsheets.values.append({
            spreadsheetId: id,
            range: 'Sheet1',
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [
                    [newName, newCountry ,newValue],
                ]
            }
        })
        if (writeReq.status === 200) {
            return res.json({ msg: 'Spreadsheet updated successfully!' })
        }
        return res.json({ msg: 'Something went wrong while updating the spreadsheet.' })
    } catch (e) {
        console.log('ERROR UPDATING THE SPREADSHEET', e);
        res.status(500).send();
    }
})

app.listen(3000, () => console.log("Server up on port 3000"))