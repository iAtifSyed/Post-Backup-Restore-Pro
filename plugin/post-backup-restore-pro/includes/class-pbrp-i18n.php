<?php
/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @package           PostBackupRestorePro
 * @subpackage        PostBackupRestorePro/includes
 * @author            Atif Syed
 */

namespace PostBackupRestorePro\Includes;

class PBRP_i18n {

	/**
	 * Load the plugin text domain for translation.
	 */
	public function load_plugin_textdomain() {
		load_plugin_textdomain(
			'post-backup-restore-pro',
			false,
			dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages/'
		);
	}
}
