# Checklist Deploy — Portal Data Terbuka SPR

Panduan langkah-demi-langkah untuk deploy versi terkini ke server production
**10.24.131.103**. Aliran: GitHub → Gitea (team SPR) → server.

> Commit terkini yang patut ada di `main`: **`a38f489`** — "Merge feat/content-search-kawasan"
> (fix search tahun PRU + content search DUN/Parlimen + gambar hero baru)

---

## A) Sync Gitea ← GitHub

Pastikan branch `main` di Gitea team SPR dah dapat commit terkini dari GitHub.

- [ ] **Jika Gitea guna Mirror:** buka repo di Gitea → **Settings → Mirror Settings → Synchronize Now**
- [ ] **Jika manual git:** `git pull github main` kemudian `git push gitea main`
- [ ] Sahkan commit teratas di Gitea = `a38f489`

---

## B) Deploy di server (SSH)

```bash
ssh odadmin@10.24.131.103
```

### Cara mudah (disyorkan) — guna deploy.sh
```bash
cd /home/spr/spr-portal        # tukar ikut path sebenar app
./deploy.sh
```
`deploy.sh` buat semua secara automatik:
1. `git fetch origin` + `git reset --hard origin/main`
2. `npm ci` (hanya jika dependency berubah)
3. `npm run build` (auto convert Excel dari WP + jana index kawasan)
4. `pm2 reload spr-portal` (zero-downtime)

### Cara manual (setara deploy.sh)
```bash
cd /home/spr/spr-portal
git fetch origin
git reset --hard origin/main
npm ci
npm run build
pm2 reload spr-portal --update-env
```

### Nota penting
- `origin` di server MESTI tunjuk ke **Gitea**, bukan GitHub. Semak: `git remote -v`
- `git reset --hard` selamat — `.env.local` (WP_API_URL, REBUILD_TOKEN) & `public/data/`
  semua gitignored, tak tersentuh.
- Build ambil ~1–3 minit (ada data besar untuk convert).

---

## C) Verify selepas deploy

```bash
pm2 status                                   # spr-portal patut "online"
tail -20 /home/spr/spr-portal/deploy.log     # cari "✓ Deploy complete"
```

Buka `http://10.24.131.103/` dan semak:
- [ ] Gambar hero KL Skyline baru muncul (hard reload: Ctrl+Shift+R)
- [ ] Search "pru 14" → papar data PRU-14 (bukan PRU-15)
- [ ] Search "kajang" → keluar hasil kumpulan **Kawasan** → klik → jadual auto-tapis ke Kajang

---

## D) (Berasingan, tak blocking) Pasang snippet WP — Popular Searches

Untuk chip "POPULAR" ikut carian sebenar user. Pasang di **DUA** WordPress:

- [ ] `http://10.24.131.103/wp-admin` → **Snippets → Add New**
- [ ] `https://cmsodspr.sawangville.dev/wp-admin` → **Snippets → Add New**

Langkah setiap WP:
1. Title: `SPR Search Tracker`
2. Paste isi `wp-snippets/spr-search-tracker.php` — **tanpa baris `<?php`** (mula dari `/**`)
3. Pilih **"Run snippet everywhere"**
4. **Save Changes and Activate**
5. Verify:
   ```bash
   curl "http://10.24.131.103/wp-json/spr/v1/popular-searches?limit=3"
   # Berjaya jika pulang: {"data":[]}
   ```

> Tanpa snippet ni portal tetap elok — chip guna senarai fallback. Kiraan carian
> berasingan setiap WP (dua DB, tak bergabung).

---

## Rollback (jika ada masalah)
```bash
cd /home/spr/spr-portal
git reset --hard <commit-lama>   # cth commit sebelum ini
npm run build && pm2 reload spr-portal --update-env
```
