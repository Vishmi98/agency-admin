import CryptoJS from "crypto-js";

const SECRET_KEY = "aa7e1788d53554bf7fdb289ea8d01627bd44bc9bc1b8a4320d7bb2daf5bed2b5";

export const decryptData = (cipherText: string) => {
    const bytes = CryptoJS.AES.decrypt(
        cipherText,
        SECRET_KEY
    );

    return JSON.parse(
        bytes.toString(CryptoJS.enc.Utf8)
    );
};