<?php
/**
 * Logs page template.
 *
 * @package           PostBackupRestorePro
 * @subpackage        PostBackupRestorePro/admin/templates
 * @author            Atif Syed
 */

// Block direct access
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$logs = get_option( 'pbrp_logs', array() );
?>
<div class="wrap pbrp-admin-wrap">
	<h1 class="wp-heading-inline"><?php esc_html_e( 'System Activity Logs', 'post-backup-restore-pro' ); ?></h1>
	<hr class="wp-header-end">

	<div class="pbrp-card logs-panel-card">
		<div class="logs-header-row">
			<h2><span class="dashicons dashicons-text-page"></span> <?php esc_html_e( 'Audit Trail and Event Logs', 'post-backup-restore-pro' ); ?></h2>
			<button type="button" id="pbrp-btn-clear-logs" class="button button-secondary delete-button" <?php echo empty( $logs ) ? 'disabled' : ''; ?>>
				<span class="dashicons dashicons-trash"></span> <?php esc_html_e( 'Clear All Activity Logs', 'post-backup-restore-pro' ); ?>
			</button>
		</div>
		<p class="description"><?php esc_html_e( 'Review exact step-by-step progress, duration stats, warnings, and errors encountered during back-and-forth transitions.', 'post-backup-restore-pro' ); ?></p>
		
		<div class="pbrp-logs-terminal-container">
			<div class="terminal-header">
				<span class="terminal-dot red"></span>
				<span class="terminal-dot yellow"></span>
				<span class="terminal-dot green"></span>
				<span class="terminal-title"><?php esc_html_e( 'post-backup-restore-pro.log', 'post-backup-restore-pro' ); ?></span>
			</div>
			<div class="terminal-body" id="pbrp-logs-terminal">
				<?php if ( empty( $logs ) ) : ?>
					<p class="terminal-empty"><?php esc_html_e( '[SYSTEM] No logged events available. Your log journal is pristine!', 'post-backup-restore-pro' ); ?></p>
				<?php else : ?>
					<?php foreach ( array_reverse( $logs ) as $entry ) : ?>
						<?php 
						$type_class = 'log-' . esc_attr( $entry['type'] );
						$label = strtoupper( $entry['type'] );
						?>
						<div class="terminal-line <?php echo $type_class; ?>">
							<span class="log-timestamp">[<?php echo esc_html( $entry['timestamp'] ); ?>]</span>
							<span class="log-badge badge-<?php echo esc_attr( $entry['type'] ); ?>"><?php echo esc_html( $label ); ?>:</span>
							<span class="log-text"><?php echo esc_html( $entry['message'] ); ?></span>
						</div>
					<?php endforeach; ?>
				<?php endif; ?>
			</div>
		</div>
	</div>
</div>
