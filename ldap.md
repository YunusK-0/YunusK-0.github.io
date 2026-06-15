---
layout: page
title: LDAP & SMB Rehberi
permalink: /ldap/
---

# LDAP (Eğer açık ise)

LDAP servisi açıksa hedeften bilgi çekmek için örnek `ldapsearch` komutları:

### Search specific object class
```bash
ldapsearch -x -H ldap://target.com -b "dc=example,dc=com" "(objectClass=person)"
```
- `-x` : simple auth (SASL değil)
- `-H` : LDAP sunucusu (protocol + host)
- `-b` : base DN (arama kökü)
- filtre: `(objectClass=person)` gibi sınıfa göre arama

### Get all attributes
```bash
ldapsearch -x -H ldap://target.com -b "dc=example,dc=com" "*"
```
- Tüm attribute'ları döker; çıktı büyük olabilir.

Notlar:
- Çıktıda `description`, `userPassword`, `password`, `mail`, `memberOf`, `telephoneNumber` gibi alanları arayın. `description` veya benzeyen alanlar bazen servis/credential bilgisi içerebilir.
- Base DN bilinmiyorsa üst seviyeden (`dc=example,dc=com` yerine `dc=corp,dc=local` veya organization bazlı) denenebilir.
- Eğer anonymous bind engellenmişse, elde ettiğiniz kimlik bilgileriyle yeniden bağlanmayı deneyin.

---

# SMB - `smbclient` ile bağlanma ve listeleme

LDAP'tan kullanıcı/parola veya kullanıcı listesi elde ettiyseniz, SMB paylaşımına bağlanmak için `smbclient` veya CIFS mount kullanılabilir.

### Paylaşımları listeleme (anonymous)
```bash
smbclient -L //TARGET -N
```
- `-L //TARGET` : hedefdeki paylaşımları listeler
- `-N` : parola istemeden (anonymous) deneme

### Paylaşımları listeleme (kullanıcı ile)
```bash
smbclient -L //TARGET -U username
# veya kullanıcı ve parolayı inline:
# smbclient -L //TARGET -U 'username%password'
```
- Bu komut paylaşım isimlerini ve açıklamaları gösterir.

### Bir paylaşıma bağlanma
```bash
smbclient //TARGET/Share -U 'username%password'
```
Bağlandıktan sonra `smbclient` içinde kullanılacak temel komutlar:
- `ls` / `dir` : dosya ve klasörleri listeler
- `cd <dir>` : uzak dizine girer
- `lcd <dir>` : lokal çalışma dizinini değiştirir
- `get <remote-file>` : dosya indirir
- `mget <pattern>` : çoklu dosya indirir
- `put <local-file>` : dosya upload eder
- `del <file>` : dosya siler
- `exit` : çıkış

### CIFS ile mount (Linux)
```bash
sudo mount -t cifs //TARGET/Share /mnt/share -o username=USER,password=PASS,vers=3.0
```
- `vers=` parametresi hedefin SMB versiyonuna göre değiştirilebilir (2.0/3.0 vb.).

### Windows tarafında bağlanma (örnek)
```powershell
net use Z: \\TARGET\Share /user:DOMAIN\\username Password
```

Not: LDAP'dan elde edilen kullanıcılar/kredensiyaller SMB erişimi için kullanılmalıdır; eğer parola bulunmuyorsa brute-force veya parola tahmin yöntemleri sınavda uygun olmayabilir, dikkatli olun.

---

# Evil-WinRM ile doğrulama

SMB veya LDAP ile elde ettiğiniz geçerli Windows kimlik bilgileriyle `evil-winrm` kullanarak WinRM üzerinden doğrulama yapılmalıdır. `evil-winrm` interaktif bir shell sağlar ve genelde post-exploitation için tercih edilir.

### Örnek kullanım
```bash
evil-winrm -i TARGET -u username -p 'Password123'
```
- `-i` : hedef IP
- `-u` / `-p` : kullanıcı ve parola

Kurulum (örnek):
```bash
gem install evil-winrm
# veya Kali paketleri üzerinden
apt install evil-winrm
```

Not: `evil-winrm` ile bağlantı kurulamazsa WinRM servis ayarları, port (5985/5986) veya HTTPS zorlaması kontrol edilmelidir.

---

*İş akışı önerisi:* LDAP ile kullanıcı/attr toplandı → hassas alanlar (`description`, `password`) aranır → gerekli cred bulunduysa `smbclient` ile paylaşımlar listelenir ve bağlanılır → erişim doğrulandıktan sonra `evil-winrm` ile WinRM shell kontrolü yapılır.
