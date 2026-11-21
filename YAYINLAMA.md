# Siteyi İnternette Yayınlama Rehberi

Terminal veya kod gerekmez. Her şey tarayıcıdan, GitHub'ın sitesinden yapılır. Toplam süre yaklaşık 10 dakika.

Sonunda siten şu adreste açılacak:
**`https://KULLANICI-ADIN.github.io/her-little-english-journey/`**

---

## Adım 1 — GitHub'a giriş yap
[github.com](https://github.com) adresine git ve giriş yap. Hesabın yoksa **Sign up** ile ücretsiz hesap aç.

## Adım 2 — Yeni bir repository (proje kutusu) oluştur
1. Sağ üstteki **+** işaretine tıkla → **New repository**.
2. **Repository name:** `her-little-english-journey`
   (Adı tam olarak böyle yaz. Farklı bir ad kullanırsan site adresi çalışmaz.)
3. **Public** seçili olsun. (GitHub Pages ücretsiz planda sadece Public projelerde çalışır.)
4. "Add a README file" kutusunu **işaretleme**.
5. **Create repository** butonuna bas.

## Adım 3 — Gizli dosyaları görünür yap (Mac)
Proje klasöründe adı nokta ile başlayan iki gizli öğe var: **`.github`** klasörü (otomatik yayın ayarı) ve **`.gitignore`**. Bunlar da yüklenmeli.
- Finder'da proje klasörünü aç ve **Cmd + Shift + .** (nokta) tuşlarına birlikte bas.
- Artık `.github` ve `.gitignore` soluk renkte görünür.

## Adım 4 — Dosyaları yükle
1. Az önce oluşturduğun boş repository sayfasında **"uploading an existing file"** bağlantısına tıkla.
2. Finder'da `her-little-english-journey` klasörünün **içine** gir, **Cmd + A** ile her şeyi seç (`.github` dahil).
3. Seçtiklerini tarayıcıdaki yükleme alanına **sürükle bırak**.
4. Yükleme bitince sayfanın altında **Commit changes** butonuna bas.
5. Kontrol et: dosya listesinde `.github`, `src`, `public`, `package.json` görünmeli.

> `node_modules` ve `dist` klasörleri yoksa sorun değil, bunlar GitHub'da otomatik oluşturulur.

## Adım 5 — GitHub Pages'i aç
1. Repository'de üstteki **Settings** sekmesine tıkla.
2. Soldaki menüden **Pages**'e tıkla.
3. **Build and deployment → Source** kısmında **GitHub Actions** seç.

## Adım 6 — Yayını başlat
1. Üstteki **Actions** sekmesine tıkla.
2. Soldaki **Deploy to GitHub Pages**'e tıkla.
3. Sağdaki **Run workflow** → yeşil **Run workflow** butonuna bas.
4. 1–2 dakika bekle. Yeşil ✓ çıkınca yayın tamamdır.
5. Siteyi aç: **Settings → Pages** sayfasının üstünde **"Your site is live at …"** bağlantısı görünür.

---

## Sonradan değişiklik yapmak istersen
Herhangi bir dosyayı GitHub'da güncellediğinde (yükleme veya düzenleme) site **otomatik olarak** yeniden yayınlanır.

## Bir sorun olursa
| Belirti | Çözüm |
|---|---|
| Actions'ta kırmızı ✗ var | Adım 5'te Source'un **GitHub Actions** olduğundan emin ol, sonra Adım 6'yı tekrarla. |
| Site açılıyor ama boş beyaz sayfa | Repository adının tam olarak `her-little-english-journey` olduğunu kontrol et. |
| Actions sekmesinde iş akışı yok | `.github` klasörü yüklenmemiş. Adım 3 ve 4'ü tekrarla. |
| 404 hatası | İlk yayından sonra adresin aktifleşmesi birkaç dakika sürebilir; biraz bekleyip yenile. |

## Verilerin hakkında
İlerleme (kelimeler, konular, günlük) tarayıcıda saklanır. Telefon ve bilgisayar ayrı ayrı tutar. Ara sıra **Settings → Export data** ile yedek almayı unutma.
