<?php
/**
 * Admin Dashboard template.
 *
 * @package           PostBackupRestorePro
 * @subpackage        PostBackupRestorePro/admin/templates
 * @author            Atif Syed
 */

// Block direct access
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$history = get_option( 'pbrp_backup_history', array() );
$total_backups = count( $history );
$last_backup = ! empty( $history ) ? end( $history ) : null;
?>
<div class="wrap pbrp-admin-wrap">
	<h1 class="wp-heading-inline"><?php esc_html_e( 'Post Backup & Restore Pro', 'post-backup-restore-pro' ); ?></h1>
	<hr class="wp-header-end">

	<div class="pbrp-dashboard-header">
		<h2><?php esc_html_e( 'Welcome to Post Backup & Restore Pro', 'post-backup-restore-pro' ); ?></h2>
		<p class="about-text"><?php esc_html_e( 'Manage your content migration and backups easily. Select specific posts, media files, and SEO metadata, pack them into a single secure ZIP file, and restore them flawlessly on any other WordPress installation.', 'post-backup-restore-pro' ); ?></p>
	</div>

	<!-- Stats Counters Grid -->
	<div class="pbrp-stats-grid">
		<div class="pbrp-card pbrp-stat-card">
			<span class="dashicons dashicons-backup"></span>
			<div class="stat-content">
				<h3><?php echo intval( $total_backups ); ?></h3>
				<p><?php esc_html_e( 'Total Backups Generated', 'post-backup-restore-pro' ); ?></p>
			</div>
		</div>

		<div class="pbrp-card pbrp-stat-card">
			<span class="dashicons dashicons-admin-post"></span>
			<div class="stat-content">
				<h3><?php echo wp_count_posts('post')->publish; ?></h3>
				<p><?php esc_html_e( 'Published Posts on Site', 'post-backup-restore-pro' ); ?></p>
			</div>
		</div>

		<div class="pbrp-card pbrp-stat-card">
			<span class="dashicons dashicons-clock"></span>
			<div class="stat-content">
				<h3><?php echo $last_backup ? esc_html( $last_backup['timestamp'] ) : esc_html__( 'Never', 'post-backup-restore-pro' ); ?></h3>
				<p><?php esc_html_e( 'Last Backup Date', 'post-backup-restore-pro' ); ?></p>
			</div>
		</div>
	</div>

	<!-- Quick Action Panels -->
	<div class="pbrp-grid">
		<div class="pbrp-card main-action-card">
			<h2><?php esc_html_e( 'Quick Start Tasks', 'post-backup-restore-pro' ); ?></h2>
			<p><?php esc_html_e( 'Choose your task below to quickly export or import content.', 'post-backup-restore-pro' ); ?></p>
			<div class="button-row">
				<a href="<?php echo esc_url( admin_url( 'admin.php?page=pbrp-export' ) ); ?>" class="button button-primary button-large">
					<span class="dashicons dashicons-export"></span> <?php esc_html_e( 'Export Selected Posts', 'post-backup-restore-pro' ); ?>
				</a>
				<a href="<?php echo esc_url( admin_url( 'admin.php?page=pbrp-import' ) ); ?>" class="button button-secondary button-large">
					<span class="dashicons dashicons-import"></span> <?php esc_html_e( 'Restore from Backup', 'post-backup-restore-pro' ); ?>
				</a>
			</div>
		</div>

		<div class="pbrp-card logs-preview-card">
			<h2><?php esc_html_e( 'Recent Backups', 'post-backup-restore-pro' ); ?></h2>
			<?php if ( empty( $history ) ) : ?>
				<p class="description"><?php esc_html_e( 'No backups have been created yet.', 'post-backup-restore-pro' ); ?></p>
			<?php else : ?>
				<table class="wp-list-table widefat fixed striped">
					<thead>
						<tr>
							<th><?php esc_html_e( 'ZIP Name', 'post-backup-restore-pro' ); ?></th>
							<th><?php esc_html_e( 'Posts', 'post-backup-restore-pro' ); ?></th>
							<th><?php esc_html_e( 'Images', 'post-backup-restore-pro' ); ?></th>
							<th><?php esc_html_e( 'Size', 'post-backup-restore-pro' ); ?></th>
							<th><?php esc_html_e( 'Actions', 'post-backup-restore-pro' ); ?></th>
						</tr>
					</thead>
					<tbody>
						<?php 
						// Show the 4 most recent backups
						$recent = array_slice( array_reverse( $history ), 0, 4 );
						foreach ( $recent as $b ) : 
						?>
						<tr>
							<td><strong><?php echo esc_html( $b['zip_name'] ); ?></strong></td>
							<td><?php echo intval( $b['posts_count'] ); ?></td>
							<td><?php echo intval( $b['images_count'] ); ?></td>
							<td><?php echo esc_html( $b['size'] ); ?></td>
							<td>
								<a href="<?php echo esc_url( content_url( 'uploads/pbrp-backups/' . $b['zip_name'] ) ); ?>" class="button button-small" download>
									<span class="dashicons dashicons-download"></span>
								</a>
							</td>
						</tr>
						<?php endforeach; ?>
					</tbody>
				</table>
			<?php endif; ?>
		</div>
	</div>
</div>
		<?php
