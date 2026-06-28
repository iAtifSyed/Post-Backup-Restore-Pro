<?php
/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @package           PostBackupRestorePro
 * @subpackage        PostBackupRestorePro/includes
 * @author            Atif Syed
 */

namespace PostBackupRestorePro\Includes;

class PBRP_Activator {

	/**
	 * Run on plugin activation
	 */
	public static function activate() {
		// Set up default settings if not already defined.
		if ( ! get_option( 'pbrp_settings' ) ) {
			$defaults = array(
				'zip_compression'    => 6, // 1-9 level
				'image_quality'      => 80, // 1-100 level
				'max_execution_time' => 120, // seconds
				'chunk_size'         => 10, // MB
				'export_comments'    => 'yes',
				'export_drafts'      => 'yes',
				'export_revisions'   => 'no',
				'export_attachments' => 'yes',
				'aes_encryption'     => 'no',
				'encryption_key'     => '',
			);
			update_option( 'pbrp_settings', $defaults );
		}

		// Set up default blank log registry
		if ( ! get_option( 'pbrp_logs' ) ) {
			update_option( 'pbrp_logs', array() );
		}

		// Set up default blank backup history
		if ( ! get_option( 'pbrp_backup_history' ) ) {
			update_option( 'pbrp_backup_history', array() );
		}

		// Create the backups folder securely in the WordPress Uploads folder.
		$upload_dir = wp_upload_dir();
		$pbrp_dir   = path_join( $upload_dir['basedir'], 'pbrp-backups' );

		if ( ! file_exists( $pbrp_dir ) ) {
			wp_mkdir_p( $pbrp_dir );
		}

		// Put a secure .htaccess and index.php in the backups directory to block direct directory listing.
		$htaccess_file = path_join( $pbrp_dir, '.htaccess' );
		if ( ! file_exists( $htaccess_file ) ) {
			$rules = "Deny from all\nOptions -Indexes";
			@file_put_contents( $htaccess_file, $rules );
		}

		$index_file = path_join( $pbrp_dir, 'index.php' );
		if ( ! file_exists( $index_file ) ) {
			@file_put_contents( $index_file, "<?php\n// Silence is golden." );
		}
	}
}
