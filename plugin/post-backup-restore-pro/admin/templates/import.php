<?php
/**
 * Import Posts page template.
 *
 * @package           PostBackupRestorePro
 * @subpackage        PostBackupRestorePro/admin/templates
 * @author            Atif Syed
 */

// Block direct access
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<div class="wrap pbrp-admin-wrap">
	<h1 class="wp-heading-inline"><?php esc_html_e( 'Import WordPress Posts', 'post-backup-restore-pro' ); ?></h1>
	<hr class="wp-header-end">

	<div class="pbrp-grid">
		<!-- Drag & Drop / File Input Card -->
		<div class="pbrp-card uploader-card">
			<h2><?php esc_html_e( 'Upload Backup ZIP', 'post-backup-restore-pro' ); ?></h2>
			<p class="description"><?php esc_html_e( 'Drag and drop your backup ZIP archive (e.g., my-blog-backup.zip) here, or click to upload manually.', 'post-backup-restore-pro' ); ?></p>
			
			<div id="pbrp-drag-drop-zone" class="pbrp-drag-drop-zone">
				<span class="dashicons dashicons-upload"></span>
				<h3><?php esc_html_e( 'Drag & Drop ZIP file here', 'post-backup-restore-pro' ); ?></h3>
				<p><?php esc_html_e( 'or', 'post-backup-restore-pro' ); ?></p>
				<button type="button" id="pbrp-btn-browse" class="button button-secondary"><?php esc_html_e( 'Browse Files', 'post-backup-restore-pro' ); ?></button>
				<input type="file" id="pbrp-file-input" accept=".zip" style="display:none;">
			</div>
			
			<div id="pbrp-import-file-details" class="file-details-box" style="display:none;">
				<span class="dashicons dashicons-media-archive"></span>
				<div class="file-meta">
					<h4 class="filename-text"></h4>
					<p class="filesize-text"></p>
				</div>
				<button type="button" id="pbrp-btn-remove-file" class="button button-link delete-text"><?php esc_html_e( 'Remove', 'post-backup-restore-pro' ); ?></button>
			</div>
		</div>

		<!-- Options Panel -->
		<div class="pbrp-card options-card">
			<h2><?php esc_html_e( 'Import & Mapping Options', 'post-backup-restore-pro' ); ?></h2>
			
			<div class="form-field-group">
				<label for="pbrp-import-duplicate"><?php esc_html_e( 'Duplicate Handling', 'post-backup-restore-pro' ); ?></label>
				<select id="pbrp-import-duplicate">
					<option value="skip" selected><?php esc_html_e( 'Skip duplicates (Preserves existing posts)', 'post-backup-restore-pro' ); ?></option>
					<option value="replace"><?php esc_html_e( 'Replace existing posts (Overwrites title/content/dates)', 'post-backup-restore-pro' ); ?></option>
					<option value="rename"><?php esc_html_e( 'Rename imported items (Creates a separate post copy)', 'post-backup-restore-pro' ); ?></option>
				</select>
				<p class="description"><?php esc_html_e( 'Choose what to do if a post with the same URL slug or title already exists on this site.', 'post-backup-restore-pro' ); ?></p>
			</div>

			<div class="form-field-group">
				<label for="pbrp-import-strategy"><?php esc_html_e( 'Restore Strategy', 'post-backup-restore-pro' ); ?></label>
				<select id="pbrp-import-strategy">
					<option value="all" selected><?php esc_html_e( 'Restore Everything (Posts, Custom Fields, and Sideload Media)', 'post-backup-restore-pro' ); ?></option>
					<option value="content_only"><?php esc_html_e( 'Import Post Content Only (Skip downloading images)', 'post-backup-restore-pro' ); ?></option>
					<option value="images_only"><?php esc_html_e( 'Update/Sideload Media Assets Only (Attach missing images)', 'post-backup-restore-pro' ); ?></option>
					<option value="new_only"><?php esc_html_e( 'Only Import New Posts (Safely skip any existing matches)', 'post-backup-restore-pro' ); ?></option>
				</select>
			</div>
		</div>
	</div>

	<!-- Analysis / Preview Screen -->
	<div id="pbrp-import-preview-card" class="pbrp-card preview-summary-card" style="display:none;">
		<h2><span class="dashicons dashicons-analytics"></span> <?php esc_html_e( 'Archive Integrity Analysis', 'post-backup-restore-pro' ); ?></h2>
		<p class="description"><?php esc_html_e( 'Review the archive metadata and configuration before committing the import process.', 'post-backup-restore-pro' ); ?></p>
		
		<div class="analysis-stats-row">
			<div class="analysis-stat">
				<span class="value posts-count-val">0</span>
				<span class="label"><?php esc_html_e( 'Posts found', 'post-backup-restore-pro' ); ?></span>
			</div>
			<div class="analysis-stat">
				<span class="value images-count-val">0</span>
				<span class="label"><?php esc_html_e( 'Content images found', 'post-backup-restore-pro' ); ?></span>
			</div>
			<div class="analysis-stat">
				<span class="value authors-count-val">0</span>
				<span class="label"><?php esc_html_e( 'Authors included', 'post-backup-restore-pro' ); ?></span>
			</div>
		</div>

		<div class="meta-details-grid">
			<div class="detail-item">
				<strong><?php esc_html_e( 'Backup Creator Version:', 'post-backup-restore-pro' ); ?></strong>
				<span class="creator-version-text"></span>
			</div>
			<div class="detail-item">
				<strong><?php esc_html_e( 'Export Created Date:', 'post-backup-restore-pro' ); ?></strong>
				<span class="created-date-text"></span>
			</div>
			<div class="detail-item">
				<strong><?php esc_html_e( 'Categories contained:', 'post-backup-restore-pro' ); ?></strong>
				<span class="categories-list-text text-muted"></span>
			</div>
			<div class="detail-item">
				<strong><?php esc_html_e( 'Tags contained:', 'post-backup-restore-pro' ); ?></strong>
				<span class="tags-list-text text-muted"></span>
			</div>
		</div>

		<div class="action-btn-row">
			<button type="button" id="pbrp-btn-execute-restore" class="button button-primary button-large">
				<span class="dashicons dashicons-update"></span> <?php esc_html_e( 'Confirm & Run Restore', 'post-backup-restore-pro' ); ?>
			</button>
			<button type="button" id="pbrp-btn-cancel-restore" class="button button-link"><?php esc_html_e( 'Cancel', 'post-backup-restore-pro' ); ?></button>
		</div>
	</div>

	<!-- Import Process Progress -->
	<div id="pbrp-import-progress-card" class="pbrp-card progress-card" style="display:none;">
		<h2><?php esc_html_e( 'Restoring Post Backup Database', 'post-backup-restore-pro' ); ?></h2>
		<p class="progress-status-text"><?php esc_html_e( 'Sideloading images and writing post records...', 'post-backup-restore-pro' ); ?></p>
		<div class="pbrp-progress-bar-container">
			<div class="pbrp-progress-bar-fill" style="width: 0%;"></div>
		</div>
		<div class="progress-percent">0%</div>
		
		<div id="pbrp-import-success-message" style="display:none;">
			<p class="success-notice"></p>
			<a href="<?php echo esc_url( admin_url( 'edit.php' ) ); ?>" class="button button-primary button-large">
				<span class="dashicons dashicons-admin-post"></span> <?php esc_html_e( 'View Restored Posts', 'post-backup-restore-pro' ); ?>
			</a>
		</div>
	</div>
</div>
