# Post Backup & Restore Pro - Design Assets & Repo Guide

This guide defines the asset standards and GitHub directory structure for submitting **Post Backup & Restore Pro** to the official WordPress.org Plugin Repository.

---

## 1. Plugin Icon Prompts

WordPress.org uses standard SVG or PNG icons in `icon-128x128.png` and `icon-256x256.png` formats.

### AI Image Generation Prompts
> **Prompt for icon (1:1 aspect ratio):**
> *“A high-end, modern, minimalist vector app icon for a WordPress utility called 'Post Backup & Restore Pro'. The icon should center a sleek interlocking cloud shape merging into a secure, circular arrow backup loop. Use a primary color of professional WordPress blue (#2271b1) accented by dark cosmic slate grey, set against a pristine, solid off-white background. Ultra-clean typography and sharp lines, no realistic shadows, vector flat design style.”*

---

## 2. Plugin Banner Prompts

WordPress.org requires header banners in `banner-772x250.png` and `banner-1544x500.png` dimensions.

### AI Image Generation Prompts
> **Prompt for banner (16:9 or 3:1 aspect ratio):**
> *“A high-tech widescreen marketing banner for a WordPress plugin called 'Post Backup & Restore Pro'. The layout features a futuristic, clean dashboard abstract background on the left and a highlighted glowing ZIP archive folder on the right with files and image attachments streaming securely into a cloud container. Colors include deep navy slate (#0f172a), glowing cobalt blue accents, and soft silver highlights. Sophisticated, modern corporate visual design, professional lighting, no text.”*

---

## 3. Recommended Screenshots List

Place these inside your `/assets` directory for WordPress.org:
1. `screenshot-1.png`: **The Main Dashboard Hub** showing quick summary stats and historical backup records.
2. `screenshot-2.png`: **The Advanced Export Panel** displaying filter selections, post checkboxes, and batch compression progress.
3. `screenshot-3.png`: **The Drag & Drop Restore Interface** showing file uploads, integrity check results, and database write status.
4. `screenshot-4.png`: **The Core Settings Configuration** showcasing compression adjustments, execution timing thresholds, and AES-256 encryption.

---

## 4. Professional GitHub Repository Structure

Maintain this hierarchy to keep development source directories separate from WordPress.org build structures:

```text
post-backup-restore-pro/         # Root of your GitHub repository
├── .github/
│   └── workflows/
│       └── deploy.yml           # Automated deployment to WordPress.org SVN
├── assets/                      # WordPress.org asset files (SVN directory)
│   ├── icon-128x128.png
│   ├── icon-256x256.png
│   ├── banner-772x250.png
│   ├── banner-1544x500.png
│   ├── screenshot-1.png
│   └── screenshot-2.png
├── src/                         # Source development workspace (Webpack/Vite/Composer)
└── trunk/                       # The actual deployable plugin code (main trunk)
    ├── admin/
    ├── classes/
    ├── includes/
    ├── post-backup-restore-pro.php
    ├── uninstall.php
    ├── readme.txt
    ├── CHANGELOG.md
    └── LICENSE.txt
```
