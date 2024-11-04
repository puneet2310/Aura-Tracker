import { google } from "googleapis";
import  dotenv from 'dotenv'
dotenv.config()

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

const oAuth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    'postmessage' //It enables secure communication between Google and your application using the Post Message API, allowing for a smoother user experience without the need for page reloads.
)

export default oAuth2Client
