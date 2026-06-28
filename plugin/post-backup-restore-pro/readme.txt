=== Post Backup & Restore Pro ===
Contributors: Atif Syed
Tags: post backup, restore, backup posts, backup, export posts, import posts, content migration
Requires at least: 6.3
Tested up to: 6.5
Requires PHP: 8.0
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Create the world's easiest backup & restore solution that exports selected WordPress posts, content media, and SEO attributes into a single ZIP file and restores them perfectly on any other site.

== Description ==

**Post Backup & Restore Pro** is a high-performance, developer-grade content migration plugin designed by **Atif Syed**. Export and restore your WordPress posts, custom metadata, categories, tags, and inline media content seamlessly across distinct installations.

=== Core Features ===
* **Selective Export**: Easily check individual posts, search, and filter by categories, tags, authors, status, or date.
* **All-in-One ZIP Packaging**: Generates a standard ZIP file with standalone post HTML, original media structures, XML, CSV, and JSON metadata.
* **SEO Attribute Protection**: Natively syncs and restores titles, descriptions, focus keywords, canonical tags, and Open Graph information from Yoast, RankMath, and SEOPress.
* **Sideloading Media Engine**: Detects every image in post content, downloads them securely, and automatically replaces original URL links inside content during restore.
* **Safe Zip Extraction**: Employs Zip Slip vulnerability checks, Nonces, and strict capability checks to guarantee complete security.
* **Batch Slicing Technology**: Smoothly manages sites with thousands of posts using AJAX batch processing, bypassing PHP script timeouts.

== Installation ==

1. Upload the `post-backup-restore-pro.zip` folder to the `/wp-content/plugins/` directory, or upload it through the WordPress admin panel via **Plugins -> Add New**.
2. Activate the plugin through the **Plugins** menu in WordPress.
3. Access the plugin options from the left sidebar navigation menu: **Post Backup & Restore**.

== Screenshots ==

1. **Dashboard Overview**: Access stats, quick backup, and visual bento-grid components.
2. **Selective Export Screen**: Search, filter, and choose posts using checkboxes and bulk controls.
3. **Responsive Import Area**: Simple Drag & Drop zip uploader and granular configuration panels.
4. **Interactive Log Auditor**: Audit export durations, image counts, and success logs.

== Changelog ==

= 1.0.2 =
* Initial Public Release. Standardized high-performance AJAX batch export, media sideloading, SEO mapping, and security shields.
