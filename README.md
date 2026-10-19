# Alperen'in Doğum Günü Macerası

Blok dünyası estetiğinde, mobil uyumlu ve etkileşimli bir doğum günü sitesi.

## Kişiselleştirme

`dist/script.js` içindeki `CONFIG` alanından isim, doğum yılı ve doğum gününün bu yıl geçip geçmediğini düzenleyebilirsiniz.

## Müzik ekleme

Kullanma hakkına sahip olduğunuz MP3 dosyasını `dist/assets/dogum-gunu-sarkisi.mp3` adıyla ekleyin. Müzik pasta bölümü ekrana geldiğinde başlar. Tarayıcı otomatik oynatmayı engellerse sağ üstteki “Müzik” düğmesine dokunmak gerekir.

## Yerel önizleme

Proje klasöründe `python3 -m http.server 8000 --directory dist` komutunu çalıştırıp `http://localhost:8000` adresini açın.

## Docker ile çalıştırma

```bash
docker compose up --build -d
```

Site `http://localhost:43127` adresinde açılır. Durdurmak için:

```bash
docker compose down
```

Yalnızca image oluşturmak isterseniz:

```bash
docker build -t alperen-dogum-gunu .
docker run --rm -p 8080:80 alperen-dogum-gunu
```
