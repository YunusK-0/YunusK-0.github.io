---
layout: page
title: Windows Privilege Escalation
permalink: /windows/privesc/
---

# Windows Privilege Escalation

Privilege Escalation, düşük haklara sahip bir kullanıcıdan yüksek haklara (genellikle Administrator/SYSTEM) ulaşma tekniğidir.

## 🎯 Privilege Escalation Yöntemleri

### 1. UAC Bypass
Kullanıcı Hesabı Denetimi (User Account Control) olan sistemlerde yetkilendirme istemi atlama.

```powershell
# Mevcut UAC seviyesini kontrol et
Get-ItemProperty HKLM:\Software\Microsoft\Windows\CurrentVersion\Policies\System | Select ConsentPromptBehaviorAdmin
```

### 2. Unquoted Service Paths
Tırnak işareti olmayan servis yollarında DLL injection.

```powershell
# Tırnak işareti olmayan servisleri bul
Get-WmiObject win32_service | Where-Object {$_.pathname -notmatch '\\"'} | select Name,PathName
```

### 3. Weak File Permissions
Yanlış izinlerle yapılandırılmış dosyaları bulma.

```powershell
# Program Files'da izinleri kontrol et
icacls "C:\Program Files\"
```

### 4. Scheduled Tasks
Planlanmış görevlerde yapılandırma hatalarını bulma.

```powershell
# Planlanmış görevleri listele
Get-ScheduledTask | Select-Object TaskName, Description
```

### 5. Registry Permissions
Değiştirilebilir registry anahtarlarının bulunması.

```powershell
# Registry'de yazma izni olan anahtarları kontrol et
reg query HKEY_LOCAL_MACHINE
```

### 6. Credential Harvesting
Bellekte veya dosyalarda saklanmış credentials.

```powershell
# PowerShell geçmişinde kredisyonları ara
type $PROFILE | Select-String password
```

---

**İpucu:** Privilege Escalation sırasında daima işlemlerinizi test edin ve güvenlik açıklarını rapor edin.

[← Windows Rehberi'ne Dön](/windows/)