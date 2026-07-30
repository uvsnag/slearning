// Security & JWT — Cryptography, TLS & key management
import type { PvQuestion } from '../../../types';

export const questions: PvQuestion[] = [
  {
    q: 'What is the difference between encoding, hashing, and encryption?',
    difficulty: 'easy',
    a: `<div class="interview-answer"><p>These three are constantly confused in interviews. <strong>Encoding</strong> (Base64, URL-encoding) only changes representation so data survives transport — it is fully reversible by anyone and provides zero security. <strong>Hashing</strong> (SHA-256, bcrypt) is a one-way fingerprint: you cannot recover the input, and it is used for integrity checks and password storage. <strong>Encryption</strong> (AES, RSA) is reversible <em>with a key</em> and is what protects confidentiality. So Base64 is not security, a hash is not encryption, and "encrypting" passwords is the wrong verb — you hash them.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Ba khái niệm này rất hay bị nhầm khi đi phỏng vấn. <strong>Encoding</strong> (Base64, URL-encode) chỉ đổi cách biểu diễn dữ liệu để nó đi qua đường truyền an toàn — ai cũng giải ngược được, nên không có giá trị bảo mật nào. <strong>Hashing</strong> (SHA-256, bcrypt) là dấu vân tay một chiều: không thể lấy lại dữ liệu gốc, dùng để kiểm tra tính toàn vẹn và để lưu mật khẩu. <strong>Encryption</strong> (AES, RSA) thì giải ngược được nếu có key, và đây mới là thứ bảo vệ tính bí mật. Nhớ ba điều: Base64 không phải bảo mật, hash không phải mã hóa, và mật khẩu thì phải hash chứ không "mã hóa".</p></details>
<table style="width:100%;border-collapse:collapse;margin:10px 0;font-size:.88rem;">
<tr><th style="text-align:left;padding:6px;border-bottom:1px solid #ccc;">Aspect</th><th style="padding:6px;border-bottom:1px solid #ccc;">Encoding</th><th style="padding:6px;border-bottom:1px solid #ccc;">Hashing</th><th style="padding:6px;border-bottom:1px solid #ccc;">Encryption</th></tr>
<tr><td style="padding:6px;">Reversible?</td><td style="padding:6px;">Yes, by anyone</td><td style="padding:6px;">No (one-way)</td><td style="padding:6px;">Yes, with the key</td></tr>
<tr><td style="padding:6px;">Needs a key?</td><td style="padding:6px;">No</td><td style="padding:6px;">No (HMAC does)</td><td style="padding:6px;">Yes</td></tr>
<tr><td style="padding:6px;">Purpose</td><td style="padding:6px;">Transport / format</td><td style="padding:6px;">Integrity, passwords</td><td style="padding:6px;">Confidentiality</td></tr>
<tr><td style="padding:6px;">Examples</td><td style="padding:6px;">Base64, hex, URL</td><td style="padding:6px;">SHA-256, bcrypt</td><td style="padding:6px;">AES-GCM, RSA</td></tr>
</table>
<pre>// Encoding — no secret involved
Buffer.from('hello').toString('base64')  // aGVsbG8=  → decode: trivial
// This is what a JWT payload is: ENCODED, not encrypted.

// Hashing — one-way, same input → same output
sha256('hello')  // 2cf24dba5fb0a...  can't be reversed
// but identical inputs give identical hashes → needs a SALT for passwords

// Encryption — needs a key, two-way
const c = aesGcmEncrypt(plaintext, key);   // key required to read it back
const p = aesGcmDecrypt(c, key);</pre>
<p><strong>Where each belongs:</strong> encoding for JWT parts and data URLs; hashing for password storage (with a slow KDF), file checksums, and cache keys; encryption for data at rest, secrets, and anything you must read back later.</p>
<div class="key-point">If you must be able to read the data back, you need encryption. If you only need to verify it, hash it. If you only need it to survive transport, encode it. Calling Base64 "encryption" in an interview is an instant red flag.</div>`,
  },
  {
    q: 'Symmetric vs asymmetric encryption — how do AES, RSA and ECC differ and when do you use each?',
    difficulty: 'medium',
    a: `<div class="interview-answer"><p><strong>Symmetric</strong> encryption (AES) uses one key for both encrypt and decrypt: it is fast, works on any data size, but both sides need the same secret — so key distribution is the hard part. <strong>Asymmetric</strong> encryption (RSA, ECC) uses a public key to encrypt and a private key to decrypt, which solves key distribution but is orders of magnitude slower and limited to tiny payloads. Real systems therefore use <strong>hybrid encryption</strong>: asymmetric crypto to exchange or wrap a random symmetric key, then AES for the actual data — exactly what TLS does. ECC (P-256, Ed25519) gives the same security as RSA with much smaller keys, so it is the modern default.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Mã hóa <strong>đối xứng</strong> (AES) dùng một key cho cả mã hóa và giải mã: rất nhanh, xử lý được dữ liệu lớn, nhưng hai bên phải có cùng một secret — và chuyện khó nhất chính là làm sao chuyển key cho nhau an toàn. Mã hóa <strong>bất đối xứng</strong> (RSA, ECC) dùng public key để mã hóa và private key để giải mã, giải quyết được bài toán phân phối key nhưng chậm hơn rất nhiều lần và chỉ mã hóa được lượng dữ liệu rất nhỏ. Nên thực tế người ta dùng <strong>hybrid</strong>: dùng bất đối xứng để trao đổi (hoặc bọc) một key đối xứng ngẫu nhiên, rồi dùng AES để mã hóa dữ liệu thật — TLS làm đúng như vậy. ECC (P-256, Ed25519) cho mức an toàn tương đương RSA nhưng key ngắn hơn nhiều, nên giờ nó là lựa chọn mặc định.</p></details>
<pre>Symmetric (AES-256-GCM)
  key: one shared 32-byte secret
  speed: ~1 GB/s (hardware AES-NI)
  use: bulk data — files, DB columns, TLS session traffic

Asymmetric (RSA-2048 / RSA-4096, ECC P-256, Ed25519)
  keys: public (share freely) + private (never leaves the owner)
  speed: ~1000x slower; RSA-2048 can encrypt only ~200 bytes
  use: key exchange, digital signatures, certificates, JWT signing

// Hybrid encryption — how everything real works:
1. Generate a random AES key (the "session key" / DEK)
2. Encrypt the data with AES-GCM        ← fast, any size
3. Encrypt the AES key with the RSA/ECC public key  ← small payload
4. Send: [RSA-wrapped key] + [AES ciphertext]</pre>
<p><strong>Key-size intuition</strong> (equivalent strength): RSA-2048 ≈ ECC-224 ≈ 112-bit; RSA-3072 ≈ ECC-256 ≈ 128-bit. Smaller ECC keys mean faster handshakes and less bandwidth — that is why TLS 1.3 and modern JWTs prefer <code>ES256</code>/Ed25519.</p>
<p><strong>Do not confuse encryption with signing:</strong> encrypt with the <em>public</em> key (only the owner can read), sign with the <em>private</em> key (anyone can verify). Reversing these in an interview is a classic mistake.</p>
<div class="key-point">Symmetric = fast but shared-secret problem; asymmetric = solves distribution but slow and size-limited. Everything practical is hybrid: asymmetric to establish a key, AES-GCM to move the data. Prefer ECC over RSA for new systems.</div>`,
  },
  {
    q: 'Why is AES-ECB insecure, and what is the difference between CBC and GCM?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>AES itself is fine — the <em>mode</em> is what breaks systems. <strong>ECB</strong> encrypts each 16-byte block independently, so identical plaintext blocks produce identical ciphertext blocks and the structure of the data leaks (the famous "ECB penguin"). <strong>CBC</strong> chains blocks with a random IV so patterns disappear, but it provides no integrity: an attacker can flip bits or exploit padding-oracle behaviour to decrypt data. <strong>GCM</strong> is an AEAD mode — it encrypts <em>and</em> authenticates, producing a tag that fails loudly if a single byte was tampered with. The rule: use AES-GCM (or ChaCha20-Poly1305), never ECB, and never reuse a GCM nonce with the same key.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Bản thân AES không có vấn đề gì — thứ làm hỏng hệ thống là chọn sai <em>mode</em>. <strong>ECB</strong> mã hóa từng block 16 byte một cách độc lập, nên hai block plaintext giống nhau sẽ cho ra hai block ciphertext giống nhau, làm lộ cấu trúc dữ liệu (ảnh "chú chim cánh cụt ECB" nổi tiếng). <strong>CBC</strong> móc các block vào nhau bằng một IV ngẫu nhiên nên không còn lộ pattern, nhưng nó không bảo đảm tính toàn vẹn: kẻ tấn công có thể lật bit hoặc lợi dụng padding oracle để giải mã dần dữ liệu. <strong>GCM</strong> là mode AEAD — vừa mã hóa vừa xác thực, sinh ra một tag và chỉ cần sai một byte là verify fail ngay. Quy tắc: dùng AES-GCM (hoặc ChaCha20-Poly1305), tuyệt đối không dùng ECB, và không bao giờ dùng lại nonce với cùng một key trong GCM.</p></details>
<pre>// ECB: same block in → same block out (pattern leak)
plaintext:  [BALANCE=100][BALANCE=100][NAME=BOB..]
ciphertext: [9f3a...   ][9f3a...   ][71cd...  ]
                ↑ identical → attacker sees repeated structure,
                  can copy/paste/reorder blocks without the key

// CBC: IV + chaining hides patterns, but NO integrity
C1 = E(P1 XOR IV);  C2 = E(P2 XOR C1)
→ flipping a bit in C1 flips a predictable bit in P2 (bit-flipping attack)
→ if the server answers "bad padding" differently from "bad data",
  that is a PADDING ORACLE → full decryption without the key

// GCM (AEAD): confidentiality + integrity + optional AAD
ciphertext, tag = AES_GCM_Encrypt(key, nonce, plaintext, aad)
decrypt fails hard if tag mismatches → tampering is detected</pre>
<pre>// Node.js — AES-256-GCM done right
const iv = crypto.randomBytes(12);              // 96-bit nonce, NEVER reused
const c = crypto.createCipheriv('aes-256-gcm', key, iv);
const ct = Buffer.concat([c.update(plain, 'utf8'), c.final()]);
const tag = c.getAuthTag();                     // store iv + tag + ct

// Java
Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
cipher.init(Cipher.ENCRYPT_MODE, key, new GCMParameterSpec(128, iv));
// ❌ Cipher.getInstance("AES")  → defaults to AES/ECB/PKCS5Padding!</pre>
<p><strong>The nonce trap:</strong> reusing a (key, nonce) pair in GCM is catastrophic — it leaks the XOR of two plaintexts and lets an attacker forge tags. Use a random 96-bit nonce per message, or a strict counter, and rotate the key well before 2^32 messages.</p>
<div class="key-point">Never pick a mode by accident: <code>Cipher.getInstance("AES")</code> in Java silently means ECB. Default to AES-GCM with a fresh random nonce per message, and treat "encrypted but unauthenticated" (raw CBC) as broken.</div>`,
  },
  {
    q: 'How does the TLS/HTTPS handshake work, and what does a certificate actually prove?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>TLS gives three things: confidentiality, integrity, and server authentication. In the handshake the client and server agree on a cipher suite, do an <strong>ECDHE</strong> key exchange to derive a shared symmetric key, and the server proves it owns its private key by signing handshake data; from then on traffic is AES-GCM. The certificate only proves that a <strong>CA</strong> validated control of that domain and binds the domain to a public key — it says nothing about the site being trustworthy. TLS 1.3 cuts this to one round trip, removes legacy ciphers, and always uses forward-secret key exchange, so a stolen server key cannot decrypt yesterday's captured traffic.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>TLS mang lại ba thứ: tính bí mật, tính toàn vẹn và xác thực server. Trong handshake, client và server thống nhất cipher suite, làm phép trao đổi khóa <strong>ECDHE</strong> để cùng suy ra một key đối xứng, và server chứng minh mình giữ private key bằng cách ký lên dữ liệu handshake; từ đó trở đi toàn bộ traffic được mã hóa bằng AES-GCM. Certificate chỉ chứng minh rằng một <strong>CA</strong> đã xác minh chủ quyền tên miền và gắn tên miền đó với một public key — nó không nói gì về việc trang web có đáng tin hay không (site phishing vẫn có HTTPS). TLS 1.3 rút handshake còn một vòng, bỏ hết cipher cũ yếu, và luôn dùng trao đổi khóa có forward secrecy, nên kể cả private key của server bị lấy sau này thì cũng không giải mã được traffic đã bắt hôm qua.</p></details>
<pre>// TLS 1.3 handshake (1 round trip)
Client → ClientHello: supported ciphers + ECDHE key share
Server → ServerHello: chosen cipher + its ECDHE key share
       → Certificate (chain) + CertificateVerify (signature)
       → Finished
Both   → derive the same session keys from the ECDHE secret
Client → Finished → encrypted application data (AES-GCM)

// What the client verifies in the certificate:
1. Signature chain: leaf ← intermediate CA ← root in the OS/browser store
2. Hostname matches SAN (CN alone is no longer accepted)
3. Not expired / not-yet-valid
4. Not revoked (OCSP stapling / CRL)
5. Server proves possession of the private key via CertificateVerify</pre>
<p><strong>What HTTPS does NOT give you:</strong> it does not authenticate the <em>user</em>, does not protect data once it reaches the server, does not stop XSS or SQL injection, and does not mean the site is honest — attackers get free certificates too. It also does not hide which domain you visited (SNI is visible unless ECH is used).</p>
<p><strong>Things seniors are expected to mention:</strong> HSTS (<code>Strict-Transport-Security</code> with preload) to prevent downgrade to HTTP; forward secrecy via ephemeral ECDHE; certificate pinning for mobile apps (with a backup pin, or you brick the app); mTLS when the <em>client</em> must also authenticate; and TLS termination at the load balancer — traffic behind it should still be encrypted in zero-trust networks.</p>
<div class="key-point">A certificate binds a domain to a public key and proves the server holds the matching private key — nothing more. HTTPS protects data in transit; it is not a substitute for application-level authentication, authorization, or input validation.</div>`,
  },
  {
    q: 'How should passwords be stored? Compare bcrypt, argon2, PBKDF2 and plain SHA-256.',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>Passwords must be stored with a <strong>slow, salted password-hashing function</strong> — never encrypted, never with a fast hash. SHA-256 is wrong precisely because it is fast: a GPU tries billions of guesses per second, so a leaked table of SHA-256 hashes is cracked almost immediately. <strong>bcrypt</strong>, <strong>PBKDF2</strong> and <strong>argon2id</strong> are deliberately expensive and take a per-user random salt, which kills rainbow tables and makes identical passwords hash differently. Today argon2id is the recommended default (it is memory-hard, so GPUs and ASICs lose their advantage), with bcrypt at cost 12+ a perfectly acceptable choice; add a server-side pepper and a plan to re-hash on login when you raise the cost factor.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Mật khẩu phải được lưu bằng một hàm băm <strong>chậm và có salt</strong> — không mã hóa, cũng không dùng hàm băm nhanh. SHA-256 sai chính vì nó quá nhanh: một GPU thử được hàng tỷ mật khẩu mỗi giây, nên bảng hash SHA-256 bị lộ là gần như bị crack ngay. <strong>bcrypt</strong>, <strong>PBKDF2</strong> và <strong>argon2id</strong> được thiết kế cho tốn kém có chủ đích và mỗi user có một salt ngẫu nhiên riêng, nhờ vậy rainbow table vô dụng và hai người đặt cùng mật khẩu vẫn ra hash khác nhau. Hiện nay argon2id là lựa chọn nên dùng (nó tốn nhiều bộ nhớ nên GPU/ASIC mất lợi thế), còn bcrypt với cost từ 12 trở lên vẫn hoàn toàn ổn; thêm một "pepper" lưu ở phía server và chuẩn bị sẵn cơ chế hash lại khi đăng nhập mỗi lần bạn tăng cost.</p></details>
<pre>// Why a fast hash loses: cracking speed on one modern GPU
SHA-256          ~10,000,000,000 guesses/sec  ❌
bcrypt (cost 12)          ~1,000 guesses/sec  ✅
argon2id (64MB)             ~100 guesses/sec  ✅✅

// Salt: stored in plaintext WITH the hash, unique per user
// Purpose: two users with password "123456" get different hashes,
//          so one cracked hash does not reveal every account.
$2b$12$eImiTXuWVxfM37uY4JANjQ...   ← bcrypt embeds algo+cost+salt+hash
       ↑cost ↑22-char salt</pre>
<pre>// Java — Spring Security
PasswordEncoder enc = new BCryptPasswordEncoder(12);
// or memory-hard: new Argon2PasswordEncoder(16, 32, 1, 65536, 3);
String hash = enc.encode(rawPassword);
boolean ok = enc.matches(rawPassword, hash);   // constant-time compare inside

// Node.js
const hash = await argon2.hash(password, { type: argon2.argon2id });
const ok   = await argon2.verify(hash, password);

// Upgrade path — re-hash transparently on successful login:
if (ok && enc.upgradeEncoding(hash)) userRepo.updateHash(enc.encode(raw));</pre>
<p><strong>The rest of the checklist:</strong> never log or email the password; compare with the library's own <code>matches()</code> (constant-time); allow long passphrases (no silly 16-char maximum, and bcrypt truncates at 72 bytes — argon2 does not); check new passwords against a breached-password list instead of forcing quarterly rotation (NIST 800-63B); and keep the same generic error and similar response time for "no such user" and "wrong password" so you do not leak which accounts exist.</p>
<div class="key-point">Hash, never encrypt: argon2id (or bcrypt cost ≥ 12) + per-user salt + optional pepper, tuned so one verification takes ~200–500 ms. If your answer is "SHA-256 with a salt", you have just failed the security round.</div>`,
  },
  {
    q: 'What is the difference between an HMAC and a digital signature?',
    difficulty: 'medium',
    a: `<div class="interview-answer"><p>Both prove a message was not modified, but they differ in <em>who can verify</em> and in <strong>non-repudiation</strong>. An <strong>HMAC</strong> uses one shared secret, so every party that can verify can also forge — fine between two systems you both control, useless as proof of origin. A <strong>digital signature</strong> is created with a private key and verified with a public key, so anyone can check it and only the key owner could have produced it, which makes it legally meaningful. That is exactly the <code>HS256</code> versus <code>RS256</code> choice in JWT, and the reason webhook providers publish signatures rather than sharing one HMAC key with everybody.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Cả hai đều chứng minh dữ liệu không bị sửa, nhưng khác nhau ở chỗ <em>ai verify được</em> và ở tính <strong>chống phủ nhận</strong> (non-repudiation). <strong>HMAC</strong> dùng một secret chung, nên bên nào verify được thì cũng tạo ra được — dùng giữa hai hệ thống do chính bạn quản lý thì ổn, nhưng không dùng làm bằng chứng về nguồn gốc. <strong>Digital signature</strong> được tạo bằng private key và verify bằng public key, nên ai cũng kiểm tra được mà chỉ chủ khóa mới tạo ra được, vì vậy nó có giá trị làm bằng chứng. Đây đúng là chuyện chọn <code>HS256</code> hay <code>RS256</code> khi ký JWT, và cũng là lý do các nhà cung cấp webhook công bố signature thay vì chia sẻ một HMAC key cho tất cả khách hàng.</p></details>
<pre>HMAC-SHA256(secret, message) → tag
  verify: recompute with the SAME secret and compare
  → verifier can also SIGN  ⇒ no non-repudiation
  → use: internal service-to-service, cookie/session integrity,
         webhook verification when you control both ends

Sign(privateKey, message) → signature      (RSA-PSS, ECDSA, Ed25519)
  verify: Verify(publicKey, message, signature)
  → verifier CANNOT sign  ⇒ non-repudiation, safe to publish key
  → use: JWT across services, code/artifact signing, certificates,
         documents, blockchain transactions</pre>
<pre>// Stripe-style webhook check (HMAC) — note the constant-time compare
const expected = crypto.createHmac('sha256', endpointSecret)
  .update(timestamp + '.' + rawBody).digest('hex');
if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(received)))
  throw new Error('bad signature');
// The timestamp is inside the signed payload → replay protection
// (reject if older than ~5 minutes).</pre>
<p><strong>Two practical rules:</strong> sign the <em>raw bytes</em> you received, not a re-serialized object (JSON key order changes break verification); and always include a timestamp or nonce in the signed data, because a signature alone does not stop replay.</p>
<div class="key-point">HMAC = shared secret, symmetric trust, fast, no proof of authorship. Signature = private/public key pair, publishable verification, provides non-repudiation. Choose a signature whenever more than one party must verify, or when "who sent this?" has to be provable.</div>`,
  },
  {
    q: 'How do you encrypt sensitive data at rest? Explain envelope encryption and KMS.',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>Encryption at rest comes in layers, and the interesting question is always <em>where the key lives</em>. Disk- or database-level encryption (TDE, EBS encryption) protects against stolen disks and backups but is transparent to anyone with a DB connection, so it does not protect against SQL injection or a rogue query. For real protection of specific columns you encrypt in the application with <strong>envelope encryption</strong>: a per-record data key (DEK) encrypts the field, and a master key (KEK) in a <strong>KMS</strong>/HSM encrypts the DEK, so the plaintext master key never leaves the KMS and rotation means re-wrapping DEKs rather than re-encrypting terabytes. The trade-off is that encrypted columns cannot be searched or indexed normally — that is what blind indexes or deterministic encryption are for.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Mã hóa dữ liệu khi lưu (at rest) có nhiều lớp, và câu hỏi đáng giá luôn là <em>key nằm ở đâu</em>. Mã hóa ở mức đĩa hoặc mức database (TDE, EBS encryption) chống được chuyện mất đĩa hay mất bản backup, nhưng nó trong suốt với bất kỳ ai có kết nối tới DB — nên không chống được SQL injection hay một truy vấn nội bộ tò mò. Muốn bảo vệ thật những cột dữ liệu nhạy cảm thì mã hóa ngay trong ứng dụng theo kiểu <strong>envelope encryption</strong>: mỗi bản ghi có một data key (DEK) để mã hóa dữ liệu, còn master key (KEK) nằm trong <strong>KMS</strong>/HSM dùng để mã hóa chính DEK đó. Nhờ vậy master key dạng plaintext không bao giờ ra khỏi KMS, và khi xoay khóa ta chỉ cần bọc lại các DEK chứ không phải mã hóa lại hàng terabyte dữ liệu. Đánh đổi là cột đã mã hóa thì không search hay index bình thường được — đó là lúc cần blind index hoặc mã hóa tất định (deterministic).</p></details>
<pre>// Layer 1: full-disk / TDE  → stops "someone stole the drive or backup"
//           BUT: any authenticated DB query still sees plaintext.
// Layer 2: application-level column encryption → stops DBAs, dumps,
//           log leaks, and SQL injection reading the column.

// Envelope encryption (the standard pattern):
1. Ask KMS for a data key      → returns {plaintextDEK, encryptedDEK}
2. AES-GCM encrypt the field with plaintextDEK
3. Store: ciphertext + nonce + encryptedDEK (+ key version)
4. Discard plaintextDEK from memory
5. To read: send encryptedDEK to KMS → get plaintextDEK → decrypt

// Why it scales:
//  - KMS never sees your data, only tiny keys
//  - rotate the KEK → only re-wrap DEKs (cheap), data untouched
//  - per-tenant/per-record DEKs limit blast radius
//  - "crypto-shredding": delete a tenant's DEK = their data is gone
//    (a clean way to satisfy GDPR "right to erasure")</pre>
<pre>// The searchability problem
// AES-GCM is randomized → WHERE ssn = ? cannot match. Options:
//  a) blind index: store HMAC(pepper, normalize(value)) in a second
//     column, index that, and use it for exact-match lookups
//  b) deterministic encryption (AES-SIV) → equality works, but leaks
//     which rows share a value
//  c) keep a searchable non-sensitive surrogate (last 4 digits)</pre>
<p><strong>Interviewer follow-ups:</strong> how does the service authenticate to the KMS? (platform identity — IAM role, workload identity — never a stored key); what about key rotation with old ciphertext? (keep a key/version tag per record and decrypt with the version it was written with); and what is the biggest risk? (losing keys — plan backup/recovery, because a lost KEK means permanent data loss).</p>
<div class="key-point">Disk encryption protects hardware; application-level envelope encryption protects data from your own database and your own bugs. Keep the master key in a KMS/HSM, use per-record DEKs with AES-GCM, tag the key version, and design the search story before you encrypt a column.</div>`,
  },
  {
    q: 'Why can you not use Math.random() for tokens? What is a CSPRNG?',
    difficulty: 'medium',
    a: `<div class="interview-answer"><p><code>Math.random()</code> and <code>java.util.Random</code> are statistically random but <strong>predictable</strong>: they are fast PRNGs whose internal state can be recovered from a few observed outputs, after which an attacker can compute every past and future value. Anything security-relevant — session IDs, password-reset tokens, API keys, CSRF tokens, IVs, salts — must come from a <strong>CSPRNG</strong> seeded by OS entropy: <code>crypto.randomBytes</code>/<code>crypto.getRandomValues</code> in JavaScript, <code>SecureRandom</code> in Java. Also make tokens long enough (≥128 bits) and store only their hash, because a guessable or leaked reset token is a full account takeover with no password needed.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><code>Math.random()</code> hay <code>java.util.Random</code> trông ngẫu nhiên về mặt thống kê nhưng <strong>đoán được</strong>: chúng là PRNG nhanh, và chỉ cần quan sát vài giá trị đầu ra là suy ra được trạng thái nội bộ, từ đó tính ra mọi giá trị trước đó và sau đó. Mọi thứ liên quan tới bảo mật — session ID, token reset mật khẩu, API key, CSRF token, IV, salt — đều phải sinh từ một <strong>CSPRNG</strong> lấy entropy từ hệ điều hành: <code>crypto.randomBytes</code> / <code>crypto.getRandomValues</code> trong JavaScript, <code>SecureRandom</code> trong Java. Ngoài ra token phải đủ dài (từ 128 bit trở lên) và trong DB chỉ nên lưu hash của nó, vì một token reset đoán được hoặc bị lộ là mất tài khoản mà không cần biết mật khẩu.</p></details>
<pre>// ❌ Predictable — an attacker who sees a few tokens can derive the rest
Math.random().toString(36).slice(2)      // ~52 bits, seeded from time
new Random().nextInt()                   // 48-bit LCG state, trivially solved
UUID from a non-crypto library / v1 UUID (contains MAC + timestamp)

// ✅ Cryptographically secure
crypto.randomBytes(32).toString('base64url')   // Node: 256 bits
crypto.randomUUID()                            // v4 from a CSPRNG
crypto.getRandomValues(new Uint8Array(32))     // browser
new SecureRandom().nextBytes(bytes)            // Java (use the no-arg ctor)
// Java: never seed it yourself — new SecureRandom(seed) can weaken it</pre>
<pre>// Password-reset token done properly
const raw = crypto.randomBytes(32).toString('base64url');  // send to user
await db.saveResetToken({
  userId, tokenHash: sha256(raw),       // store only the hash
  expiresAt: Date.now() + 15 * 60_000,  // short TTL
  usedAt: null,                         // single use
});
// On use: hash the incoming token, look it up, check expiry + unused,
// then invalidate it and all sessions of that user.</pre>
<p><strong>Related gotchas:</strong> sequential database IDs make enumeration trivial (use UUIDv4/ULID for anything exposed); a "random" filename from <code>Math.random()</code> can collide or be guessed; and in the browser, entropy for anything security-critical should come from the server or Web Crypto, never from <code>Date.now()</code>.</p>
<div class="key-point">Random-looking is not unpredictable. Use a CSPRNG (<code>SecureRandom</code>, <code>crypto.randomBytes</code>) with at least 128 bits of entropy for every token, salt, and IV — and store one-time tokens hashed, short-lived, and single-use.</div>`,
  },
  {
    q: 'What is a timing attack and why do you need constant-time comparison?',
    difficulty: 'tricky',
    a: `<div class="interview-answer"><p>A timing attack extracts secrets from <em>how long</em> a check takes. Ordinary string comparison returns at the first differing byte, so a token that shares more leading bytes with the real one is rejected a few nanoseconds later — measured over many requests, that difference lets an attacker recover an API key or HMAC byte by byte. The fix is a <strong>constant-time comparison</strong> (<code>crypto.timingSafeEqual</code>, <code>MessageDigest.isEqual</code>) that always inspects the whole input, plus comparing fixed-length hashes rather than raw secrets. The same reasoning applies at the application level: a login that answers "unknown user" instantly and "wrong password" after 300 ms of bcrypt leaks which accounts exist.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Timing attack là kiểu tấn công moi ra bí mật từ <em>thời gian</em> mà một phép kiểm tra tiêu tốn. So sánh chuỗi thông thường dừng ngay tại byte đầu tiên khác nhau, nên một token trùng nhiều byte đầu với token thật sẽ bị từ chối chậm hơn vài nanosecond — đo trên rất nhiều request, kẻ tấn công dò ra được API key hay HMAC từng byte một. Cách chữa là dùng so sánh <strong>thời gian hằng số</strong> (<code>crypto.timingSafeEqual</code>, <code>MessageDigest.isEqual</code>), luôn duyệt hết toàn bộ dữ liệu, và nên so sánh hash có độ dài cố định thay vì so trực tiếp secret. Cùng một lối suy nghĩ đó áp dụng ở tầng ứng dụng: một trang login trả lời "không có user này" ngay lập tức nhưng "sai mật khẩu" sau 300ms chạy bcrypt thì đã tự tiết lộ tài khoản nào tồn tại.</p></details>
<pre>// ❌ Leaks information through early return
if (providedToken === storedToken) { ... }   // stops at first mismatch
//  "aaaa..." → rejected after 1 byte
//  "3f8a..." → rejected after 4 bytes  ← attacker learns 3f8a is a prefix

// ✅ Constant time
crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));  // Node (equal len!)
MessageDigest.isEqual(a.getBytes(), b.getBytes());       // Java
// Or compare HMACs/hashes of both values — fixed length, no length leak:
timingSafeEqual(hmac(key, provided), hmac(key, stored));</pre>
<p><strong>Application-level timing leaks and their fixes:</strong></p>
<ul>
<li><strong>User enumeration on login</strong>: always run the password hash (against a dummy hash if the user does not exist) and return the same generic error.</li>
<li><strong>Signup / reset flows</strong>: reply "if that address exists we sent an email" instead of "email already registered".</li>
<li><strong>Coupon / license checks</strong>: look up by a hash of the code, not by comparing strings in a loop.</li>
</ul>
<p><strong>Honest caveat to state in an interview:</strong> over the public internet, network jitter hides most single-byte differences, so remote timing attacks are hard — but they are demonstrably practical on a LAN, against co-located services, and via statistical averaging over millions of requests. It costs one function call to be safe, so there is no reason to argue.</p>
<div class="key-point">Any comparison involving a secret must be constant-time, and any authentication response must take the same time regardless of the outcome. Use <code>timingSafeEqual</code>/<code>MessageDigest.isEqual</code>, compare fixed-length digests, and keep error messages identical.</div>`,
  },
  {
    q: 'How do you rotate keys and secrets without breaking running systems?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>Rotation must be designed as an <em>overlap</em>, never a swap. Every key gets an identifier and a state — <em>next</em>, <em>current</em>, <em>previous</em> — and verifiers accept both current and previous while only the current key signs or encrypts new data. For JWTs that is exactly what <code>kid</code> plus a JWKS endpoint is for: publish the new public key first, wait for caches to refresh, then start signing with it, and retire the old key after the longest token lifetime has passed. Symmetric secrets follow the same pattern (dual-accept window), encrypted data stores the key version alongside the ciphertext, and rotation should be automated and rehearsed — a rotation procedure you have never run is not a procedure.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Xoay khóa phải được thiết kế theo kiểu <em>gối đầu</em>, chứ không phải đổi một phát. Mỗi key có một mã định danh và một trạng thái — <em>next</em>, <em>current</em>, <em>previous</em>: bên verify chấp nhận cả key hiện tại và key trước đó, nhưng chỉ key hiện tại được dùng để ký hoặc mã hóa dữ liệu mới. Với JWT thì <code>kid</code> cộng endpoint JWKS chính là để làm việc này: công bố public key mới trước, chờ cache của các service refresh, rồi mới bắt đầu ký bằng key mới, và chỉ bỏ key cũ sau khi token có tuổi đời dài nhất đã hết hạn. Secret đối xứng cũng theo đúng mô hình đó (có một khoảng chấp nhận cả hai), dữ liệu đã mã hóa thì lưu kèm version của key, và toàn bộ quy trình nên được tự động hóa cũng như diễn tập — một quy trình xoay khóa chưa bao giờ chạy thật thì chưa gọi là quy trình.</p></details>
<pre>// JWT signing key rotation with JWKS — zero downtime
Day 0: publish JWKS = [ kid=A (current), kid=B (next, verify-only) ]
       → resource servers cache the JWKS (TTL minutes, not days)
Day 1: auth server starts signing with kid=B
       → tokens signed with A are still verifiable
Day 2: after max token TTL, drop A from JWKS

// Resource server: resolve the key by kid, never hardcode one key
const key = await jwks.getSigningKey(header.kid);   // cache + refresh on miss
// Must handle "unknown kid" by refetching the JWKS once (not per request —
// that is a DoS vector: rate-limit the refetch).</pre>
<pre>// Symmetric secret / API key rotation (dual-accept window)
verify(msg, sig) = matches(sig, hmac(currentKey, msg))
                || matches(sig, hmac(previousKey, msg));   // during overlap
// Encrypted data at rest: store the version, decrypt with it
{ v: 3, nonce, ciphertext }  → keys[v] decrypts; new writes use keys[latest]
// Lazy re-encryption: rewrite records with the newest key as they are touched</pre>
<p><strong>When rotation must be immediate</strong> (a key leaked): you no longer have the luxury of overlap — revoke the old key, force re-authentication of every session, invalidate refresh-token families, and expect errors. That is why routine rotation matters: it proves the machinery works before an incident forces you to use it.</p>
<p><strong>Also worth mentioning:</strong> short-lived dynamic credentials (Vault DB leases, cloud IAM roles) largely eliminate manual rotation; certificates need automated renewal (ACME/cert-manager) because expired certs cause more outages than attacks do; and rotation events belong in the audit log.</p>
<div class="key-point">Never swap a key in place — overlap it. Identify keys (<code>kid</code>/version), let verifiers accept current + previous, sign or encrypt only with current, retire the old key after the longest credential lifetime, and automate the whole thing.</div>`,
  },
  {
    q: 'What crypto mistakes do you look for in a code review?',
    difficulty: 'tricky',
    a: `<div class="interview-answer"><p>Almost every real-world crypto failure is a misuse, not a broken algorithm. The list I scan for: rolling custom crypto or "encrypting" with XOR/Base64; hardcoded or committed keys; <code>Cipher.getInstance("AES")</code> (silently ECB); a fixed or zero IV/nonce; unauthenticated CBC instead of an AEAD mode; MD5/SHA-1 still used for anything security-relevant; a fast hash for passwords; <code>Math.random()</code> for tokens; <code>==</code> comparison of secrets; disabled certificate verification (<code>rejectUnauthorized: false</code>, a trust-all <code>TrustManager</code>); and no key rotation story at all. The meta-rule is to use a vetted high-level library and keep primitives out of application code.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Gần như mọi sự cố crypto trong thực tế đều do dùng sai, không phải do thuật toán bị phá. Danh sách tôi luôn soi khi review: tự viết crypto hoặc "mã hóa" bằng XOR/Base64; key hardcode hoặc bị commit vào repo; <code>Cipher.getInstance("AES")</code> (âm thầm thành ECB); IV/nonce cố định hoặc toàn số 0; dùng CBC không kèm xác thực thay vì một mode AEAD; MD5/SHA-1 vẫn còn dùng cho mục đích bảo mật; dùng hàm băm nhanh để lưu mật khẩu; <code>Math.random()</code> để sinh token; so sánh secret bằng <code>==</code>; tắt kiểm tra certificate (<code>rejectUnauthorized: false</code>, hay một <code>TrustManager</code> tin mọi thứ); và hoàn toàn không có kế hoạch xoay khóa. Nguyên tắc bao trùm: dùng thư viện cấp cao đã được kiểm chứng và đừng để primitive crypto lọt vào code ứng dụng.</p></details>
<pre>// ❌ Real patterns found in production code
Cipher.getInstance("AES")                  // = AES/ECB/PKCS5Padding
new IvParameterSpec(new byte[16])          // static all-zero IV
MessageDigest.getInstance("MD5")           // for passwords or signatures
String.valueOf(new Random().nextLong())    // "unique" token
if (apiKey.equals(header)) { ... }         // timing leak
new TrustManager[]{ new X509TrustManager() { /* trust everything */ } }
axios.get(url, { httpsAgent: new https.Agent({ rejectUnauthorized: false }) })
AES key = "my-secret-key-123".getBytes()   // low-entropy key from a string
// and the classic: base64(json) called "encrypted payload"

// ✅ What good looks like
- AES-256-GCM with a fresh random 96-bit nonce per message
- keys from a KMS/Vault, referenced by id, rotated on a schedule
- passwords via argon2id/bcrypt through the framework's PasswordEncoder
- tokens from a CSPRNG, stored hashed, short TTL, single use
- constant-time comparison for every secret
- TLS verification ON everywhere, including internal calls
- high-level libraries: libsodium, Google Tink, JCA through a wrapper,
  Web Crypto — not hand-assembled primitives</pre>
<p><strong>Key derivation matters too:</strong> a password or passphrase is not a key — run it through HKDF (for high-entropy input) or argon2/PBKDF2 (for user input) instead of padding a string to 32 bytes. And derive separate keys for separate purposes rather than reusing one key for signing, encryption, and cookies.</p>
<div class="key-point">"Don't roll your own crypto" is really "don't touch primitives": pick AEAD + CSPRNG + a KDF through a vetted library, keep keys in a KMS with a rotation plan, and never disable certificate validation "temporarily".</div>`,
  },
  {
    q: 'What is mTLS and when would you use it between services?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>Normal TLS only checks the server's certificate. <strong>mTLS</strong> means both the client and the server show certificates, so each side proves who it is. This gives strong service-to-service identity and encryption inside microservices, without sharing secret keys. A service mesh usually handles the certificates, so the app code does not deal with them. mTLS fits internal traffic between services, while OAuth tokens fit public user traffic.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>TLS thông thường chỉ có client kiểm tra certificate của server. <strong>mTLS</strong> là cả hai bên đều trình certificate, nên mỗi bên đều biết chắc mình đang nói chuyện với ai. Nhờ đó các service trong hệ microservices có danh tính rõ ràng và kênh truyền được mã hóa, mà không phải chia sẻ secret dùng chung. Thường thì service mesh (Istio, Linkerd) lo việc phát và xoay certificate, code ứng dụng không phải làm gì cả. Nói ngắn gọn: mTLS phù hợp cho lưu lượng nội bộ giữa các service, còn token OAuth phù hợp cho lưu lượng của người dùng từ bên ngoài.</p></details>
<p><strong>mTLS (Mutual TLS)</strong> means both client and server verify each other's identity using certificates — not just the server (regular TLS).</p>
<pre>Regular TLS (HTTPS):
  Client → verifies server certificate → encrypted connection
  Server doesn't verify client identity

mTLS:
  Client → verifies server certificate ✅
  Server → verifies client certificate ✅
  Both sides know who they're talking to</pre>
<p><strong>How it works:</strong></p>
<ol>
<li>Each service has its own certificate signed by a trusted CA</li>
<li>On connection: server presents cert → client verifies</li>
<li>Client presents cert → server verifies</li>
<li>Both verified → encrypted communication established</li>
</ol>
<p><strong>When to use:</strong></p>
<ul>
<li>Service-to-service communication in microservices (zero-trust network)</li>
<li>API access for trusted partners (banking, healthcare)</li>
<li>IoT device authentication</li>
</ul>
<pre>// Common setup: service mesh handles mTLS automatically
// Istio/Linkerd inject sidecar proxies that handle certificates
// No code changes needed in your services</pre>
<div class="key-point">JWT proves user context (who is the user). mTLS proves service identity (which service is calling). They solve different problems and are often used together: mTLS between services + JWT for user context.</div>`,
  },
];
