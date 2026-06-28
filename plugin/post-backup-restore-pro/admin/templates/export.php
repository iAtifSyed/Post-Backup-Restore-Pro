<?php
/**
 * Export Posts page template.
 *
 * @package           PostBackupRestorePro
 * @subpackage        PostBackupRestorePro/admin/templates
 * @author            Atif Syed
 */

// Block direct access
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Fetch categories, tags, authors, and post types for filter selects
$categories = get_categories( array( 'hide_empty' => false ) );
$tags       = get_tags( array( 'hide_empty' => false ) );
$authors    = get_users( array( 'role__in' => array( 'administrator', 'editor', 'author' ) ) );
?>
<div class="wrap pbrp-admin-wrap">
	<h1 class="wp-heading-inline"><?php esc_html_e( 'Export WordPress Posts', 'post-backup-restore-pro' ); ?></h1>
	<hr class="wp-header-end">

	<div class="pbrp-card filter-container">
		<h2><?php esc_html_e( 'Search & Filter Posts', 'post-backup-restore-pro' ); ?></h2>
		
		<div class="filter-controls-grid">
			<div class="filter-item">
				<label for="pbrp-filter-search"><?php esc_html_e( 'Keyword Search', 'post-backup-restore-pro' ); ?></label>
				<input type="text" id="pbrp-filter-search" class="regular-text" placeholder="<?php esc_attr_e( 'Search by title...', 'post-backup-restore-pro' ); ?>">
			</div>

			<div class="filter-item">
				<label for="pbrp-filter-tag"><?php esc_html_e( 'Tag', 'post-backup-restore-pro' ); ?></label>
				<select id="pbrp-filter-tag">
					<option value=""><?php esc_html_e( 'All Tags', 'post-backup-restore-pro' ); ?></option>
					<?php foreach ( $tags as $t ) : ?>
						<option value="<?php echo esc_attr( $t->slug ); ?>"><?php echo esc_html( $t->name ); ?></option>
					<?php endforeach; ?>
				</select>
			</div>

			<div class="filter-item">
				<label for="pbrp-filter-author"><?php esc_html_e( 'Author', 'post-backup-restore-pro' ); ?></label>
				<select id="pbrp-filter-author">
					<option value=""><?php esc_html_e( 'All Authors', 'post-backup-restore-pro' ); ?></option>
					<?php foreach ( $authors as $auth ) : ?>
						<option value="<?php echo intval( $auth->ID ); ?>"><?php echo esc_html( $auth->display_name ); ?></option>
					<?php endforeach; ?>
				</select>
			</div>

			<div class="filter-item">
				<label for="pbrp-filter-status"><?php esc_html_e( 'Post Status', 'post-backup-restore-pro' ); ?></label>
				<select id="pbrp-filter-status">
					<option value="any"><?php esc_html_e( 'Any Status', 'post-backup-restore-pro' ); ?></option>
					<option value="publish"><?php esc_html_e( 'Published', 'post-backup-restore-pro' ); ?></option>
					<option value="draft"><?php esc_html_e( 'Drafts', 'post-backup-restore-pro' ); ?></option>
					<option value="pending"><?php esc_html_e( 'Pending Review', 'post-backup-restore-pro' ); ?></option>
					<option value="future"><?php esc_html_e( 'Scheduled', 'post-backup-restore-pro' ); ?></option>
				</select>
			</div>
		</div>

		<div class="pbrp-category-selection-container">
			<div class="pbrp-category-header">
				<label class="pbrp-category-title"><?php esc_html_e( 'Filter by Categories (Leave empty to include all)', 'post-backup-restore-pro' ); ?></label>
				<div class="pbrp-category-actions">
					<a href="#" id="pbrp-cat-select-all"><?php esc_html_e( 'Select All', 'post-backup-restore-pro' ); ?></a>
					<span class="separator">|</span>
					<a href="#" id="pbrp-cat-select-none"><?php esc_html_e( 'Clear All', 'post-backup-restore-pro' ); ?></a>
				</div>
			</div>
			<div class="pbrp-category-checkbox-grid">
				<?php foreach ( $categories as $cat ) : ?>
					<label class="pbrp-category-checkbox-item">
						<input type="checkbox" class="pbrp-filter-category-cb" value="<?php echo esc_attr( $cat->slug ); ?>">
						<span class="pbrp-category-name"><?php echo esc_html( $cat->name ); ?></span>
					</label>
				<?php endforeach; ?>
			</div>
		</div>

		<div class="filter-action-row">
			<button type="button" id="pbrp-btn-apply-filters" class="button button-secondary"><?php esc_html_e( 'Apply Filters', 'post-backup-restore-pro' ); ?></button>
			<button type="button" id="pbrp-btn-reset-filters" class="button button-link"><?php esc_html_e( 'Reset Filters', 'post-backup-restore-pro' ); ?></button>
		</div>
	</div>

	<!-- Export Process UI (Progress block) -->
	<div id="pbrp-export-progress-card" class="pbrp-card progress-card" style="display:none;">
		<h2><?php esc_html_e( 'Generating Backup Archive', 'post-backup-restore-pro' ); ?></h2>
		<p class="progress-status-text"><?php esc_html_e( 'Initializing...', 'post-backup-restore-pro' ); ?></p>
		<div class="pbrp-progress-bar-container">
			<div class="pbrp-progress-bar-fill" style="width: 0%;"></div>
		</div>
		<div class="progress-percent">0%</div>
		<div id="pbrp-export-success-message" style="display:none;">
			<p class="success-notice"></p>
			<a id="pbrp-btn-download-zip" href="#" class="button button-primary button-large" download>
				<span class="dashicons dashicons-download"></span> <?php esc_html_e( 'Download Backup ZIP', 'post-backup-restore-pro' ); ?>
			</a>
		</div>
	</div>

	<!-- Posts List Card -->
	<div class="pbrp-card post-selection-list-card">
		<div class="list-header-row">
			<h2><?php esc_html_e( 'Select Posts to Export', 'post-backup-restore-pro' ); ?></h2>
			<div class="bulk-controls">
				<button type="button" id="pbrp-select-all" class="button button-secondary button-small"><?php esc_html_e( 'Select All', 'post-backup-restore-pro' ); ?></button>
				<button type="button" id="pbrp-select-none" class="button button-secondary button-small"><?php esc_html_e( 'Select None', 'post-backup-restore-pro' ); ?></button>
				<button type="button" id="pbrp-btn-execute-export" class="button button-primary button-large" disabled>
					<span class="dashicons dashicons-backup"></span> <?php esc_html_e( 'Export Selected', 'post-backup-restore-pro' ); ?>
				</button>
			</div>
		</div>

		<div class="pbrp-table-responsive">
			<table class="wp-list-table widefat fixed striped pbrp-posts-table">
				<thead>
					<tr>
						<th class="manage-column column-cb check-column"><input type="checkbox" id="pbrp-main-cb"></th>
						<th class="column-title"><?php esc_html_e( 'Title', 'post-backup-restore-pro' ); ?></th>
						<th><?php esc_html_e( 'Slug', 'post-backup-restore-pro' ); ?></th>
						<th><?php esc_html_e( 'Category', 'post-backup-restore-pro' ); ?></th>
						<th><?php esc_html_e( 'Author', 'post-backup-restore-pro' ); ?></th>
						<th><?php esc_html_e( 'Date', 'post-backup-restore-pro' ); ?></th>
						<th><?php esc_html_e( 'Status', 'post-backup-restore-pro' ); ?></th>
					</tr>
				</thead>
				<tbody id="pbrp-posts-list-body">
					<tr>
						<td colspan="7" class="loading-td">
							<span class="spinner is-active"></span> <?php esc_html_e( 'Loading posts...', 'post-backup-restore-pro' ); ?>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>
