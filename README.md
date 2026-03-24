# Kalvara — Kost Premium Surabaya

## Struktur Folder

```
kalvara/
├── index.html                    # Halaman utama
├── kamar-standard-deluxe.html    # Detail kamar Standard Deluxe
├── kamar-superior-room.html      # Detail kamar Superior Room
├── kamar-deluxe-studio.html      # Detail kamar Deluxe Studio
├── kamar-family-suite.html       # Detail kamar Family Suite
├── kamar-vip-premium.html        # Detail kamar VIP Premium
├── kamar-executive-room.html     # Detail kamar Executive Room
├── vercel.json                   # Konfigurasi Vercel deployment
├── api/
│   └── chat.js                   # Serverless function AI Chat proxy
└── images/
    ├── brand/
    │   ├── logo.svg              # Logo Kalvara (SVG, scalable)
    │   ├── og-image.jpg          # Open Graph / social share image
    │   ├── hero-bg.jpg           # Background hero section
    │   ├── hero-main.jpg         # Foto utama hero section
    │   └── booking-bg.jpg        # Background section booking
    ├── rooms/
    │   ├── standard-deluxe-1.jpg → standard-deluxe-4.jpg
    │   ├── superior-room-1.jpg   → superior-room-4.jpg
    │   ├── deluxe-studio-1.jpg   → deluxe-studio-4.jpg
    │   ├── family-suite-1.jpg    → family-suite-4.jpg
    │   ├── vip-premium-1.jpg     → vip-premium-4.jpg
    │   └── executive-room-1.jpg  → executive-room-4.jpg
    ├── areas/
    │   ├── lobby.jpg
    │   ├── kitchen.jpg
    │   ├── lounge.jpg
    │   ├── parking.jpg
    │   ├── laundry.jpg
    │   └── corridor.jpg
    └── avatars/
        ├── women-32.jpg ... (21 avatar foto testimoni)
        └── men-45.jpg  ...
```

## Deployment ke Vercel

1. Upload semua file ke GitHub (pertahankan struktur folder)
2. Import repo di vercel.com
3. Set environment variable: `ANTHROPIC_API_KEY` = api key Anda
4. Deploy!

## Mengganti Foto

Ganti file di folder `images/` sesuai kategori:
- **Logo**: ganti `images/brand/logo.svg`
- **Foto kamar**: ganti `images/rooms/nama-kamar-N.jpg`
- **Foto area**: ganti `images/areas/nama-area.jpg`
- **Foto testimoni**: ganti `images/avatars/gender-nomor.jpg`
