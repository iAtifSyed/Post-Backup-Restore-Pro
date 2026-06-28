<?php
/**
 * Fired when the plugin is uninstalled.
 *
 * This file contains cleanup queries and removes options saved by the plugin.
 *
 * @package           PostBackupRestorePro
 * @author            Atif Syed
 */

// If uninstall not called from WordPress, exit.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

// Clean up options from the wp_options database table.
delete_option( 'pbrp_settings' );
delete_option( 'pbrp_logs' );
delete_option( 'pbrp_backup_history' );

// Clear any scheduled cron events for auto-backup
wp_clear_scheduled_hook( 'pbrp_scheduled_backup_event' );

// Clean up temporary files created by the plugin.
$upload_dir = wp_upload_dir();
$pbrp_dir   = path_join( $upload_dir['basedir'], 'pbrp-backups' );

if ( is_dir( $pbrp_dir ) ) {
	// Recursively delete the directory and its files safely.
	$files = new RecursiveIteratorIterator(
		new RecursiveDirectoryIterator( $pbrp_dir, RecursiveDirectoryIterator::SKIP_DOTS ),
		RecursiveIteratorIterator::CHILD_FIRST
	);

	foreach ( $files as $fileinfo ) {
		$todo = ( $fileinfo->isDir() ? 'rmdir' : 'unlink' );
		@$todo( $fileinfo->getRealPath() );
	}
	@rmdir( $pbrp_dir );
}
