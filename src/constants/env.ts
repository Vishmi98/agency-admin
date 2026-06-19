export const JWT_SECRET = process.env.JWT_SECRET
export const PW = process.env.DB_KEY
export const DB = process.env.DB

export const imageKitConfig = {
    publicKey: process.env.IK_PU_KEY || 'test',
    privateKey: process.env.IK_PR_KEY || 'test',
    urlEndpoint: process.env.IK_URL || 'test',
}

export const twilioKey = {
    sid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER,
}

export const emailConfig = {
    user: process.env.E_USER,
    pass: process.env.E_PW
}