---
layout: page
title: Resourced - RBCD Exploitation
permalink: /resourced/
---

# Resourced - RBCD Exploitation

## 📌 Senaryo
Resourced makinesine erişim sağlandıktan sonra, Active Directory üzerinde yetki yükseltme için GenericAll yetkisi araştırıldı ve RBCD exploitation süreci başlatıldı.

## 🔍 Keşif Aşaması

- `sudo /usr/bin/impacket-secretsdump -ntds ntds.dit -security SECURITY local` ile hashler toplandı.
- `crackmapexec smb 192.168.58.175 -u ../users.txt -H pass.txt` ile spray yapıldı ve çalışan kullanıcı bulundu.
- Evil-WinRM ile erişim sağlandı.

## ⚔️ Privilege Escalation

- `.\SharpHound.exe -CollectionMethod All` çalıştırıldı.
- BloodHound ve veri analizi sonucunda GenericAll yetkisi gözlemlendi.
- RBCD exploitation için sonraki adım [RBCD exploitation](/rbcd-exploitation/) sayfasında yer almaktadır.

## 🧠 Not

Resourced makinesi, `sudo secretsdump` ve `crackmapexec` işlemleri ile elde edilen erişim sonrası RBCD attack chain'i için hazırlık aşamasıdır. RBCD spesifik komutlar ve yetki devri süreci [RBCD exploitation](/rbcd-exploitation/) sayfasında anlatılmaktadır.
