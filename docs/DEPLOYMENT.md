# SPR Open Data Portal — Ubuntu Deployment Guide

End-to-end deployment steps untuk Ubuntu 22.04 LTS production server.
Ikut step dari atas ke bawah. Estimate: **2–3 jam** dari kosong ke live.

---

## 0. Maklumat yang ko kena ada sebelum mula

Tanya team SPR/hosting dulu, jangan rush hari Selasa:

- [ ] **SSH access** — IP server, username, SSH key (atau password sementara)
- [ ] **Domain public** — contoh `opendata.spr.gov.my` (DNS dah point ke IP server?)
- [ ] **SSL** — Let's Encrypt OK? Atau ada cert SPR sendiri (.crt/.key)?
- [ ] **WordPress URL internal** — contoh `http://wp-internal.spr.local` atau `http://10.x.x.x`
- [ ] **WordPress admin access** — siapa boleh ubah `wp-config.php`? Coordinate dgn team WP
- [ ] **GitHub repo akses** — kalau private, perlu SSH key di server untuk `git clone`
- [ ] **Firewall** — port 80, 443 dah dibuka? Port 22 (SSH) dari mana?

---

## 1. Server prep (one-time, ~30 min)

SSH ke server:
```bash
ssh username@your-server-ip
```

### 1.1 Update system

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git build-essential ufw
```

### 1.2 Setup firewall

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'    # ports 80 + 443
sudo ufw enable
sudo ufw status
```

### 1.3 Install Node.js 20 LTS

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version    # patut keluar v20.x.x
npm --version
```

### 1.4 Install PM2 (process manager)

```bash
sudo npm install -g pm2
pm2 --version
```

### 1.5 Install Nginx

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

Test: buka `http://your-server-ip` dalam browser → patut nampak "Welcome to nginx".

### 1.6 Install Certbot (untuk SSL Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 1.7 Create app user (optional tapi recommended)

Jangan run app sebagai `root` atau `ubuntu`. Create dedicated user:

```bash
sudo adduser spr --disabled-password --gecos ""
sudo usermod -aG sudo spr   # sementara, untuk setup. boleh remove lepas siap
```

---

## 2. Clone & build app (~15 min)

### 2.1 Switch ke user app

```bash
sudo su - spr
cd /home/spr
```

### 2.2 Clone repo

**Kalau repo PUBLIC:**
```bash
git clone https://github.com/safuanShaharum/spr-portal.git
# atau lepas SPR transfer:
# git clone https://github.com/spr-malaysia/spr-portal.git
cd spr-portal
```

**Kalau repo PRIVATE** — kena generate SSH key dulu:
```bash
ssh-keygen -t ed25519 -C "spr-server" -f ~/.ssh/id_ed25519 -N ""
cat ~/.ssh/id_ed25519.pub
# Copy public key, paste ke GitHub → Settings → Deploy Keys (Read-only)
git clone git@github.com:safuanShaharum/spr-portal.git
cd spr-portal
```

### 2.3 Install dependencies

```bash
npm ci    # faster + reproducible vs npm install
```

### 2.4 Setup env

```bash
cp .env.example .env.production.local
nano .env.production.local
```

Isi:
```env
WP_API_URL=http://wp-internal.spr.local/wp-json
REBUILD_TOKEN=GENERATE_RANDOM_STRING_HERE
NODE_ENV=production
```

Generate token:
```bash
openssl rand -hex 32
# Copy output → masukkan dalam REBUILD_TOKEN
```

### 2.5 Build

```bash
npm run build
# Patut nampak: ✓ Compiled successfully
# Note: prebuild jalan convert-excel.mjs → download Excel dari WP internal
```

Kalau build fail dengan WP connection error, confirm:
- WP_API_URL betul (test: `curl http://wp-internal.spr.local/wp-json/spr/v1/data-file`)
- Server boleh reach WP internal (sama VLAN/subnet)

### 2.6 Test run

```bash
npm start
# Patut: ▲ Next.js 14.x  - Local: http://localhost:3000
```

`Ctrl+C` untuk stop. Next step: PM2 supaya jalan background.

---

## 3. PM2 setup (~5 min)

### 3.1 Start dengan ecosystem config

```bash
pm2 start ecosystem.config.js --env production
pm2 status   # patut "online"
pm2 logs spr-portal   # tail logs untuk confirm tiada error
```

### 3.2 Persist across reboots

```bash
pm2 save
sudo pm2 startup systemd -u spr --hp /home/spr
# Run command yang PM2 print (copy-paste ke terminal)
```

Test: `sudo reboot`, login balik, `pm2 status` patut auto-restart.

---

## 4. Nginx config (~20 min)

### 4.1 Copy config

```bash
sudo cp /home/spr/spr-portal/nginx/spr-portal.conf /etc/nginx/sites-available/spr-portal
sudo ln -s /etc/nginx/sites-available/spr-portal /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
```

### 4.2 Edit untuk match domain & WP URL

```bash
sudo nano /etc/nginx/sites-available/spr-portal
```

Tukar 2 tempat:
- `server_name opendata.spr.gov.my;` → domain sebenar
- `proxy_pass http://wp-internal.spr.local/...;` → URL WP internal sebenar

### 4.3 Test config

```bash
sudo nginx -t   # patut "syntax is ok" + "test is successful"
sudo systemctl reload nginx
```

### 4.4 Test HTTP (sebelum SSL)

Browser → `http://opendata.spr.gov.my` → patut nampak portal SPR.

### 4.5 Enable SSL

```bash
sudo certbot --nginx -d opendata.spr.gov.my
# Pilih option auto-redirect HTTP → HTTPS
```

Auto-renewal:
```bash
sudo systemctl status certbot.timer   # patut "active"
```

Browser → `https://opendata.spr.gov.my` → padlock ada.

---

## 5. WordPress coordination (~30 min, team WP buat)

WP kena output URL imej/PDF guna domain public, bukan internal hostname.

### Option A — Update siteurl (recommended, paling clean)

Team WP edit `wp-config.php`:

```php
define('WP_HOME', 'https://opendata.spr.gov.my');
define('WP_SITEURL', 'https://opendata.spr.gov.my');
```

⚠️ **Caveat**: WP admin sekarang akan accessible via `https://opendata.spr.gov.my/wp-admin/`. Kalau tak nak admin public-facing, kena guna Option B atau restrict admin via nginx (lihat troubleshooting).

### Option B — Filter URL output sahaja

Team WP install `wp-snippets/spr-siteurl-fix.php` (file dalam repo) sebagai mu-plugin. Snippet ni rewrite URL output WP tanpa ubah `siteurl` setting.

Lepas tu test API response — patut nampak URL imej guna `https://opendata.spr.gov.my/wp-content/...`:
```bash
curl https://opendata.spr.gov.my/api/infografik?per_page=1 | grep -o '"image":"[^"]*"'
```

---

## 6. Auto-rebuild webhook (~15 min)

Bila team SPR upload Excel baru di WP, frontend kena rebuild automatic.

### 6.1 Webhook endpoint dah ada

[app/api/rebuild/route.ts](../app/api/rebuild/route.ts) — guarded by `REBUILD_TOKEN` env var.

### 6.2 Setup WP plugin/snippet

Team WP install [wp-snippets/spr-rebuild-trigger.php](../wp-snippets/spr-rebuild-trigger.php) (mu-plugin).

Edit constants dalam file:
```php
define('SPR_REBUILD_URL', 'https://opendata.spr.gov.my/api/rebuild');
define('SPR_REBUILD_TOKEN', 'SAMA_DENGAN_REBUILD_TOKEN_DI_UBUNTU');
```

### 6.3 Test manually

```bash
curl -X POST https://opendata.spr.gov.my/api/rebuild \
  -H "Authorization: Bearer YOUR_REBUILD_TOKEN"
# Patut: {"ok":true,"message":"Rebuild triggered"}
```

Tail logs untuk confirm deploy script jalan:
```bash
tail -f /home/spr/spr-portal/deploy.log
```

Lepas tu test upload fail Excel baru di WP → tunggu 2-3 minit → frontend patut update.

---

## 7. Verification checklist

Lepas semua siap, test page-page ni:

- [ ] `https://opendata.spr.gov.my/` — homepage load, FactTicker bergerak, SorotanData cards muncul
- [ ] DevTools → Network — confirm **TIADA call ke `wp-internal.spr.local`** dari browser
- [ ] `/katalog?bahagian=persempadanan` — table load, data muncul
- [ ] `/infografik-pilihan-raya` — tabs work, imej infografik LOAD (penting!)
- [ ] Klik download PDF infografik — file turun OK
- [ ] `/cari?q=pemilih` — search results render
- [ ] Footer counter (today/month/year/downloads) bukan 0
- [ ] FAQ link dari homepage `/katalog?bahagian=soalan-lazim` — PDF link work
- [ ] Replace Excel di WP → tunggu 2-3 min → table data update tanpa manual intervention

---

## 8. Troubleshooting

### Build fail: "Network error fetching .../spr/v1/data-file"

Server tak boleh reach WP internal. Test:
```bash
curl -v http://wp-internal.spr.local/wp-json/spr/v1/data-file
```
Kalau timeout: networking issue. Coordinate dgn hosting team.

### Imej infografik 404 di browser

WP siteurl masih guna internal hostname. Check:
```bash
curl https://opendata.spr.gov.my/api/infografik?per_page=1 | grep image
```
Kalau URL imej `http://wp-internal...`, WP belum reconfigure (Section 5).

### PM2 process die/restart loop

```bash
pm2 logs spr-portal --lines 100
```
Common: env var hilang. Check `.env.production.local` ada dan PM2 load betul (`pm2 env 0`).

### Restrict WP admin (kalau pakai Option A siteurl)

Add dalam nginx config:
```nginx
location /wp-admin/ {
    allow 10.0.0.0/8;   # internal subnet sahaja
    deny all;
    proxy_pass http://wp-internal.spr.local/wp-admin/;
}
```

---

## 9. Day-to-day operations

| Task | Command |
|---|---|
| Tengok status app | `pm2 status` |
| Tail logs | `pm2 logs spr-portal` |
| Manual deploy | `cd /home/spr/spr-portal && ./deploy.sh` |
| Restart app | `pm2 restart spr-portal` |
| Reload nginx | `sudo nginx -s reload` |
| Renew SSL manual | `sudo certbot renew` |
| Cek disk space | `df -h` |
| Cek memory | `free -h` |

---

## 10. Bila SPR ambil alih repo

Lepas transfer ownership ke GitHub org SPR:

```bash
cd /home/spr/spr-portal
git remote set-url origin <NEW_REPO_URL>
git remote -v   # verify
git pull        # test
```

Kalau private + SSH: regenerate deploy key ke org baru.
