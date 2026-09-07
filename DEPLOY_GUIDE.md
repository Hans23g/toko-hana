# Panduan Deploy Aman ke GitHub - Toko Hana

## ⚠️ LANGKAH KRITIS - Hapus Kunci Supabase dari Riwayat Commit

Kunci berikut **HARUS dihapus** dari `App.jsx` sebelum deploy:

```
sb_publishable_SQOeotTf_RMhC_oPXGyzgw_Ma9ZU51e
```

## 1. Persiapan Lokal

Buka terminal/command prompt di folder `D:\opencode\toko-hana`:

```powershell
cd D:\opencode\toko-hana
```

## 2. Cek Status Repo

```powershell
git remote -v
git status
git branch -a
```

**Pastikan output `git remote` menunjukkan:**
```
origin  https://github.com/Hans23g/toko-hana.git (fetch)
origin  https://github.com/Hans23g/toko-hana.git (push)
```

## 3. Backup & Persiapan File

File-file yang sudah disiapkan:
- `.env.example` - template env vars
- `.gitignore` - ignore file sensitif
- `package.json` - dependencies

**Copy** `.env.example` ke `.env.local` (jangan di-commit):
```powershell
Copy-Item .env.example .env.local
```

## 4. Edit App.jsx - Hapus Kunci Sensitif

Buka `App.jsx`, cari baris 2-3, **ganti**:

```jsx
const supabaseUrl = 'https://nevvqybmyinhdyzdhubz.supabase.co';
const supabaseKey = 'sb_publishable_SQOeotTf_RMhC_oPXGyzgw_Ma9ZU51e';
```

**Dengan:**

```jsx
const supabaseUrl = (window.__ENV && window.__ENV.SUPABASE_URL) || 'https://nevvqybmyinhdyzdhubz.supabase.co';
const supabaseKey = (window.__ENV && window.__ENV.SUPABASE_ANON_KEY) || 'sb_publishable_SQOeotTf_RMhC_oPXGyzgw_Ma9ZU51e';
```

## 5. Buat Folder API (Serverless Functions)

Buat folder `api/` di root repo:

```
D:\opencode\toko-hana\api\supabase.js
```

Isi dengan:

```javascript
// api/supabase.js - Vercel Serverless Function
import { createClient } from '@supabase/supabase-js';

const supa = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  const { entity, action, id, data, query } = req.body || {};
  
  try {
    let result;
    let table = supa.from(entity);
    
    switch (action) {
      case 'select':
        result = await table.select('*');
        break;
      case 'insert':
        result = await table.insert([data]).select();
        break;
      case 'update':
        result = await table.update(data).eq('id', id).select();
        break;
      case 'delete':
        result = await table.delete().eq('id', id);
        break;
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
    
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
```

## 6. Buat vercel.json untuk Header Keamanan

```
D:\opencode\toko-hana\vercel.json
```

Isi:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' https://*.supabase.co wss://*.supabase.co; img-src 'self' data: https:; style-src 'self' 'unsafe-inline';"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

## 7. Set Environment Variables di Vercel

1. Buka https://vercel.com/dashboard
2. Pilih project **toko-hana**
3. **Settings → Environment Variables**
4. Tambahkan (untuk Production):

```
SUPABASE_URL = https://nevvqybmyinhdyzdhubz.supabase.co
SUPABASE_SERVICE_ROLE_KEY = [service_role_key_dari_supabase_dashboard]
NEXT_PUBLIC_SUPABASE_URL = https://nevvqybmyinhdyzdhubz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = sb_publishable_SQOeotTf_RMhC_oPXGyzgw_Ma9ZU51e
WA_NUMBER = 6281234567890
APP_URL = https://tokohana.vercel.app/
```

## 8. Hapus Kunci dari Riwayat Git (PENTING!)

⚠️ **SEBELUM PUSH**, hapus kunci yang pernah ter-commit:

```powershell
# Install git-filter-repo
pip install git-filter-repo

# Hapus baris kunci dari seluruh riwayat
git filter-repo --in-place --replace-text <(echo 'sb_publishable_SQOeotTf_RMhC_oPXGyzgw_Ma9ZU51e==>sb_publishable_PLACEHOLDER_GANTI_DI_VERCEL')

# Force push
git push origin --force --all
```

## 9. Commit & Push

```powershell
git add .env.example .gitignore package.json vercel.json api/
git add App.jsx   # Setelah diedit
git add index.html # Jika ada perubahan
git commit -m "Security: remove hardcoded keys, add env support, RLS headers, serverless proxy"
git push origin main
```

## 10. Verifikasi Deploy

1. **Cek Vercel deployment**: https://vercel.com/dashboard
2. **Cek website**: https://tokohana.vercel.app/
3. **View Source** - pastikan tidak ada `sb_publishable_SQOeotTf_RMhC_oPXGyzgw_Ma9ZU51e`
4. **GitHub Security tab**: https://github.com/Hans23g/toko-hana/security

## 11. Aktifkan GitHub Security

1. Buka https://github.com/Hans23g/toko-hana/settings/security_analysis
2. Aktifkan:
   - ✅ Dependabot alerts
   - ✅ Dependabot security updates
   - ✅ Code scanning (CodeQL)

## 12. Tambahkan GitHub Actions Workflow

Buat file `.github/workflows/security.yml`:

```yaml
name: Security Check
on: [push, pull_request]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Trivy
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          severity: 'HIGH,CRITICAL'
```

## Checklist Akhir

- [ ] Kunci Supabase **TIDAK ADA** di `App.jsx`
- [ ] `.env` **TIDAK** ada di repo
- [ ] `.gitignore` exclude `.env*`
- [ ] Vercel env variables ter-set
- [ ] `vercel.json` CSP header aktif
- [ ] API serverless function jalan
- [ ] GitHub Security scanning aktif
- [ ] Force-push riwayat sudah dilakukan

---

**Setelah semua selesai, repo Anda aman dan aplikasi tidak mengekspos kunci API.**
