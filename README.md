# jsencrypt
一个基于crypto-js和jsencrypt的加密库
##加密思路
思路来自[https://www.zybuluo.com/octopus/note/1398009](https://www.zybuluo.com/octopus/note/1398009)

## 加载方式
### 使用AMD 方法加载
```js
define(['jsencrypt'],function(encrypt){
})
```
### 使用es6 方法加载
```js
import jsencrypt from '@wsy998/jsencrypt'
```
### 使用CommonJS 加载
```js
encrypt=require('jsencrypt')
```
## 使用方法
### 设置公钥
encrypt.setPublicKey() 
### 设置Iv
encrypt.setIv()
### 加密字符串
encrypt.encrypt()
