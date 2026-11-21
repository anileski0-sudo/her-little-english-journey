# Her Little English Journey ♡

> *One word, one step, one dream at a time.*

YDS sınavına hazırlanan bir İngilizce öğretmeni için hazırlanmış, vintage seyahat defteri temalı kişisel çalışma günlüğü.

## Neler var?

| Bölüm | Ne yapar? |
|---|---|
| **Home** | Karşılama, YDS geri sayımı (gün / saat / dakika), bugünkü kelime ilerlemesi, konu ilerlemesi, haftalık çalışma grafiği, günün notu |
| **My Topics** | Konu ekle / düzenle / sil, ilerleme %, tamamla (konfeti + motivasyon mesajı), tekrar aktif et, kategori filtresi |
| **Daily Words** | Her gün tarih bazlı 30 B1/B2 kelime (543 kelimelik havuz), flashcard, *Reveal Meaning*, *I know this!* / *Practice again*, 30/30 kutlama ekranı, önceki günler |
| **Review** | Tekrar listesi, liste ve flashcard modu, öğrenildi işaretleme, listeden çıkarma |
| **Journal** | Günlük çalışma kaydı (süre, konu, ruh hali, not), düzenle / sil, haftalık hedef, günlük grafik |
| **Progress** | Toplam istatistikler, grafikler, 12 rozet, streak, 24 landmark'lık sticker pasaportu |
| **Motivation Wall** | Kâğıt notlar ve "New motivation note" butonu (üst menüdeki kalp ikonu) |
| **Settings** | Sınav tarihi/saati, günlük kelime ve çalışma hedefi, 4 tema, JSON yedek al / yükle, sıfırlama |

Tüm veriler tarayıcının `localStorage` alanında saklanır (sunucu, hesap, API anahtarı yok). Bu yüzden **Settings → Export data** ile ara sıra yedek almak iyi olur; aynı dosya başka bir cihaza **Import data** ile taşınabilir.

## GitHub Pages'te yayınlama (kod bilmeden)

1. GitHub'da **`her-little-english-journey`** adında yeni bir repository oluştur (Public).
2. Bu klasördeki dosyaların hepsini repository'ye yükle:
   - En kolayı: [GitHub Desktop](https://desktop.github.com) ile klasörü ekleyip **Publish repository**.
   - Ya da web'den **Add file → Upload files** ile sürükle-bırak. Mac'te gizli `.github` klasörünü görmek için Finder'da **Cmd + Shift + .** tuşlarına bas; bu klasör de yüklenmeli.
   - `node_modules` ve `dist` klasörlerini yüklemene gerek yok.
3. Repository'de **Settings → Pages → Build and deployment → Source** kısmını **GitHub Actions** yap.
4. **Actions** sekmesinde "Deploy to GitHub Pages" iş akışı çalışır (1–2 dakika). Bittiğinde site şu adreste açılır:
   `https://<github-kullanıcı-adın>.github.io/her-little-english-journey/`

Repository adını değiştirirsen `vite.config.ts` içindeki `base` değerini de aynı adla güncellemek gerekir.

## Geliştirici notları

```bash
npm install
npm run dev      # yerel geliştirme
npm test         # birim testleri (kelime havuzu, günlük set, storage, import, rozetler…)
npm run build    # üretim derlemesi → dist/
```

- React 18 + TypeScript + Vite 5 + Tailwind CSS 3 + Lucide ikonları
- HashRouter kullanıldığı için GitHub Pages'te sayfa yenileme 404 vermez
- Veri yapısı versiyonludur (`src/lib/storage.ts` → `DATA_VERSION` ve `migrations`)
- Landmark illüstrasyonları bu proje için elle çizilmiş SVG'lerdir (`src/stickers/landmarks.tsx`); harici görsel yüklemesi yoktur, bir çizim hata verirse otomatik yedek görünüm gösterilir
- Kelime havuzu: `src/data/words1.ts … words6.ts` (`kelime|tür|seviye|Türkçe|örnek|örnek çeviri|eş anlamlı`)
