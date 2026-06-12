---
layout: page
title: PowerShell Temel Komutları
permalink: /windows/powershell/
---

# PowerShell Temel Komutları

PowerShell, Windows'un command-line shell'idir ve scripting dili olarak da kullanılabilir.

## 🔧 Temel Komutlar

### Sistem Bilgileri
```powershell
# Bilgisayar adını göster
hostname

# Sistem bilgilerini göster
Get-ComputerInfo

# İşletim sistemi versiyonunu göster
[System.Environment]::OSVersion
```

### Dosya İşlemleri
```powershell
# Dizin listele
Get-ChildItem

# Dosya oluştur
New-Item -Path ".\test.txt" -ItemType File

# Dosya sil
Remove-Item ".\test.txt"
```

### Kullanıcı ve İzinler
```powershell
# Mevcut kullanıcıyı göster
whoami

# Tüm kullanıcıları listele
Get-LocalUser

# Grup üyeliğini göster
Get-LocalGroupMember -Group "Administrators"
```

---

**İpucu:** `Get-Help` komutuyla herhangi bir cmdlet hakkında yardım alabilirsiniz.

```powershell
Get-Help Get-ChildItem -Full
```

[← Windows Rehberi'ne Dön](/windows/)