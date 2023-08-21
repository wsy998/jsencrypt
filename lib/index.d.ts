export type ResponseData = {
    data: string;
    key: string;
};
export declare class Encryptor {
    private publicKey;
    private iv;
    /**
     * 设置公钥
     * @param str
     */
    setPublicKey(str: string): this;
    /**
     * 设置iv
     * @param iv
     */
    setIv(iv: string): this;
    /**
     * 加密字符串可能有异常抛出
     * @param str
     */
    encrypt(str: string): ResponseData;
}
