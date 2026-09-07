from pathlib import Path
import base64
import subprocess
import json
import tempfile
import os

SCRIPT_DIR = Path(__file__).resolve().parent if '__file__' in globals() else Path.cwd()
PROJECT_DIR = SCRIPT_DIR.parent if SCRIPT_DIR.name == 'tools' else SCRIPT_DIR
ASSETS_DIR = PROJECT_DIR / 'assets'
LOGO_DIR = ASSETS_DIR / 'logo'
PWA_DIR = ASSETS_DIR / 'pwa'
CATEGORY_DIR = ASSETS_DIR / 'category'
ROOT = Path('/home/user')
REC = Path(os.environ.get('TOKOHANA_RECOVERY_DIR', str(ROOT / 'recovery-workspace-lama-07juli26')))
OUT = Path(os.environ.get('TOKOHANA_CQ_OUT', str(PROJECT_DIR / 'TOKO_HANA_CQ_UPLOAD_MASSAL.html')))

# CTO NOTE:
# Jangan ambil source/asset lama kalau file hasil patch terbaru ada di folder yang sama.
# Urutan ini menjaga tampilan sekarang: logo kartu/Jelajah/footer, icon install batik,
# dan icon kategori "Semua" versi tas clean-pad tidak balik ke versi lama saat build ulang.
APP = next((p for p in [
    PROJECT_DIR / 'App.jsx',
    PROJECT_DIR / 'app.jsx',
    PROJECT_DIR / 'app.jsx.txt',
    REC / 'app.jsx',
] if p.exists()), None)
LIBS = next((p for p in [PROJECT_DIR / 'libs', SCRIPT_DIR / 'libs', REC / 'libs'] if p.exists()), REC / 'libs')
BABEL = LIBS / 'babel.min.js'

if not APP:
    raise FileNotFoundError('App.jsx / app.jsx.txt tidak ditemukan. Taruh source terbaru di folder yang sama dengan make_cq ini.')
if not BABEL.exists():
    raise FileNotFoundError(BABEL)

def data_uri(path: Path):
    if not path or not path.exists():
        return ''
    mime = 'image/jpeg' if path.suffix.lower() in ['.jpg', '.jpeg'] else 'image/png'
    return f'data:{mime};base64,' + base64.b64encode(path.read_bytes()).decode('ascii')

def first_existing(paths):
    return next((Path(p) for p in paths if p and Path(p).exists()), None)

logo_path = first_existing([
    LOGO_DIR / 'logo_hana_footer_badge_512.png',
    PROJECT_DIR / 'logo_hana_footer_badge_512.png',
    PROJECT_DIR / 'favicon_tokohana_512_cropped_max.png',
    REC / 'assets/logo/logo_hana_footer_badge_512.png',
    REC / 'assets/logo/logo_hana_framed_512.png',
    REC / 'assets/logo/logo_hana_nav_button_512.png',
    REC / 'assets/logo/logo_hana_new_main_512.png',
    REC / 'assets/logo/logo_hana_512.png',
])
# Favicon dan icon install/PWA sama-sama pakai logo cart transparan.
favicon_path = first_existing([
    PWA_DIR / 'icon_install_64.png',
    PWA_DIR / 'icon_pwa_cart_transparent_source.png',
    PWA_DIR / 'icontas2_source.png',
    PROJECT_DIR / 'icon_install_64.png',
    PROJECT_DIR / 'icon_install_batik.png',
    REC / 'assets/logo/icon_install_64.png',
    REC / 'assets/logo/favicon_hana_th_512.png',
    REC / 'assets/logo/favicon_hana_new_256.png',
])
apple_icon_path = first_existing([
    PWA_DIR / 'icon_install_180.png',
    PWA_DIR / 'icon_pwa_cart_transparent_source.png',
    PWA_DIR / 'icon_pwa_tasbatik_source.png',
    PWA_DIR / 'icontas2_source.png',
    PROJECT_DIR / 'icon_install_180.png',
    PROJECT_DIR / 'icon_install_batik.png',
    REC / 'assets/logo/icon_install_180.png',
    REC / 'assets/logo/logo_hana_app_icon_512.png',
])
manifest_icon_192_path = first_existing([
    PWA_DIR / 'icon_install_192.png',
    PWA_DIR / 'icon_pwa_cart_transparent_source.png',
    PWA_DIR / 'icon_pwa_tasbatik_source.png',
    PWA_DIR / 'icontas2_source.png',
    PROJECT_DIR / 'icon_install_192.png',
    PROJECT_DIR / 'icon_install_batik.png',
    REC / 'assets/logo/icon_install_192.png',
    REC / 'assets/logo/logo_hana_app_icon_512.png',
])
manifest_icon_512_path = first_existing([
    PWA_DIR / 'icon_install_512.png',
    PWA_DIR / 'icon_pwa_cart_transparent_source.png',
    PWA_DIR / 'icon_pwa_tasbatik_source.png',
    PWA_DIR / 'icontas2_source.png',
    PROJECT_DIR / 'icon_install_512.png',
    PROJECT_DIR / 'icon_install_batik.png',
    REC / 'assets/logo/icon_install_512.png',
    REC / 'assets/logo/logo_hana_app_icon_512.png',
    REC / 'assets/logo/logo_hana_framed_512.png',
])
# Icon kategori "Semua": cart transparan agar lebih terang/clean.
category_logo_path = first_existing([
    CATEGORY_DIR / 'icon_category_cart_transparent_512.png',
    PWA_DIR / 'icon_pwa_cart_transparent_source.png',
    CATEGORY_DIR / 'icon_category_tas_bg_cleanpad_512.png',
    CATEGORY_DIR / 'icon_category_tas_bg_cleanpad_192.png',
    PROJECT_DIR / 'icon_category_tas_bg_cleanpad_512.png',
    PROJECT_DIR / 'icontas1.png',
    REC / 'assets/logo/icon_category_tas_bg_cleanpad_512.png',
    REC / 'assets/logo/logo_hana_batik_category.png',
    REC / 'assets/logo/logo_hana_app_icon_512.png',
    REC / 'assets/logo/logo_hana_framed_512.png',
])
pi_logo_path = first_existing([REC / 'assets/logo/pi_network_official.png'])
footer_logo_path = first_existing([
    LOGO_DIR / 'logo_hana_footer_badge_512.png',
    PROJECT_DIR / 'logo_hana_footer_badge_512.png',
    REC / 'assets/logo/logo_hana_footer_badge_512.png',
    REC / 'assets/logo/logo_hana_app_icon_512.png',
    REC / 'assets/logo/logo_hana_framed_512.png',
])
splash_path = first_existing([
    REC / 'assets/logo/splash_tokohana_belanja_optimized.jpg',
    REC / 'assets/logo/splash_tokohana_belanja.png',
])
batik_path = first_existing([
    REC / 'assets/batik/batik_pattern_opt.jpg',
    REC / 'assets/batik/batik_ungu_emas.png',
])
night_batik_path = first_existing([REC / 'assets/batik/batik_hitam_emas.jpg'])

logo_data = data_uri(logo_path)
favicon_data = data_uri(favicon_path)
apple_icon_data = data_uri(apple_icon_path)
manifest_icon_192_data = data_uri(manifest_icon_192_path)
manifest_icon_512_data = data_uri(manifest_icon_512_path) or logo_data
app_icon_data = manifest_icon_512_data
category_logo_data = data_uri(category_logo_path)
pi_logo_data = data_uri(pi_logo_path)
footer_logo_data = data_uri(footer_logo_path) or logo_data
splash_data = data_uri(splash_path)
batik_data = data_uri(batik_path)
night_batik_data = data_uri(night_batik_path)

manifest_icons = []
if manifest_icon_192_data:
    manifest_icons.append({
        "src": manifest_icon_192_data,
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "any"
    })
if manifest_icon_512_data:
    manifest_icons.append({
        "src": manifest_icon_512_data,
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "any maskable"
    })

manifest_payload = {
    "name": "Toko Hana — Warungnya Rakyat",
    "short_name": "Toko Hana",
    "description": "Warung digital rakyat: belanja, Jelajah, undangan, ucapan, dan info warga.",
    "start_url": "/",
    "scope": "/",
    "display": "standalone",
    "orientation": "portrait",
    "theme_color": "#703d92",
    "background_color": "#F5F3F7",
    "icons": manifest_icons
}
manifest_data = 'data:application/manifest+json;base64,' + base64.b64encode(json.dumps(manifest_payload, ensure_ascii=False, separators=(',', ':')).encode('utf-8')).decode('ascii')

node_script = r"""
const fs = require('fs');
const Babel = require(process.argv[2]);
const input = fs.readFileSync(process.argv[3], 'utf8');
const output = Babel.transform(input, {
  presets: [['react', { runtime: 'classic' }]],
  sourceType: 'script',
  comments: false,
  compact: false
}).code;
process.stdout.write(output);
"""
with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False) as f:
    f.write(node_script)
    node_path = f.name
compiled = subprocess.check_output(['node', node_path, str(BABEL), str(APP)], text=True)

runtime_scripts = [
    LIBS / 'react.production.min.js',
    LIBS / 'react-dom.production.min.js',
    LIBS / 'lucide.min.js',
    LIBS / 'jsQR.min.js',
    LIBS / 'zxing.min.js',
    LIBS / 'html5-qrcode.min.js',
    LIBS / 'quagga.min.js',
    LIBS / 'supabase-js.js',
    LIBS / 'tailwind.js',
]

parts = []
parts.append(f'''<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <title>Toko Hana - Grocery Warung Rakyat</title>
  <meta name="theme-color" content="#703d92" />
  <link rel="icon" type="image/png" sizes="64x64" href="{favicon_data or app_icon_data or logo_data}" />
  <link rel="apple-touch-icon" sizes="180x180" href="{apple_icon_data or app_icon_data or logo_data}" />
  <link rel="manifest" href="{manifest_data}" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-title" content="Toko Hana" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <style>
    html,body{{margin:0;min-height:100%;background:#111827;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}}
    .no-scrollbar::-webkit-scrollbar{{display:none}}.no-scrollbar{{-ms-overflow-style:none;scrollbar-width:none}}
    @keyframes fade-in{{from{{opacity:0}}to{{opacity:1}}}}.animate-fade-in{{animation:fade-in .25s ease-out}}
    @keyframes slide-up{{from{{transform:translateY(100%)}}to{{transform:translateY(0)}}}}.animate-slide-up{{animation:slide-up .25s ease-out}}
    @keyframes scale-up{{from{{transform:scale(.96);opacity:.6}}to{{transform:scale(1);opacity:1}}}}.animate-scale-up{{animation:scale-up .2s ease-out}}
    @keyframes coin-drop{{0%,100%{{transform:translate(-50%,-2px)}}50%{{transform:translate(-50%,3px)}}}}.animate-coin-drop{{animation:coin-drop 1.4s ease-in-out infinite}}
    @keyframes hana-splash-pop{{0%{{opacity:0;transform:scale(.62) translateY(18px)}}62%{{opacity:1;transform:scale(1.06) translateY(-3px)}}100%{{opacity:1;transform:scale(1) translateY(0)}}}}.animate-splash-pop{{animation:hana-splash-pop .72s cubic-bezier(.2,.9,.25,1.15) both}}
    @keyframes hana-splash-rise{{0%{{opacity:0;transform:translateY(18px)}}100%{{opacity:1;transform:translateY(0)}}}}.animate-splash-rise{{animation:hana-splash-rise .58s .32s ease-out both}}.animate-splash-rise-2{{animation:hana-splash-rise .58s .48s ease-out both}}
    @keyframes hana-logo-breathe{{0%,100%{{transform:scale(1);filter:drop-shadow(0 10px 28px rgba(0,0,0,.42))}}50%{{transform:scale(1.035);filter:drop-shadow(0 14px 38px rgba(255,215,0,.22))}}}}.hana-splash-logo{{animation:hana-logo-breathe 1.8s .65s ease-in-out infinite}}
    @keyframes hana-splash-full-fade{{0%{{opacity:.82;filter:saturate(.92) brightness(.94)}}100%{{opacity:1;filter:saturate(1) brightness(1)}}}}.hana-splash-full{{animation:hana-splash-full-fade .9s ease-out both;transform-origin:center center;transform:scale(1);}}
    @keyframes hana-splash-soft-glow{{0%,100%{{opacity:.42;transform:scale(.96)}}50%{{opacity:.78;transform:scale(1.04)}}}}.hana-splash-soft-glow{{animation:hana-splash-soft-glow 2.2s ease-in-out infinite;}}
    @keyframes hana-splash-loading-fill{{0%{{width:0%;opacity:.78}}62%{{width:76%;opacity:1}}100%{{width:100%;opacity:.98}}}}.hana-splash-loading-fill{{animation:hana-splash-loading-fill 2.62s cubic-bezier(.22,.78,.18,1) 1 forwards;}}
    @keyframes hana-splash-loading-text{{0%,100%{{opacity:.72}}50%{{opacity:1}}}}.hana-splash-loading-text{{animation:hana-splash-loading-text 1.65s ease-in-out infinite;}}
    @keyframes hana-coin-flip{{0%{{transform:translateX(-50%) translateY(8px) rotateY(0deg) scale(.86)}}42%{{transform:translateX(-50%) translateY(-16px) rotateY(170deg) scale(1.08)}}58%{{transform:translateX(-50%) translateY(-16px) rotateY(205deg) scale(1.08)}}100%{{transform:translateX(-50%) translateY(8px) rotateY(360deg) scale(.86)}}}}.hana-splash-coin-main{{animation:hana-coin-flip 1.25s .12s cubic-bezier(.45,.05,.28,1) infinite;transform-style:preserve-3d}}
    @keyframes hana-coin-left{{0%,100%{{transform:translate(0,4px) rotate(-16deg);opacity:.58}}50%{{transform:translate(-8px,-12px) rotate(18deg);opacity:1}}}}.hana-splash-coin-left{{animation:hana-coin-left 1.65s .28s ease-in-out infinite}}
    @keyframes hana-coin-right{{0%,100%{{transform:translate(0,-5px) rotate(14deg);opacity:.62}}50%{{transform:translate(9px,10px) rotate(-18deg);opacity:1}}}}.hana-splash-coin-right{{animation:hana-coin-right 1.8s .12s ease-in-out infinite}}
    @keyframes hana-coin-glow{{0%,100%{{opacity:.25;transform:scale(.88)}}50%{{opacity:.62;transform:scale(1.15)}}}}.hana-splash-coin-glow{{animation:hana-coin-glow 1.25s ease-in-out infinite}}
    @keyframes hana-banner-marquee{{0%{{transform:translateX(0)}}100%{{transform:translateX(-50%)}}}}
    .hana-banner-marquee{{width:max-content;will-change:transform;animation:hana-banner-marquee 30s linear infinite;}}
    .hana-banner-marquee:hover{{animation-play-state:paused;}}
    @media (orientation: landscape) and (max-height: 540px){{
      #root{{filter:blur(2px);pointer-events:none;}}
      body::before{{
        content:"Toko Hana paling nyaman dalam mode potret. Putar kembali HP Juragan ya ☕";
        position:fixed;inset:0;z-index:999999;background:linear-gradient(135deg,#2d1242,#703d92 55%,#553C9A);color:#FFD700;
        display:flex;align-items:center;justify-content:center;text-align:center;padding:28px;font-weight:900;font-size:18px;line-height:1.35;
        box-shadow:inset 0 0 80px rgba(0,0,0,.35);
      }}
      body::after{{
        content:"Warung digital rakyat tetap rapi kalau berdiri tegak 📱";
        position:fixed;left:24px;right:24px;bottom:28px;z-index:1000000;color:rgba(255,255,255,.78);text-align:center;font-weight:700;font-size:11px;line-height:1.3;
      }}
    }}
    .hana-install-nudge{{position:fixed;left:14px;right:14px;bottom:92px;z-index:99999;max-width:402px;margin:0 auto;background:linear-gradient(135deg,rgba(45,18,66,.96),rgba(112,61,146,.96));color:white;border:1px solid rgba(255,215,0,.45);border-radius:22px;padding:12px 12px 12px 14px;box-shadow:0 18px 45px rgba(45,18,66,.32);display:flex;align-items:center;gap:10px;backdrop-filter:blur(12px)}}
    .hana-install-nudge b{{display:block;color:#FFD700;font-size:11px;line-height:1.1}}.hana-install-nudge span{{display:block;color:rgba(255,255,255,.78);font-size:9px;font-weight:700;line-height:1.25;margin-top:2px}}
    .hana-install-nudge button{{border:0;border-radius:13px;font-weight:900;font-size:10px;padding:8px 10px;white-space:nowrap}}.hana-install-primary{{background:#FFD700;color:#2d1242}}.hana-install-close{{background:rgba(255,255,255,.12);color:white}}
    .cq-error{{white-space:pre-wrap;background:#fee2e2;color:#7f1d1d;padding:16px;border-radius:16px;margin:16px;font-family:monospace;font-size:12px;text-align:left}}
    input, select, textarea{{font-size:16px!important;font-weight:400!important;letter-spacing:-0.02em;}}
    input::placeholder, textarea::placeholder{{font-weight:400;color:rgba(107,114,128,.62)!important;}}
    .admin-clean input:not([type="checkbox"]):not([type="radio"]):not([type="file"]),
    .admin-clean select,
    .admin-clean textarea{{
      width:100%;
      border:1px solid rgba(112,61,146,.16)!important;
      background:rgba(255,255,255,.96)!important;
      color:#2d1242!important;
      border-radius:14px!important;
      padding:10px 12px!important;
      min-height:40px;
      box-shadow:0 1px 0 rgba(112,61,146,.04)!important;
      transition:border-color .16s ease, box-shadow .16s ease, background-color .16s ease;
    }}
    .admin-clean textarea{{min-height:64px;line-height:1.35!important;}}
    .admin-clean select{{appearance:auto;background-color:#fff!important;}}
    .admin-clean input:not([type="checkbox"]):not([type="radio"]):not([type="file"]):focus,
    .admin-clean select:focus,
    .admin-clean textarea:focus{{
      outline:none!important;
      border-color:rgba(112,61,146,.55)!important;
      box-shadow:0 0 0 3px rgba(112,61,146,.10)!important;
      background:#fff!important;
    }}
    .admin-clean input::placeholder,
    .admin-clean textarea::placeholder{{color:rgba(107,114,128,.55)!important;font-weight:500!important;}}
    .admin-clean label{{color:#4b5563;}}
    .admin-clean button{{transition:transform .12s ease, box-shadow .12s ease, background-color .12s ease, border-color .12s ease;}}
    .admin-clean button:active{{transform:scale(.98);}}

    /* Toko Hana — Malam Batik global. Scope ada di root aplikasi agar Home, Jelajah,
       Promo, Keranjang, Profil, Kasir, Catatan, Admin, modal, dan bottom sheet ikut malam. */
    .dark-mode-root{{color-scheme:dark;background:#11091d;color:#f8f1fb;}}
    .dark-mode-root main{{background-color:#11091d!important;}}
    .dark-mode-root [class~="bg-white"],
    .dark-mode-root [class~="bg-white/95"],
    .dark-mode-root [class~="bg-white/90"],
    .dark-mode-root [class~="bg-white/85"],
    .dark-mode-root [class~="bg-white/80"],
    .dark-mode-root [class~="bg-white/78"],
    .dark-mode-root [class~="bg-white/76"],
    .dark-mode-root [class~="bg-white/75"],
    .dark-mode-root [class~="bg-white/72"],
    .dark-mode-root [class~="bg-white/70"],
    .dark-mode-root [class~="bg-[#FFFDF6]"],
    .dark-mode-root [class~="bg-[#F5F3F7]"],
    .dark-mode-root [class~="bg-[#F8F2E9]"]{{background-color:#21152d!important;}}
    .dark-mode-root [class~="bg-gray-50"],
    .dark-mode-root [class~="bg-gray-100"]{{background-color:#1d1426!important;}}
    .dark-mode-root [class~="bg-gray-200"]{{background-color:#33263e!important;}}
    .dark-mode-root [class~="bg-purple-100"]{{background-color:#382349!important;}}
    .dark-mode-root [class~="bg-amber-100"]{{background-color:#463516!important;}}
    .dark-mode-root [class~="bg-emerald-100"]{{background-color:#14382b!important;}}
    .dark-mode-root [class~="bg-green-100"]{{background-color:#153522!important;}}
    .dark-mode-root [class~="bg-blue-100"]{{background-color:#172e4a!important;}}
    .dark-mode-root [class~="bg-red-100"]{{background-color:#431e26!important;}}
    .dark-mode-root [class~="bg-purple-50"],
    .dark-mode-root [class~="bg-purple-50/70"],
    .dark-mode-root [class~="bg-purple-50/60"],
    .dark-mode-root [class~="bg-purple-50/50"],
    .dark-mode-root [class~="bg-purple-50/40"],
    .dark-mode-root [class~="bg-purple-50/35"],
    .dark-mode-root [class~="bg-purple-50/30"],
    .dark-mode-root [class~="bg-purple-50/25"]{{background-color:#281735!important;}}
    .dark-mode-root [class~="bg-amber-50"],
    .dark-mode-root [class~="bg-amber-50/70"],
    .dark-mode-root [class~="bg-amber-50/60"],
    .dark-mode-root [class~="bg-amber-50/50"],
    .dark-mode-root [class~="bg-amber-50/40"],
    .dark-mode-root [class~="bg-amber-50/35"],
    .dark-mode-root [class~="bg-amber-50/25"]{{background-color:#2b2016!important;}}
    .dark-mode-root [class~="bg-emerald-50"],
    .dark-mode-root [class~="bg-emerald-50/70"],
    .dark-mode-root [class~="bg-emerald-50/40"],
    .dark-mode-root [class~="bg-emerald-50/35"]{{background-color:#11271f!important;}}
    .dark-mode-root [class~="bg-blue-50"],
    .dark-mode-root [class~="bg-blue-50/40"],
    .dark-mode-root [class~="bg-blue-50/35"]{{background-color:#122238!important;}}
    .dark-mode-root [class~="bg-red-50"],
    .dark-mode-root [class~="bg-red-50/40"],
    .dark-mode-root [class~="bg-red-50/35"]{{background-color:#32171e!important;}}
    .dark-mode-root [class~="bg-green-50"]{{background-color:#12281d!important;}}
    .dark-mode-root [class~="bg-orange-50"]{{background-color:#302016!important;}}
    .dark-mode-root [class~="bg-sky-50"]{{background-color:#122633!important;}}
    .dark-mode-root [class~="bg-teal-50"]{{background-color:#112923!important;}}
    .dark-mode-root [class~="bg-pink-50"]{{background-color:#301827!important;}}
    .dark-mode-root [class~="bg-indigo-50"]{{background-color:#1d1b36!important;}}

    .dark-mode-root [class~="text-gray-900"],
    .dark-mode-root [class~="text-gray-800"],
    .dark-mode-root [class~="text-gray-700"]{{color:#f7effa!important;}}
    .dark-mode-root [class~="text-gray-600"]{{color:#d8cbe1!important;}}
    .dark-mode-root [class~="text-gray-500"]{{color:#bbaac7!important;}}
    .dark-mode-root [class~="text-gray-400"]{{color:#927f9f!important;}}
    .dark-mode-root [class~="text-[#703d92]"]{{color:#dcbaf1!important;}}
    .dark-mode-root [class~="text-[#2d1242]"]{{color:#f7effa!important;}}
    .dark-mode-root [class~="text-amber-700"],
    .dark-mode-root [class~="text-amber-600"]{{color:#f4cb70!important;}}
    .dark-mode-root [class~="text-emerald-800"],
    .dark-mode-root [class~="text-emerald-700"],
    .dark-mode-root [class~="text-green-700"]{{color:#79ddb5!important;}}
    .dark-mode-root [class~="text-blue-700"],
    .dark-mode-root [class~="text-blue-600"]{{color:#99c7ff!important;}}
    .dark-mode-root [class~="text-sky-700"],
    .dark-mode-root [class~="text-sky-600"]{{color:#8ed8f8!important;}}
    .dark-mode-root [class~="text-teal-700"],
    .dark-mode-root [class~="text-teal-600"]{{color:#73dfcb!important;}}
    .dark-mode-root [class~="text-pink-700"],
    .dark-mode-root [class~="text-pink-600"]{{color:#f3a9cf!important;}}
    .dark-mode-root [class~="text-indigo-700"],
    .dark-mode-root [class~="text-indigo-600"]{{color:#b9b6ff!important;}}
    .dark-mode-root [class~="text-red-700"],
    .dark-mode-root [class~="text-red-600"]{{color:#ffaaa9!important;}}

    /* Malam: semua border default dibuat hangat. Hindari garis putih tajam di form/card admin. */
    .dark-mode-root [class~="border"],
    .dark-mode-root [class*="border-"]{{border-color:rgba(255,215,112,.13)!important;}}
    .dark-mode-root .admin-clean [class~="border"],
    .dark-mode-root .admin-clean [class*="border-"]{{border-color:rgba(255,215,112,.15)!important;}}

    .dark-mode-root [class~="border-gray-50"],
    .dark-mode-root [class~="border-gray-100"],
    .dark-mode-root [class~="border-gray-200"],
    .dark-mode-root [class~="border-purple-50"],
    .dark-mode-root [class~="border-purple-100"],
    .dark-mode-root [class~="border-amber-100"],
    .dark-mode-root [class~="border-amber-200"]{{border-color:rgba(255,215,112,.16)!important;}}
    .dark-mode-root [class~="border-emerald-100"],
    .dark-mode-root [class~="border-green-100"]{{border-color:rgba(110,231,183,.18)!important;}}
    .dark-mode-root [class~="border-blue-100"]{{border-color:rgba(147,197,253,.18)!important;}}
    .dark-mode-root [class~="border-sky-100"],
    .dark-mode-root [class~="border-sky-400"]{{border-color:rgba(125,211,252,.22)!important;}}
    .dark-mode-root [class~="border-teal-100"],
    .dark-mode-root [class~="border-teal-400"]{{border-color:rgba(94,234,212,.22)!important;}}
    .dark-mode-root [class~="border-pink-100"],
    .dark-mode-root [class~="border-pink-400"]{{border-color:rgba(244,114,182,.22)!important;}}
    .dark-mode-root [class~="border-indigo-100"],
    .dark-mode-root [class~="border-indigo-400"]{{border-color:rgba(165,180,252,.22)!important;}}
    .dark-mode-root [class~="border-red-100"]{{border-color:rgba(252,165,165,.18)!important;}}
    .dark-mode-root [class*="border-white"]{{border-color:rgba(255,215,112,.12)!important;}}
    .dark-mode-root [class*="border-white/"]{{border-color:rgba(255,215,112,.10)!important;}}
    .dark-mode-root [class*="divide-white"] > :not([hidden]) ~ :not([hidden]){{border-color:rgba(255,215,112,.10)!important;}}
    .dark-mode-root [class*="border-[#FFD700]"]{{border-color:#FFD700!important;}}
    .dark-mode-root [class*="border-[#D4AF37]"]{{border-color:#D4AF37!important;}}
    .dark-mode-root [class*="border-amber"]{{border-color:rgba(255,215,112,.22)!important;}}

    /* Info Jelajah malam: tanpa garis pemisah; tiap tulisan menyatu tenang dengan lorong. */
    .dark-mode-root .jelajah-info-list{{
      background:#17101f!important;
      border-color:rgba(198,125,255,.22)!important;
      box-shadow:0 0 10px rgba(143,76,190,.06);
    }}
    .dark-mode-root .jelajah-info-row{{
      background:rgba(33,21,45,.78)!important;
      border-top:0!important;
      border-bottom:1px solid rgba(198,125,255,.16)!important;
      box-shadow:inset 0 -1px 0 rgba(198,125,255,.08), 0 1px 6px rgba(198,125,255,.045)!important;
    }}
    .dark-mode-root .jelajah-info-row:last-child{{border-bottom:0!important;box-shadow:none!important;}}
    .dark-mode-root .jelajah-info-row:active{{background:rgba(72,39,94,.72)!important;}}

    .dark-mode-root .hana-category-nav-glass{{
      background:rgba(25,13,38,.48)!important;
      background-color:rgba(25,13,38,.48)!important;
      -webkit-backdrop-filter:blur(12px)!important;
      backdrop-filter:blur(12px)!important;
    }}
    .dark-mode-root .hana-category-dropdown-glass{{
      background:rgba(22,15,34,.32)!important;
      background-color:rgba(22,15,34,.32)!important;
      -webkit-backdrop-filter:blur(8px)!important;
      backdrop-filter:blur(8px)!important;
    }}

    .dark-mode-root input:not([type="checkbox"]):not([type="radio"]):not([type="file"]),
    .dark-mode-root select,
    .dark-mode-root textarea{{background:#1d1130!important;color:#f8f1fb!important;border-color:rgba(255,215,112,.18)!important;box-shadow:none!important;}}
    .dark-mode-root input::placeholder,
    .dark-mode-root textarea::placeholder{{color:rgba(216,203,225,.48)!important;}}
    .dark-mode-root .admin-clean input:not([type="checkbox"]):not([type="radio"]):not([type="file"]),
    .dark-mode-root .admin-clean select,
    .dark-mode-root .admin-clean textarea{{background:#1d1130!important;color:#f8f1fb!important;border-color:rgba(255,215,112,.18)!important;}}
    .dark-mode-root .cashier-order-search-line{{
      background:rgba(29,17,48,.75)!important;
      background-color:rgba(29,17,48,.75)!important;
      border-color:rgba(255,215,112,.18)!important;
      box-shadow:none!important;
    }}
    .dark-mode-root .cashier-order-search-line input,
    .dark-mode-root input.cashier-order-search-input{{
      background:transparent!important;
      background-color:transparent!important;
      background-image:none!important;
      border-color:transparent!important;
      box-shadow:none!important;
      -webkit-box-shadow:0 0 0 1000px transparent inset!important;
      outline:none!important;
    }}

    /* Search aktif jadi lampu warung: normalnya 3D halus, saat focus menyala emas hangat. */
    input.hana-header-search:focus{{
      background:linear-gradient(rgba(255,255,255,.88),rgba(255,253,246,.82)) padding-box,linear-gradient(135deg,#B8860B 0%,#FFE8A8 28%,#FFD700 50%,#D4AF37 74%,#B8860B 100%) border-box!important;
      border:2px solid transparent!important;
      box-shadow:0 10px 22px rgba(45,18,66,.18),0 2px 0 rgba(111,80,20,.24),0 0 0 1px rgba(255,216,132,.36),0 0 18px rgba(255,215,0,.46),inset 0 1px 0 rgba(255,255,255,.82)!important;
      outline:none!important;
    }}

    /* Search header punya cahaya malam sendiri: tetap terlihat di atas batik, tetapi tidak menyilaukan. */
    /* Build 19JULI-02: border search emas dibuat sengaja tegas untuk CQ satu meja. */
    .dark-mode-root input.hana-header-search{{
      background:linear-gradient(rgba(18,12,28,.74),rgba(33,21,45,.70)) padding-box,linear-gradient(135deg,#B8860B 0%,#FFE8A8 30%,#FFD784 54%,#D4AF37 76%,#B8860B 100%) border-box!important;
      background-color:transparent!important;
      color:#FFE8A8!important;
      -webkit-text-fill-color:#FFE8A8!important;
      border:2px solid transparent!important;
      outline:none!important;
      box-shadow:0 8px 18px rgba(0,0,0,.24),0 2px 0 rgba(111,80,20,.30),inset 0 1px 0 rgba(255,232,168,.28)!important;
      caret-color:#FFD784!important;
      -webkit-appearance:none;
      appearance:none;
    }}
    .dark-mode-root input.hana-header-search::placeholder{{color:rgba(255,232,168,.62)!important;-webkit-text-fill-color:rgba(255,232,168,.62)!important;}}
    .dark-mode-root input.hana-header-search:focus{{
      background:linear-gradient(rgba(18,12,28,.84),rgba(33,21,45,.80)) padding-box,linear-gradient(135deg,#B8860B 0%,#FFE8A8 28%,#FFD700 50%,#D4AF37 74%,#B8860B 100%) border-box!important;
      background-color:transparent!important;
      color:#FFE8A8!important;
      -webkit-text-fill-color:#FFE8A8!important;
      border:2px solid transparent!important;
      outline:none!important;
      box-shadow:0 10px 22px rgba(0,0,0,.30),0 2px 0 rgba(111,80,20,.38),0 0 0 1px rgba(255,232,168,.22),0 0 20px rgba(255,215,0,.48),inset 0 1px 0 rgba(255,232,168,.36)!important;
    }}

    /* Harga kertas, chip emas, QR, dan tombol kuning tetap terang sebagai aksen warung. */
    .dark-mode-root [class~="bg-[#FFF8E1]"],
    .dark-mode-root [class~="bg-[#FFF8E1]/95"],
    .dark-mode-root [class~="aspect-square"][class~="bg-white"]{{background-color:#fff!important;}}
    .dark-mode-root [class~="bg-[#FFF8E1]"] [class~="text-[#2d1242]"],
    .dark-mode-root [class~="bg-[#FFF8E1]"] [class~="text-[#703d92]"],
    .dark-mode-root [class~="bg-[#FFF8E1]/95"] [class~="text-[#703d92]"]{{color:#703d92!important;}}
    .dark-mode-root [class~="bg-[#FFD700]"][class~="text-[#2d1242]"],
    .dark-mode-root [class~="bg-amber-400"][class~="text-[#2d1242]"],
    .dark-mode-root [class~="bg-amber-500"][class~="text-[#2d1242]"],
    .dark-mode-root [class~="from-[#D4AF37]"][class~="text-[#2d1242]"]{{color:#2d1242!important;}}
    .dark-mode-root button span[class~="bg-white"][class~="rounded-full"]{{background-color:#fff!important;}}
    .dark-mode-root [class~="to-white"]{{--tw-gradient-to:#21152d var(--tw-gradient-to-position)!important;}}

    input[type="number"], input[type="text"], input[type="url"], input[type="email"], input[type="tel"], input[type="password"], select, textarea{{line-height:1.15!important;}}
    select{{background-position:right .55rem center;}}
    body.keyboard-open .fixed.bottom-0,
    body.keyboard-open [class*="fixed bottom-0"]{{
      transform:translateY(115%)!important;
      opacity:0!important;
      pointer-events:none!important;
      transition:transform .18s ease, opacity .18s ease!important;
    }}
  </style>
''')

for sp in runtime_scripts:
    if not sp.exists():
        raise FileNotFoundError(sp)
    parts.append(f"\n<!-- inline {sp.name} -->\n<script>\n{sp.read_text(errors='replace')}\n</script>\n")

parts.append('''
<script>
  window.BRAND_LOGO_DATA_URI = __LOGO_JSON__;
  window.BRAND_CATEGORY_LOGO_DATA_URI = __CATEGORY_LOGO_JSON__;
  window.BRAND_PI_LOGO_DATA_URI = __PI_LOGO_JSON__;
  window.BRAND_FOOTER_LOGO_DATA_URI = __FOOTER_LOGO_JSON__;
  window.BRAND_SPLASH_DATA_URI = __SPLASH_JSON__;
  window.BRAND_BATIK_DATA_URI = __BATIK_JSON__;
  window.BRAND_BATIK_NIGHT_DATA_URI = __NIGHT_BATIK_JSON__;
</script>
</head>
<body>
  <div id="root" class="w-full max-w-md bg-[#F5F3F7] min-h-screen shadow-[0_0_60px_rgba(0,0,0,0.85)] flex flex-col relative overflow-hidden sm:rounded-3xl my-0 sm:my-4 sm:border-8 sm:border-neutral-900 mx-auto"></div>
  <script>
    // Arena preview/picker kadang menyuntik script yang memakai helper __name.
    // Saat helper itu tidak ada, yang error adalah script picker, bukan Toko Hana.
    // Definisikan noop agar preview tetap aman.
    window.__name = window.__name || function(fn, name){
      try { if(fn && name && !fn.name) Object.defineProperty(fn, 'name', { value: name, configurable: true }); } catch(e) {}
      return fn;
    };
    function showCQError(title, detail){
      var root = document.getElementById('root');
      if(!root) return;
      root.innerHTML = '<div class="cq-error"><b>' + title + ':</b>\\n' + String(detail || 'unknown') + '</div>';
    }
    window.__showCQError = showCQError;
    window.addEventListener('error', function(e){
      var msg = String((e && e.message) || '');
      var file = String((e && e.filename) || '');
      // Beberapa browser/PWA install flow atau script eksternal kadang hanya melempar
      // "Script error." tanpa stack/filename/line. Itu noise cross-origin, bukan error React Toko Hana.
      if(msg === 'Script error.' && !file && !(e && e.error)){
        console.warn('Ignored generic cross-origin script error during browser/PWA flow.');
        return;
      }
      // Arena element picker/preview kadang menyuntik script sendiri (?picker=1) dan pernah error
      // ReferenceError: __name is not defined di htmlElementPickerFrameScript. Itu bukan error app Toko Hana.
      if(msg.indexOf('__name is not defined') !== -1 || file.indexOf('picker=1') !== -1 || msg.indexOf('htmlElementPickerFrameScript') !== -1){
        console.warn('Ignored Arena picker helper error:', msg);
        return;
      }
      // Cloudflare/Arena preview kadang menyuntik script analytics. Saat CQ dibuka dari file/origin null,
      // beacon analytics itu error sendiri. Ini bukan error Toko Hana, jadi jangan tampilkan layar merah.
      if(file.indexOf('cloudflareinsights.com') !== -1 || file.indexOf('beacon.min.js') !== -1 || msg.indexOf('Beacons are only supported over HTTP') !== -1){
        console.warn('Ignored external analytics error:', msg);
        return;
      }
      // Preview workspace berjalan di iframe sandbox/origin null. Kadang script viewer/browser mencoba baca
      // window/frame.document lintas origin lalu melempar SecurityError. Aplikasi Toko Hana tetap jalan,
      // jadi jangan ganti layar warung dengan error merah untuk noise preview ini.
      if(msg.indexOf("Failed to read a named property 'document' from 'Window'") !== -1 || msg.indexOf('Blocked a frame with origin "null" from accessing a cross-origin frame') !== -1){
        console.warn('Ignored workspace preview cross-origin frame error:', msg);
        return;
      }
      var detail = (e && (e.message || e.error)) || 'unknown';
      if(e && e.error && e.error.stack) detail = e.error.stack;
      detail += '\\n\\nLine: ' + ((e && e.lineno) || '') + ' Column: ' + ((e && e.colno) || '');
      showCQError('App error', detail);
    });
    window.addEventListener('unhandledrejection', function(e){
      var reason = e && e.reason;
      var reasonText = String((reason && (reason.message || reason.stack)) || reason || '');
      if(reasonText.indexOf('__name is not defined') !== -1 || reasonText.indexOf('htmlElementPickerFrameScript') !== -1 || reasonText.indexOf('picker=1') !== -1){
        console.warn('Ignored Arena picker promise error:', reasonText);
        return;
      }
      if(reasonText.indexOf('cloudflareinsights.com') !== -1 || reasonText.indexOf('beacon.min.js') !== -1 || reasonText.indexOf('Beacons are only supported over HTTP') !== -1){
        console.warn('Ignored external analytics promise error:', reasonText);
        return;
      }
      if(reasonText.indexOf("Failed to read a named property 'document' from 'Window'") !== -1 || reasonText.indexOf('Blocked a frame with origin "null" from accessing a cross-origin frame') !== -1){
        console.warn('Ignored workspace preview cross-origin promise error:', reasonText);
        return;
      }
      var detail = reason && reason.stack ? reason.stack : (reason && reason.message ? reason.message : reason);
      showCQError('Async error', detail || 'unknown promise error');
    });
    document.addEventListener('focusin', function(e){
      if(e.target && e.target.matches && e.target.matches('input, textarea, select')){
        document.body.classList.add('keyboard-open');
      }
    });
    document.addEventListener('focusout', function(){
      setTimeout(function(){ document.body.classList.remove('keyboard-open'); }, 180);
    });
  </script>
  <script>
    (function(){
      var deferredPrompt = null;
      var dismissedKey = 'toko_hana_install_nudge_dismissed_v1';
      function isStandalone(){ return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true; }
      function isIOS(){ return /iphone|ipad|ipod/i.test(navigator.userAgent || ''); }
      function canShow(){ return !isStandalone() && !localStorage.getItem(dismissedKey) && (location.protocol === 'https:' || location.hostname === 'localhost'); }
      function showInstallNudge(canInstall){
        if(!canShow() || document.querySelector('.hana-install-nudge')) return;
        var box = document.createElement('div');
        box.className = 'hana-install-nudge';
        var text = document.createElement('div'); text.style.flex = '1';
        text.innerHTML = '<b>Pasang Toko Hana di HP</b><span>Biar warung tinggal sekali tap dari layar utama.</span>';
        var btn = document.createElement('button'); btn.className = 'hana-install-primary'; btn.textContent = canInstall ? 'Install' : 'Caranya';
        var close = document.createElement('button'); close.className = 'hana-install-close'; close.textContent = 'Nanti';
        close.onclick = function(){ localStorage.setItem(dismissedKey, '1'); box.remove(); };
        btn.onclick = async function(){
          if(deferredPrompt){
            deferredPrompt.prompt();
            try { await deferredPrompt.userChoice; } catch(e){}
            deferredPrompt = null; box.remove();
          } else if(isIOS()) {
            alert('Untuk iPhone: buka di Safari → tekan tombol Share → pilih Add to Home Screen / Tambah ke Layar Utama.');
          } else {
            alert('Buka menu browser (⋮) lalu pilih Install app / Add to Home screen.');
          }
        };
        box.appendChild(text); box.appendChild(btn); box.appendChild(close); document.body.appendChild(box);
      }
      window.addEventListener('beforeinstallprompt', function(e){ e.preventDefault(); deferredPrompt = e; setTimeout(function(){ showInstallNudge(true); }, 1200); });
      window.addEventListener('appinstalled', function(){ localStorage.setItem(dismissedKey, '1'); var el=document.querySelector('.hana-install-nudge'); if(el) el.remove(); });
      if(isIOS()) setTimeout(function(){ showInstallNudge(false); }, 2800);
    })();
  </script>
  <script>
'''.replace('__LOGO_JSON__', json.dumps(logo_data)).replace('__CATEGORY_LOGO_JSON__', json.dumps(category_logo_data)).replace('__PI_LOGO_JSON__', json.dumps(pi_logo_data)).replace('__FOOTER_LOGO_JSON__', json.dumps(footer_logo_data)).replace('__SPLASH_JSON__', json.dumps(splash_data)).replace('__BATIK_JSON__', json.dumps(batik_data)).replace('__NIGHT_BATIK_JSON__', json.dumps(night_batik_data)))

parts.append(compiled)
parts.append('''

try {
  class CQErrorBoundary extends React.Component {
    constructor(props){ super(props); this.state = { error: null, info: null }; }
    componentDidCatch(error, info){ this.setState({ error: error, info: info }); }
    render(){
      if(this.state.error){
        var detail = (this.state.error && this.state.error.stack ? this.state.error.stack : this.state.error) + '\\n\\nComponent stack:\\n' + ((this.state.info && this.state.info.componentStack) || '');
        return React.createElement('div', { className: 'cq-error' }, React.createElement('b', null, 'Render error:'), '\\n' + detail);
      }
      return this.props.children;
    }
  }
  const container = document.getElementById('root');
  const root = ReactDOM.createRoot(container);
  root.render(React.createElement(CQErrorBoundary, null, React.createElement(App)));
} catch (e) {
  const container = document.getElementById('root');
  container.innerHTML = '<div class="cq-error"><b>Render error:</b>\\n' + (e && e.stack ? e.stack : e) + '</div>';
}
  </script>
</body>
</html>
''')

OUT.write_text(''.join(parts), encoding='utf-8')
print(f'Compiled CQ created: {OUT} ({OUT.stat().st_size/1024/1024:.2f} MB)')
print(f'Using app source: {APP}')
print(f'Using project dir: {PROJECT_DIR}')
print(f'Using assets dir: {ASSETS_DIR}')
print(f'Using libs: {LIBS}')
print(f'Using main/logo card: {logo_path}')
print(f'Using install favicon: {favicon_path}')
print(f'Using install apple icon: {apple_icon_path}')
print(f'Using install manifest 192: {manifest_icon_192_path}')
print(f'Using install manifest 512: {manifest_icon_512_path}')
print(f'Using category icon clean-pad: {category_logo_path}')
print(f'Using batik: {batik_path}')
print(f'Using splash: {splash_path}')
print(f'Using footer logo: {footer_logo_path}')
