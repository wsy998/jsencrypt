import {getAesString, getSRAString, randomString} from "./utils";

export type ResponseData = {
    data: string,
    key: string
}

export class Encryptor {
    private publicKey: string = ""
    private iv: string = ""

    /**
     * 设置公钥
     * @param str
     */
    setPublicKey(str: string) {
        this.publicKey = str;
        return this
    }

    /**
     * 设置iv
     * @param iv
     */
    setIv(iv: string) {
        this.iv = iv;
        return this
    }

    /**
     * 加密字符串可能有异常抛出
     * @param str
     */
    encrypt(str: string): ResponseData {
        const aes_key = randomString(24),
            aes_post = getAesString(str, aes_key, this.iv),
            sra_str = getSRAString(this.publicKey, aes_key);
        return {
            data: aes_post,
            key: sra_str
        };
    }
}
