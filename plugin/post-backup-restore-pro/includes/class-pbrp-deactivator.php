<?php
/**
 * Fired during plugin deactivation.
 *
 * This class defines all code necessary to run during the plugin's deactivation.
 *
 * @package           PostBackupRestorePro
 * @subpackage        PostBackupRestorePro/includes
 * @author            Atif Syed
 */

namespace PostBackupRestorePro\Includes;

class PBRP_Deactivator {

	/**
	 * Run on plugin deactivation
	 */
	public static function deactivate() {
		// Clear cron jobs, temporary session transients, or caches.
		wp_clear_scheduled_hook( 'pbrp_scheduled_backup_event' );
	}
}
