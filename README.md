# Post Backup & Restore Pro 🚀

An advanced, feature-rich WordPress utility plugin engineered to provide seamless backup, selective migration, and robust one-click restoration systems for post content, media attachments, and metadata. 

Featuring a premium, WooCommerce-inspired **3-Step Export Wizard**, full directory traversal (Zip Slip) security protection, automated backup scheduling, and space-saving granular exclusions.

---

## 🎨 Dashboard & Interface Overview

### 📊 Real-Time Administrative Metrics
The plugin introduces an authentic, WordPress-native **Dashboard Header Widgets** row providing clear operational visibility right at the top of the interface.

*Insert Screenshot: Dashboard Summary Metrics Widget*
> **Screenshot Placeholder 1:** Showing the four summary cards matching native WordPress dashboard layouts (`Total Posts`, `Published`, `Drafts`, and `Media Count`) with high-contrast indicator borders and active SVG icons.

### 🎯 Pro-Grade Modern UI Style
Say goodbye to crowded left-aligned tables and unstructured forms. The new layout brings a balanced, containerized **12-Column Responsive Workspace**:
*   **70% Main Canvas (Left Column):** Keeps interactive wizard controls focused.
*   **30% Floating Summary Sidebar (Right Column):** Remains sticky (`lg:sticky lg:top-4`) to display reactive live zip-size approximations, asset counts, and instant system notifications.

---

## 📦 The 3-Step Export Wizard

┌─────────────────────────────────────────────────────────┐
│                      EXPORT WIZARD                      │
├───────────────────┬───────────────────┬─────────────────┤
│ 🟢 Step 1: Filter │ ⚪ Step 2: Options │ ⚪ Step 3: Sync │
└───────────────────┴───────────────────┴─────────────────┘


### 🔍 Step 1: Advanced Search & Filter Posts
We transformed raw, unmanaged inline fields into a pristine layout featuring an elegant **Advanced Filters Toolbar** and instant query mechanics.

*   **Live Instant Search:** Results instantly filter dynamically as you type—no hard page refreshes required.
*   **Collapsible Filter Row Grid:** Clean multi-column CSS grid aligning `Keyword Search`, `Tag`, `Author`, and `Post Status` into unified fields with active border transitions.
*   **Visual Cards vs. Table Toggle:** Swap fluidly between a classic admin data ledger and a visual cards display view.
*   **Hover Tooltip Thumbnail Previews:** Hovering over post elements immediately brings up a rich image tooltip displaying embedded feature graphics and word count limits.

*Insert Screenshot: Step 1 Filter Canvas & Tag Clouds*
> **Screenshot Placeholder 2:** Showing the responsive filter grids and the **Interactive Category Tag Clouds** configured as clean rounded badge capsules with custom selection variables (`[✓ Leather Shoes]` `[ Blog ]`).

---

### ⚙️ Step 2: Granular Meta & Asset Options
Customize exactly what bundles into your distribution package. Toggle dedicated metadata configurations using standard high-contrast components.

*Insert Screenshot: Step 2 Export Rules Matrix*
> **Screenshot Placeholder 3:** Showing the configuration matrix allowing users to pick elements like `Featured Images`, `Embedded Attachments`, `Comments`, `Yoast SEO`, `Rank Math SEO`, `ACF Fields`, or `Gutenberg Blocks`.

---

### 📥 Step 3: Secure Live Build & Download
Traces the compilation process in real-time. Features an advanced asynchronous progress bar paired with dynamic subsystem log feeds (e.g., *"Generating XML structure..."*, *"Serializing attachments..."*).

*Insert Screenshot: Step 3 Active Packaging UI*
> **Screenshot Placeholder 4:** Showing the progress engine running, detailing real-time step progressions, item counts, and generating the final one-click `Download ZIP` button.

---

## 🛡️ Enterprise Security & Smart Exclusions

### 🦺 Zip Slip Security & Non-Blocking Bypass Core
Traditional recovery engines crash or leave files corrupted when encountering invalid files. Our upgraded backend engine includes strict directory traversal sanitization:
*   Detects relative directory traversal vulnerabilities (`..` or `\`).
*   Instead of terminating the script, it isolates the threat, logs a clean non-blocking security notice, and **successfully proceeds** importing all remaining safe database blocks.

### 💾 Space-Saving Exclusion UI & Backup Automation
Configure retention parameters and optimize processing speeds right from the integrated Settings interface.

*Insert Screenshot: Exclusion Configuration Panel*
> **Screenshot Placeholder 5:** Showing the **Exclusions UI** panel rendering custom folder targets and file format pills (`.mp4`, `.zip`, `wp-content/cache`) to pass over during builds, side-by-side with the automated Chron-Interval scheduler toggle.

---

## 🖥️ Keyboard Shortcuts

Speed up your administrative workflow using native context hotkeys mapped directly into the core component:

| Hotkey Combination | Action Triggered |
| :--- | :--- |
| <kbd>Ctrl</kbd> + <kbd>F</kbd> / <kbd>Cmd</kbd> + <kbd>F</kbd> | Instantly jumps focus into the Live Search bar |
| <kbd>Ctrl</kbd> + <kbd>A</kbd> / <kbd>Cmd</kbd> + <kbd>A</kbd> | Selects all filtered posts within active constraints |
| <kbd>Ctrl</kbd> + <kbd>E</kbd> / <kbd>Cmd</kbd> + <kbd>E</kbd> | Advances the wizard stage and fires compiler packaging |
| <kbd>Esc</kbd> | Instantly clears search text and resets all filters |

---

## 🛠️ Installation & Setup

1. Clone or download this repository directly into your local environment:
   ```bash
   git clone [https://github.com/iatifsyed/post-backup-restore-pro.git](https://github.com/iatifsyed/post-backup-restore-pro.git)
Compress the folder into a .zip file or upload the directory directly to your server structure via SFTP:

Code snippet
/wp-content/plugins/post-backup-restore-pro/
Navigate to WordPress Admin Dashboard ➔ Plugins, and click Activate.

Access the fresh core layout via the new side menu option: Post Backup Pro.


***

### 💡 Pro-Tips for Uploading to GitHub:
1. Replace `yourusername` in the installation section with your real GitHub username.
2. When you take your screenshots, name them explicitly (e.g., `metrics-widget.png`, `step1-filters.png`) and upload them to an `assets/` or `images/` directory inside your repo.
3. Replace the text `*Insert Screenshot: ...*` and its description block with standard image Markdown references, like this:
   ```markdown
   ![Dashboard Summary Metrics Widget](assets/metrics-widget.png)
