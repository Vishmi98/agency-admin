import { Language } from "../../enums/common.enum";

export const ERROR_MESSAGES = {
    USER_NOT_FOUND: {
        [Language.EN]: 'User not found',
        [Language.SN]: 'පරිශීලකයා සොයා ගැනීමට නොහැකි විය',
        [Language.TN]: 'பயனர் காணப்படவில்லை',
    },
    USER_CREATION_FAILED: {
        [Language.EN]: 'Failed to create user',
        [Language.SN]: 'පරිශීලකයෙකු නිර්මාණය කිරීමට අපොහොසත් විය',
        [Language.TN]: 'பயனர் உருவாக்க முடியவில்லை',
    },
    INVALID_INPUT: {
        [Language.EN]: 'Invalid input provided',
        [Language.SN]: 'අවලංගු ආදානයක් ලබා දී ඇත',
        [Language.TN]: 'தவறான உள்ளீடு வழங்கப்பட்டது',
    },
    SERVER_ERROR: {
        [Language.EN]: 'An internal server error occurred',
        [Language.SN]: 'අභ්යන්තර සේවාදායක දෝෂයක් සිදුව ඇත',
        [Language.TN]: 'உள்நாட்டு சர்வர் பிழை ஏற்பட்டுள்ளது',
    },
    EMAIL_EXISTS: {
        [Language.EN]: 'Email already exists',
        [Language.SN]: 'ඉමේල් ලිපිනය දැනටමත් පවතී',
        [Language.TN]: 'மின்னஞ்சல் ஏற்கனவே உள்ளது',
    },
};