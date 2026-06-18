---
layout: page
title: Walkthroughs
permalink: /walkthroughs/
---

# 🎯 Walkthroughs & Case Studies

Bu sayfa, gerçek senaryolara dayalı adım adım rehberler ve penetrasyon testi case study'lerini içermektedir.

---

## 📚 Başlangıç

Walkthroughs'lar, teorik bilginin pratik uygulamasını gösteren, baştan sona tamamlanmış penetrasyon testi senaryolarıdır.

### Her Walkthrough İçerir:
- 🎯 **Senaryo** - Test edilen sistem ve hedefler
- 🔍 **Keşif Aşaması** - Bilgi toplama ve zayıflık bulma
- ⚔️ **Saldırı Aşaması** - Zayıflıklardan faydalanma
- 📈 **Privilege Escalation** - Yetkilerini artırma
- 🏁 **Post-Exploitation** - Sistem kontrolü

---

## 🔴 Başlangıç Seviyesi (Beginner)

Temel penetrasyon testi konseptlerini öğrenen takımlar için:

| Walkthrough | Konu | Zorluk |
|------------|------|--------|
| [Hutch - WebDAV Exploitation](/hutch/) | WebDAV Dosya Yükleme | 🟢 Kolay |
| [Jacko - H2 Database RCE](/jacko/) | H2 1.4.199 RCE | 🟡 Orta |
| TBD | Basit Privilege Escalation | 🟢 Kolay |
| TBD | LDAP Enumeration | 🟢 Kolay |

---

## 🟠 Orta Seviye (Intermediate)

Orta düzeyde sistem bilgisine sahip takımlar için:

| Walkthrough | Konu | Zorluk |
|------------|------|--------|
| [Internal - MS09-050 Exploitation](/internal/) | Windows SMB Exploitation | 🟡 Orta |
| TBD | Active Directory Lateral Movement | 🟡 Orta |
| TBD | Kerberos Exploitation | 🟡 Orta |
| TBD | Living off the Land (LOLBins) | 🟡 Orta |

---

## 🔴 İleri Seviye (Advanced)

Derinlemesine sistem bilgisine sahip takımlar için:

| Walkthrough | Konu | Zorluk |
|------------|------|--------|
| [Resourced - RBCD Exploitation](/resourced/) | Evil-WinRM, SharpHound ve RBCD | 🔴 Zor |
| [RBCD exploitation](/rbcd-exploitation/) | RBCD ile yetki devri ve Administrator yükseltme | 🔴 Zor |
| TBD | Domain Controller Compromise | 🔴 Zor |
| TBD | Evasion & Obfuscation Teknikleri | 🔴 Zor |
| TBD | Red Team Operasyonu Simülasyonu | 🔴 Zor |

---

## Resourced

- `sudo /usr/bin/impacket-secretsdump -ntds ntds.dit -security SECURITY local`
- Hashler elde edildi.
- `crackmapexec smb 192.168.58.175 -u ../users.txt -H pass.txt` ile spray yapıldı ve çalışan kullanıcı bulundu.
- Evil-WinRM ile erişim sağlandı.
- `.\SharpHound.exe -CollectionMethod All` çalıştırıldı.
- Generic All yetkisi gözlemlendi.
- RBCD exploit adımları için [RBCD exploitation](/rbcd-exploitation/) sayfasına bakın.

---

## 📄 Walkthrough Sayfa Yapısı

Bu sayfa artık her walkthrough için ayrı sayfalar listeler. Detaylı adımlar için ilgili başlığa tıklayınız.

---

## 🛠️ Araçlar & Kaynaklar

Her walkthrough'da kullanılan araçlar:

### Penetrasyon Testi Araçları
- **Nmap** - Port ve servis taraması
- **Metasploit** - Exploit ve payload'lar
- **Mimikatz** - Credential dumping
- **BloodHound** - AD mapping
- **Burp Suite** - Web uygulaması testi

### İşletim Sistemleri
- **Kali Linux** - Attacker makinesi
- **Windows Server** - Target sistemi
- **Ubuntu/Debian** - Alternative Linux targets

---

## 📋 Kontrol Listesi

Bir walkthrough başlamadan önce kontrol edin:

- [ ] Tüm araçlar yüklü mü?
- [ ] Test ortamı hazır mı? (sanal makina, lab, vb.)
- [ ] Network bağlantısı doğru mu?
- [ ] Yedekler alındı mı?
- [ ] İzinli bir test ortamında mı çalışıyoruz?

---

## 🚀 Başlarken

1. **Seviyelendirilmiş Sırada İlerleyin** - Beginner → Intermediate → Advanced
2. **Not Alın** - Her adımı dokümante edin
3. **Deneyin** - Rehberi takip etmeden kendiniz deneyin
4. **Karşılaştırın** - Sonra rehberi karşılaştırın
5. **Repeat** - Tüm adımları anlayana kadar tekrarlayın

---

## 📝 Katkıda Bulunma

Yeni walkthroughs eklemek için:
1. Detaylı senaryo yazın
2. Adım adım komutlar ekleyin
3. Output örnekleri sağlayın
4. Sorun giderme ipuçları ekleyin

---

## 📚 İlgili Sayfalar

- [Windows Rehberi](/windows/)
- [Linux Rehberi](/linux/)
- [Active Directory Basics](/windows/ad-basics/)
- [Privilege Escalation](/windows/privesc/)

---

**Son Güncelleme:** 2026-06-16
