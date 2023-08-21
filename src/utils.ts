import {lib} from "crypto-js";
import JSEncrypt from "jsencrypt";
import {JSEncryptRSAKey} from "jsencrypt/lib/JSEncryptRSAKey";

const b64map =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
    b64padchar = "=";
const chars = "123456789",
    maxPos = chars.length;

/**
 * 16进制转base64
 * @param h 16进制字符串
 */
export const hex2b64 = (h: string): string => {

    const chunks: string[] = []

    let i = 0, c = 0;

    for (; i + 3 <= h.length; i += 3) {
        c = parseInt(h.substring(i, i + 3), 16);
        chunks.push(b64map.charAt(c >> 6), b64map.charAt(c & 63))
    }
    const remainingChars = h.length - i;
    if (remainingChars === 1) {
        c = parseInt(h.substring(i, i + 1), 16);
        chunks.push(b64map.charAt(c << 2))
    } else if (remainingChars === 2) {
        c = parseInt(h.substring(i, i + 2), 16);
        chunks.push(b64map.charAt(c >> 2), b64map.charAt((c & 3) << 4))
    }
    const r = chunks.length % 4
    let ret = chunks.join("")
    if (r == 0) {
        return ret
    }
    return ret.padEnd(ret.length + (4 - r), b64padchar);
}
/**
 * 生成随机字符串
 * @param len 字符串长度
 */
export const randomString = (len: number = 32): string => {
    let pwd: string[] = [];
    for (let i = 0; i < len; i++)
        pwd.push(chars.charAt(Math.floor(Math.random() * maxPos)));
    return pwd.join("");
}


/**
 * 获取Aes字符串
 * @param post 发送的数据
 * @param aes_key key
 * @param iv iv
 */
export const getAesString = (post: lib.WordArray | string, aes_key: string, iv: string): string => {
    let key = CryptoJS.enc.Latin1.parse(aes_key);
    let _iv = CryptoJS.enc.Latin1.parse(iv);
    return CryptoJS.AES.encrypt(post, key, {
        iv: _iv,
        mode: CryptoJS.mode.CBC,
        adding: CryptoJS.pad.ZeroPadding
    }).toString();
}


/**
 *
 * @param publicKey
 * @param str
 */
export const getSRAString = (publicKey: string, str: any): string => {

    const encryptLong = (string: string, k: JSEncryptRSAKey): string => {
        try {
            let ct = "",
                bytes = [0],
                byteNo = 0,
                len = string.length,
                c,
                temp = 0;
            for (let i = 0; i < len; i++) {
                c = string.charCodeAt(i);
                if (c >= 0x010000 && c <= 0x10ffff) byteNo += 4;
                else if (c >= 0x000800 && c <= 0x00ffff) byteNo += 3;
                else if (c >= 0x000080 && c <= 0x0007ff) byteNo += 2;
                else byteNo += 1;

                if (
                    (byteNo % 117 >= 114 || byteNo % 117 === 0) &&
                    byteNo - temp >= 114
                ) {
                    bytes.push(i);
                    temp = byteNo;
                }
            }
            //2.截取字符串并分段加密
            if (bytes.length > 1) {
                for (let i = 0; i < bytes.length - 1; i++) {
                    let str: string;
                    if (i === 0) str = string.substring(0, bytes[i + 1] + 1);
                    else str = string.substring(bytes[i] + 1, bytes[i + 1] + 1);

                    const t1 = k.encrypt(str);
                    ct += t1;
                }
                if (bytes[bytes.length - 1] !== string.length - 1) {
                    const lastStr = string.substring(bytes[bytes.length - 1] + 1);
                    ct += k.encrypt(lastStr);
                }
                return hex2b64(ct);
            }
            const t = k.encrypt(string);
            return hex2b64(t);
        } catch (ex: any) {
            throw new ex
        }
    };
    let encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    return encryptLong(JSON.stringify(str), encrypt.getKey());
}