# SSL, TLS, HTTPS - SDE3 Notes

## Why TLS Exists

Without TLS:

```text
Browser ---------------- Server
```

Data travels in plaintext.

Attackers on the network can:

* Read data (passwords, tokens, card details)
* Modify data
* Impersonate servers

TLS provides:

1. Confidentiality
2. Integrity
3. Authentication

---

# Confidentiality

Only sender and receiver can read the data.

Example:

```text
Transfer ₹10000
```

becomes encrypted ciphertext.

Achieved using encryption.

---

# Integrity

Ensures data was not modified during transit.

Example:

```text
Transfer ₹10000
```

cannot be changed to:

```text
Transfer ₹100000
```

without detection.

Achieved using MACs and authenticated encryption.

---

# Authentication

How does browser know:

```text
amazon.com
```

is actually Amazon?

TLS certificates prove server identity.

---

# Symmetric Encryption

Same key used for:

```text
Encrypt
Decrypt
```

Example:

```text
Key = ABC123
```

Algorithms:

* AES
* ChaCha20

Advantages:

* Extremely fast
* Used for actual HTTPS traffic

Problem:

How do both sides securely obtain the same key?

---

# Asymmetric Encryption

Uses:

```text
Public Key
Private Key
```

Properties:

* Public key can be shared
* Private key never leaves server

Example:

```text
Encrypt(PublicKey)
Decrypt(PrivateKey)
```

Advantages:

* Solves key exchange problem

Disadvantages:

* Slow
* CPU intensive

---

# Why TLS Uses Both

TLS combines both approaches.

Handshake:

```text
Asymmetric Cryptography
```

used for:

* Authentication
* Key exchange

Communication:

```text
Symmetric Cryptography
```

used for:

* HTTP requests
* Responses
* Cookies
* JWTs
* API payloads

Reason:

Symmetric encryption is much faster.

---

# SSL vs TLS

SSL (deprecated):

```text
SSL 1.0
SSL 2.0
SSL 3.0
```

Broken and insecure.

TLS (modern):

```text
TLS 1.0
TLS 1.1
TLS 1.2
TLS 1.3
```

Today:

```text
TLS 1.2
TLS 1.3
```

are used.

Important:

People still say:

```text
SSL Certificate
```

but almost always mean:

```text
TLS Certificate
```

---

# HTTPS

HTTPS = HTTP + TLS

HTTP:

```http
GET /balance
```

travels in plaintext.

HTTPS:

```text
Encrypted TLS Tunnel
```

contains:

```http
GET /balance
```

which cannot be read by intermediaries.

---

# TLS Handshake

Goal:

Securely establish a shared session key.

---

## Step 1: Client Hello

Browser sends:

```text
Supported TLS Versions
Supported Cipher Suites
Client Random
```

Example:

```text
TLS 1.3
AES256
ChaCha20
```

---

## Step 2: Server Hello

Server sends:

```text
Selected TLS Version
Selected Cipher Suite
Server Random
Certificate
```

---

## Step 3: Certificate Verification

Browser validates:

### Domain Match

```text
Certificate: amazon.com
Visited: amazon.com
```

Must match.

### Expiry Check

Certificate must be valid.

### CA Signature Check

Certificate must be signed by trusted CA.

If verification fails:

```text
NET::ERR_CERT_AUTHORITY_INVALID
```

---

## Step 4: Key Exchange

Browser and server derive a shared session key.

Modern TLS uses:

```text
ECDHE
```

instead of directly exchanging keys.

Result:

```text
Shared Session Key
```

known only to browser and server.

---

## Step 5: Secure Communication

All future traffic uses:

```text
AES
or
ChaCha20
```

with the session key.

---

# Certificate Authority (CA)

Certificate Authorities verify ownership of domains.

Examples:

* DigiCert
* Let's Encrypt
* GlobalSign

Browsers trust these CAs.

Certificate contains:

```text
Domain Name
Public Key
Issuer
Expiry Date
Digital Signature
```

Think of a certificate as:

```text
Passport for a website
```

---

# Perfect Forward Secrecy (PFS)

Modern TLS uses:

```text
ECDHE
```

to generate temporary session keys.

Benefit:

Even if server private key is leaked later:

```text
Old TLS Sessions
```

cannot be decrypted.

This is called:

```text
Perfect Forward Secrecy
```

---

# TLS 1.2 vs TLS 1.3

## TLS 1.2

Multiple round trips:

```text
Client Hello
Server Hello
Certificate
Key Exchange
```

Higher latency.

---

## TLS 1.3

Advantages:

* Fewer round trips
* Faster handshake
* Better security defaults
* Mandatory Forward Secrecy

Connection setup:

```text
1 RTT
```

instead of multiple.

---

# What Gets Encrypted?

Encrypted:

* URL path
* Headers
* Cookies
* Request body
* Response body
* JWT tokens

Example:

```text
https://amazon.com/orders
```

Encrypted:

```text
/orders
```

Not encrypted:

```text
IP Address
Port
```

Network still knows where you connected.

---

# TLS Termination

Typical production architecture:

```text
Browser
    |
 HTTPS
    |
Load Balancer
    |
 HTTP
    |
Backend
```

Load balancer performs:

```text
TLS Termination
```

Meaning:

* LB decrypts traffic
* Backend receives plaintext

Benefits:

* Lower backend CPU usage
* Centralized certificate management

---

# End-to-End TLS

More secure architecture:

```text
Browser
   |
 HTTPS
   |
LB
   |
 HTTPS
   |
Service A
   |
 HTTPS
   |
Service B
```

Benefits:

* Traffic encrypted everywhere
* Stronger security posture

---

# Common Production TLS Problems

## Expired Certificate

Users see:

```text
Connection Not Secure
```

---

## Wrong Hostname

Certificate:

```text
api.company.com
```

Request:

```text
payments.company.com
```

Validation fails.

---

## Missing Intermediate Certificates

Browser cannot build trust chain.

TLS handshake fails.

---

## TLS Handshake Latency

Can add noticeable delay.

Request timeline:

```text
DNS
TCP
TLS
TTFB
```

---

## Cipher Suite Mismatch

Client:

```text
TLS 1.3
```

Server:

```text
TLS 1.0
```

Handshake fails.

---

# SDE3 Interview Summary

TLS provides:

1. Confidentiality
2. Integrity
3. Authentication

HTTPS is HTTP running over TLS.

TLS works by:

1. Verifying server identity using certificates.
2. Performing key exchange using asymmetric cryptography.
3. Generating a shared session key.
4. Encrypting all communication using fast symmetric encryption.

Modern systems use TLS 1.3, ECDHE, AES/ChaCha20, Perfect Forward Secrecy, and often terminate TLS at load balancers or run end-to-end TLS between services.


# Asymmetric Encryption & Perfect Forward Secrecy (PFS) - SDE3 Notes

# Asymmetric Encryption

## Why Do We Need It?

Symmetric encryption requires both parties to know the same secret key.

Problem:

```text
Client -------- Internet -------- Server
```

How do we securely share that key?

If the key is sent over the network:

```text
Attacker can intercept it
```

Asymmetric cryptography solves this problem.

---

# Public Key and Private Key

Every server generates:

```text
Public Key
Private Key
```

Properties:

```text
Encrypt(Public Key)
↓
Decrypt(Private Key)

Sign(Private Key)
↓
Verify(Public Key)
```

Public Key:

```text
Can be shared with everyone
```

Private Key:

```text
Must remain secret
```

---

# Confidentiality Example

Server owns:

```text
Public Key  = P
Private Key = S
```

Browser wants to send:

```text
Hello
```

Browser encrypts:

```text
Encrypt("Hello", P)
```

Produces:

```text
X7A9KJ1...
```

Ciphertext travels over the network.

Only server can decrypt:

```text
Decrypt(X7A9KJ1..., S)
```

Result:

```text
Hello
```

---

# Why Public Key Cannot Decrypt?

Algorithms such as:

* RSA
* ECC

are based on mathematical problems that are easy in one direction and extremely hard in reverse.

RSA Example:

```text
Public Key:
(n,e)

Private Key:
(n,d)
```

Anyone can encrypt using:

```text
(n,e)
```

Only holder of:

```text
d
```

can decrypt.

Finding:

```text
d
```

from:

```text
(n,e)
```

requires factoring extremely large numbers, which is computationally infeasible.

---

# Why TLS Doesn't Use Public-Key Encryption for Everything

Asymmetric encryption is expensive.

Performance comparison:

```text
AES Encryption
≈ Thousands of times faster than RSA
```

Therefore:

```text
Asymmetric Crypto
↓
Used only during handshake

Symmetric Crypto
↓
Used for actual communication
```

---

# Old TLS (Without Perfect Forward Secrecy)

## Session Key Exchange

Browser generates:

```text
SessionKey = ABC123
```

Browser encrypts:

```text
Encrypt(ABC123, ServerPublicKey)
```

Sends encrypted session key to server.

Server decrypts:

```text
Decrypt(EncryptedSessionKey, ServerPrivateKey)
```

Now both know:

```text
ABC123
```

Actual traffic uses:

```text
AES(ABC123)
```

---

# Problem With This Approach

Suppose attacker records all traffic today:

```text
Encrypted Session Key
Encrypted HTTPS Traffic
```

Years later:

```text
Server Private Key Leaks
```

Attacker can now:

### Step 1

Recover session key:

```text
Decrypt(EncryptedSessionKey, ServerPrivateKey)
```

Gets:

```text
ABC123
```

### Step 2

Decrypt old traffic:

```text
AES Decrypt(Recorded Traffic)
```

Result:

```text
All historical traffic exposed
```

This is the major weakness of old TLS.

---

# Diffie-Hellman Key Exchange

Goal:

```text
Allow two parties to derive the same secret
without sending the secret itself.
```

This is the foundation of Perfect Forward Secrecy.

---

# Simplified Diffie-Hellman Example

Public values:

```text
g = 5
p = 23
```

Everyone knows these values.

---

## Browser Side

Chooses secret:

```text
a = 6
```

Computes:

```text
A = g^a mod p
```

Result:

```text
A = 8
```

Sends:

```text
A = 8
```

to server.

---

## Server Side

Chooses secret:

```text
b = 15
```

Computes:

```text
B = g^b mod p
```

Result:

```text
B = 19
```

Sends:

```text
B = 19
```

to browser.

---

## Shared Secret Generation

Browser computes:

```text
Shared Secret = B^a mod p
```

Result:

```text
2
```

Server computes:

```text
Shared Secret = A^b mod p
```

Result:

```text
2
```

Both independently derive:

```text
Shared Secret = 2
```

without ever transmitting:

```text
2
```

across the network.

---

# What Does Attacker See?

Attacker sees:

```text
g = 5
p = 23
A = 8
B = 19
```

Attacker never sees:

```text
a
b
```

Without knowing:

```text
a
or
b
```

attacker cannot derive the shared secret.

This security relies on:

```text
Discrete Logarithm Problem
```

which is computationally difficult.

---

# Perfect Forward Secrecy (PFS)

Modern TLS uses:

```text
ECDHE
=
Elliptic Curve Diffie-Hellman Ephemeral
```

Important word:

```text
Ephemeral
```

Meaning:

```text
Temporary
```

---

# How PFS Works

Every new TLS connection generates:

```text
Temporary Diffie-Hellman Key Pair
```

Example:

```text
Connection 1 → Temporary Key Pair 1
Connection 2 → Temporary Key Pair 2
Connection 3 → Temporary Key Pair 3
```

Each connection gets a completely new secret.

---

# Why Old Traffic Remains Secure

Suppose attacker records traffic today:

```text
Connection #1
Connection #2
Connection #3
```

Years later:

```text
Server Private Key Leaks
```

Attacker now possesses:

```text
Server Private Key
```

Question:

Can attacker decrypt old traffic?

Answer:

```text
No
```

---

# Why Not?

Because the server private key was NOT used to generate session keys.

In modern TLS:

```text
Server Private Key
↓
Used only for authentication
```

The session key came from:

```text
Ephemeral Diffie-Hellman Exchange
```

The temporary secrets:

```text
a
b
```

were:

* never transmitted
* never stored permanently
* destroyed after connection ends

Therefore attacker cannot reconstruct:

```text
Session Key
```

even after obtaining the server private key.

---

# TLS 1.3 Flow

## Server Private Key Purpose

Server proves identity:

```text
"I am really amazon.com"
```

by signing handshake data.

Browser verifies signature using:

```text
Server Public Key
```

This provides:

```text
Authentication
```

---

## Session Key Purpose

Session key is derived using:

```text
ECDHE
```

This provides:

```text
Confidentiality
```

---

# Key Insight

In TLS 1.3:

```text
Server Private Key
≠
Session Key
```

Server private key only proves identity.

Session keys are generated separately for every connection using ECDHE.

---

# Interview Answer

Without Perfect Forward Secrecy, session keys are protected by the server's long-term private key. If that private key is compromised later, previously recorded traffic can be decrypted.

With Perfect Forward Secrecy (ECDHE), each TLS connection generates a temporary Diffie-Hellman key pair and derives a unique session key that is never transmitted or stored long-term. Even if the server's private key is compromised years later, past session keys cannot be reconstructed, so previously recorded traffic remains secure.
