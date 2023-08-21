import { lib } from "crypto-js";
/**
 * 16进制转base64
 * @param h 16进制字符串
 */
export declare const hex2b64: (h: string) => string;
/**
 * 生成随机字符串
 * @param len 字符串长度
 */
export declare const randomString: (len?: number) => string;
/**
 * 获取Aes字符串
 * @param post 发送的数据
 * @param aes_key key
 * @param iv iv
 */
export declare const getAesString: (post: lib.WordArray | string, aes_key: string, iv: string) => string;
/**
 *
 * @param publicKey
 * @param str
 */
export declare const getSRAString: (publicKey: string, str: any) => string;
