---
layout: page
title: Windows Kritik Privileges
permalink: /windows/privileges/
---

# Windows Kritik Privileges

Aşağıdaki privileges varsa **Privilege Escalation** yapılabilir:

---

## **SeImpersonatePrivilege** ⭐

**Ne Yapar?** Başka kullanıcıların (özellikle SYSTEM) kimliğine bürünebilme yetki.

**Komut Sonucu:** SYSTEM privilege'leri ile shell/komut çalıştırmak.

**Kullan:** PrintSpoofer, JuicyPotato, RoguePotato, GodPotato

**Kullanıcı için En Etkili:** ✅ En çok tercih edileni

---

## **SeTakeOwnership**

**Ne Yapar?** Dosya ve registry sahipliğini (ownership) değiştirebilme yetki. Böylece başka kullanıcılar tarafından sahip olunan dosyaları kendi yapabilir.

**Komut Sonucu:** SAM, SYSTEM registry dosyalarını kopyalayıp hash'leri elde etme veya kritik dosyaları düzenleme.

**Örnek:** SAM → Local Admin hash'leri → Cracking

**Kullanıcı için Fayda:** 🔧 Orta seviye etkili

---

## **SeDebugPrivilege**

**Ne Yapar?** Diğer process'lere debug yapabilme ve işlemlere erişip enjekte edebilme yetki.

**Komut Sonucu:** SYSTEM çalışan process'e kod enjekte ederek SYSTEM shell açma.

**Örnek:** lsass.exe'ye cmd.exe enjekte etme

**Kullanıcı için Fayda:** 🔧 Orta-Yüksek seviye etkili

---

## **SeBackupPrivilege**

**Ne Yapar?** Sistem dosyalarının backup'ını alabilme yetki (normal izinleri atlar).

**Komut Sonucu:** SAM, SYSTEM, SECURITY registry dosyalarını kopyalayıp offline hash extraction.

**Örnek:** `reg save HKLM\SAM C:\temp\SAM`

**Kullanıcı için Fayda:** 🔧 Yüksek seviye etkili

---

## **SeRestorePrivilege**

**Ne Yapar?** Backup'tan restore edebilme ve dosya izinlerini değiştirebilme yetki.

**Komut Sonucu:** Registry dosyalarını restore ederek sistem yapılandırmasını değiştirebilir (örn: SAM düzenleme).

**Örnek:** Silinen dosyaları geri koyma, registry değiştirme

**Kullanıcı için Fayda:** 🔧 Orta seviye etkili

---

[← Windows Rehberi'ne Dön](/windows/)