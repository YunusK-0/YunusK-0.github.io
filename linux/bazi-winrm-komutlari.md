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

