---
title: 加解密笔记及 .NET 实现
date: 2018-06-21 13:17:30
description: 关于密码信息的概念及工作原理笔记，不间断更新
excerpt: 关于密码信息的概念及工作原理笔记，不间断更新
category:
- Cryptography
tag:
- security
- netframework
- cryptography
---

参考资料: 
- [RFC3602 规范](https://tools.ietf.org/html/rfc3602)
- [Security Best Practices: Symmetric Encryption with AES in Java and Android](https://proandroiddev.com/security-best-practices-symmetric-encryption-with-aes-in-java-7616beaaade9)
- [Cryptographic Services](https://docs.microsoft.com/en-us/dotnet/standard/security/cryptographic-services)

## 加密的意义
加密技术首要考虑的关注点在于: 
- 保密: 确保通信的数据不能被第三方读取
- 数据完整: 确保数据在通信过程中不能被第三方纂改
- 认证: 验证数据来源，防止第三方伪造数据

## 密码学基础概念
- 对称加密: 加解密双方使用同一个密钥对消息进行加解密，
- 非对称加密
- 密文哈希: 哈希算法将一组任意大小的二进制数据变成一组固定大小的二进制数据，且无法实施逆向工程
- 消息认证码: 消息认证码 Message Authentication Code(Mac) 是提供给消息接收方以验证消息来源及确保消息完整性的额外信息
- 数字签名

## AES(Advanced Encryption Standard) CBC(Cipher Block Chaining)
原理: 加解密双方使用同一个密钥(secret key)加解密信息，`CBC` 将明文按**固定字节大小**切割，得到的每一块称为一个 `Block`，每个 `Block` 将前一个密文 `Block` 与当前 `Block` 进行 `XOR` 运算。这样，每一个 `Block` 都依赖前序所有的 `Block`。而第一个 `Block` 使用一个相同长度的随机生成的 `Block`(初始化向量 IV(Initialization Vector))进行 `XOR` 运算。鉴于被加密消息不一定能够被切割为 `Block` 长度的整数倍，于是引入「补齐 Padding」算法在尾部进行填充，具体来说，其加密经历以下过程:
1. `plainText` 被分割为 `length / block-size` 个 `block`，如果最后一个 `block` 不足 `block-size`，使用 `Padding` 补齐
2. 随机生成一个 `IV` 与首个 `block` 进行 XOR 运算得到 `cipherText`
3. 上一个 `cipherText` 与下一个 `plainText` 进行 XOR 运算得到 `cipherText`

![AES CBC 模式示意图](./aes-cbc-mode.png)

> 通常每份明文加密前都会随机生成 IV，以防止多次加密后得到相同的结果

- AES 支持 128 位，192 位及 256 位大小的密文块
- 因为 IV 的长度总是与 `Block` 的长度相同，在传输或持久化数据时，常见的做法是将 IV 直接作为前缀 `Prepend` 到密文前面
- 在过程中 `Key` 的长度与 `Block` 的长度没有直接关系，只会影响循环加密的次数，128 位的密钥有 10 个加密循环，192 位密钥有 12 个加密循环，256 位密钥有 14 个加密循环

具体参考 [RFC3602 规范](https://tools.ietf.org/html/rfc3602)

.NET 提供了以下类型实现对称加密算法:
- AesManaged (.NET Framework 3.5 时引入)
- DESCryptoServiceProvider
- HMACSHA1 (This is technically a secret-key algorithm because it represents message authentication code that is calculated by using a cryptographic hash function combined with a secret key)
- RC2CryptoServiceProvider
- RijndaelManaged
- TripleDESCryptoServiceProvider

## 消息认证码(MAC, Message Authentication Code)
对称加密本身并不能验证加密数据的完整性，第三方可能拦截加密的密文然后替换掉其中某些字节发送给接收方。数据加密完成之后，基于密文使用 MAC 算法得到一个 MAC 值，然后将该值以合适的方式附加到密文上。常用的 MAC 算法有 HMAC(Hash-based Message Authentication Code)。

MAC 的作用与数字签名类似，唯一的区别在于加密方和解密方使用相同的 Key，虽然确保了数据完整性，但也意味着消息将被处理两次，同样的，接收方在收到数据后也将处理两次。

## 公钥加密(Public-key Encryption)
Public/Private 密钥对
加密双方使用一个非对称密钥对 - 公钥和私钥，数据由公钥加密后只能由私钥解密，而数据由私钥签名的则只能由公钥验证，公钥可以是公开的，但私钥必须保密。

现假设 A 和 B 想要通信，A 负责生成密钥对，那么 A 将其公钥发送给 B，B 使用公钥对通信信息加密，后将密文发送给 A，A 用其私钥解密密文。在此情景中，如果 A 将公钥发送给 B 时被攻击者拦截，同时攻击者将后续的密文一并拦截，但持有公钥和密文是无法解密信息的。另外，B 在收到公钥后，如何验证收到的的确是 A 的私钥？A 将一段消息使用某种哈希算法得到签名，再将签名使用私钥加密，B 接到签名信息和消息后，使用公钥解密密文得到签名信息，再使用相同的哈希算法处理收到的消息，B 通过对比两个签名的哈希值来判断消息是否被篡改。

信息流向始终是 B 流向 A，如果 A 想要向 B 发送消息，必须使用相同的方法得到 B 的公钥。所以，通常使用非对称加密传输对称加密的密钥和 IV，通信的双方使用对称加密对信息加密。

.NET 提供了以下类型实现公钥加密算法:
- DSACryptoServiceProvider
- RSACryptoServiceProvider
- ECDiffieHellman (基类)
- ECDiffieHellmanCng
- ECDiffieHellmanCngPublicKey (基类)
- ECDiffieHellmanKeyDerivationFunction (基类)
- ECDsaCng

## 数字签名
数字签名用于验证发送方的身份，对称加密也提供支持数字签名。首先，A 使用某种哈希算法处理一条消息得到字面为**哈希值**的「消息摘要」，然后 A 使用私钥将消息摘要加密，密文的字面值则称为「数字签名」。B 收到消息和数字签名后，使用 A 的**公钥**解密该数字签名得到「消息摘要」，然后使用**相同的哈希算法**对收到的消息进行处理，如果得到的哈希值与解密后的「消息摘要」一致，那么 B 便可以认为该消息的确来源于 A 且未被篡改。

要验证数据被某个发送方签名，接收需要得知以下信息:
- 发送方的公钥
- 数字签名(消息载体经过哈希处理后被发送方以私钥进行加密之后的密文)
- 被签名的数据(哈希处理之前的消息载体)
- 发送方使用的哈希算法

.NET 提供了以下类型实现数字签名算法:
- DSACryptoServiceProvider
- RSACryptoServiceProvider
- ECDsa (基类)
- ECDsaCng

## 哈希值
哈希算法将一组任意大小的二进制数据变成一组固定大小的二进制数据，且无法实施逆向工程。哈希值是数据的数字化形式。通信的双方可以利用哈希值确保数据完整性，A 将消息和消息的哈希值一起发送给 B，B 收到消息后使用相同的哈希算法得到消息的哈希值，然后与收到的消息进行比对，如果比对无误，则可确保消息未被更改。然后，任何第三方都可以给 B 发送消息和消息哈希值，B 无法简单通过哈希值知道发送方的身份。通常，数字签名和哈希一起使用。

.NET 提供了以下类型实现哈希算法:
- HMACSHA1
- MACTripleDES
- MD5CryptoServiceProvider
- RIPEMD160
- SHA1Managed
- SHA256Managed
- SHA384Managed
- SHA512Managed

## 数字证书
数字证书又称为公开密钥证书(Public key certificate)，用来证明公开密钥拥有者的身份。该文件包含了:
- 公钥信息
- 拥有者的身份信息(Subject)
- 数字证书认证机构(Issuer)对这份文件的数字签名

拥有者凭借此文件，可向计算机系统或其他用户表明身份，证书的检验方通过查看其签发机构来检验该证书是否有效，如果检验方信任该签发机构，就代表信任证书上的密钥，凭借公钥加密与拥有者进行安全的通信。数字证书详情参考[X.509 数字证书](/security/security-all-about-certificates)

## 生成随机数
随机数生成与加密的多个操作都有关，加密密钥需要尽可能的随机，.NET 提供了 `RNGCryptoServiceProvider` 类型来实现随机数生成。