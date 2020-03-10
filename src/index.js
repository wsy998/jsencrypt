import JSEncrypt from "jsencrypt";
import CryptoJS from "crypto-js";

(factory => {
    if (typeof define === "function" && define.amd) define(["jsencrypt"], factory);
    else if (typeof exports === "object") module.exports = factory();
    else window.encrypt = factory();
})(() => {

    /**
     *  16进制转base64
     * @param {string} h
     * @returns {string}
     */
    let hex2b64 = h => {
            const b64map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',
                b64padchar = '=';
            let i, c, ret = "";
            for (i = 0; i + 3 <= h.length; i += 3) {
                c = parseInt(h.substring(i, i + 3), 16);
                ret += b64map.charAt(c >> 6) + b64map.charAt(c & 63);
            }
            if (i + 1 === h.length) {
                c = parseInt(h.substring(i, i + 1), 16);
                ret += b64map.charAt(c << 2);
            } else if (i + 2 === h.length) {
                c = parseInt(h.substring(i, i + 2), 16);
                ret += b64map.charAt(c >> 2) + b64map.charAt((c & 3) << 4);
            }
            while ((ret.length & 3) > 0) ret += b64padchar;
            return ret;
        },
        /**
         * 生成随机字符串
         * @param {number} len
         * @returns {string}
         */
        randomString = len => {
            len = len || 32;
            const $chars = "123456789",
                maxPos = $chars.length;
            let pwd = "";
            for (let i = 0; i < len; i++)
                pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
            return pwd;
        },
        /**
         * 获取Aes字符串
         * @param {string} post
         * @param {string} aes_key
         * @param {string} iv
         * @returns {string}
         */
        getAesString = (post, aes_key, iv) => {
            let key = CryptoJS.enc.Latin1.parse(aes_key);
            let _iv = CryptoJS.enc.Latin1.parse(iv);
            return CryptoJS.AES.encrypt(post, key, {
                iv: _iv,
                mode: CryptoJS.mode.CBC,
                adding: CryptoJS.pad.ZeroPadding
            }).toString();
        },
        /**
         * 获取RSA字符串
         * @param {string} PublicKey
         * @param {string} str
         * @returns {string}
         */
        getSRAString = (PublicKey, str) => {
            /**
             * 扩展 JSEncrypt库
             * @param {string} string
             * @returns {string}
             */
            let encryptLong = (string,k) => {
                try {
                    let ct = "", bytes = [0], byteNo = 0, len = string.length, c, temp = 0;
                    for (let i = 0; i < len; i++) {
                        c = string.charCodeAt(i);
                        if (c >= 0x010000 && c <= 0x10ffff) byteNo += 4;
                        else if (c >= 0x000800 && c <= 0x00ffff) byteNo += 3;
                        else if (c >= 0x000080 && c <= 0x0007ff) byteNo += 2;
                        else byteNo += 1;

                        if ((byteNo % 117 >= 114 || byteNo % 117 === 0) && (byteNo - temp >= 114)) {
                            bytes.push(i);
                            temp = byteNo;
                        }
                    }
                    //2.截取字符串并分段加密
                    if (bytes.length > 1) {
                        for (let i = 0; i < bytes.length - 1; i++) {
                            let str;
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
                } catch (ex) {
                    return ex;
                }
            };
            let encrypt = new JSEncrypt();
            encrypt.setPublicKey(PublicKey);
            return (encryptLong(JSON.stringify(str),encrypt.getKey()));
        };

    class app {
        setPublicKey(str) {
            this.PublicKey = str;
        }

        setIv(iv) {
            this.iv = iv;
        }

        encrypt(str) {
            const aes_key = randomString(24),
                aes_post = getAesString(str, aes_key, this.iv),
                sra_str = getSRAString(this.PublicKey, aes_key);
            return {
                data: aes_post,
                key: sra_str
            };
        }
    }

    return app;
});
