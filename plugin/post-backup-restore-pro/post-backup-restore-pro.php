<?php
/**
 * Plugin Name:       Post Backup & Restore Pro
 * Plugin URI:        https://github.com/iatifsyed
 * Description:       Export selected WordPress posts, media, and SEO metadata into a single secure ZIP file and restore them perfectly on another site.
 * Version:           1.0.0
 * Author:            Atif Syed
 * Author URI:        http://iatifsyed.github.io/
 * License:           GPLv2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       post-backup-restore-pro
 * Domain Path:       /languages
 * Requires at least: 6.3
 * Requires PHP:      8.0
 *
 * @package           PostBackupRestorePro
 * @author            Atif Syed
 * @license           GPL-2.0+
 */

// Prevent direct file access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Define plugin-wide constants.
define( 'PBRP_VERSION', '1.0.0' );
define( 'PBRP_PLUGIN_FILE', __FILE__ );
define( 'PBRP_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'PBRP_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

/**
 * Custom Autoloader for Post Backup & Restore Pro (PSR-4 compliant)
 */
spl_autoload_register( function ( $class ) {
	// Project-specific namespace prefix.
	$prefix = 'PostBackupRestorePro\\';

	// Base directory for the namespace prefix.
	$base_dir = PBRP_PLUGIN_DIR;

	// Does the class use the namespace prefix?
	$len = strlen( $prefix );
	if ( strncmp( $prefix, $class, $len ) !== 0 ) {
		return;
	}

	// Get the relative class name.
	$relative_class = substr( $class, $len );

	// Replace namespace separators with directory separators in the relative
	// class name, prepend with the base directory, and append with .php.
	$parts = explode( '\\', $relative_class );
	$class_name = array_pop( $parts );
	
	// Reconstruct the directory path
	$sub_dir = '';
	if ( ! empty( $parts ) ) {
		$sub_dir = strtolower( implode( '/', $parts ) ) . '/';
	}
	
	// Strip "PBRP_" prefix if present to avoid double prefixing (e.g. class-pbrp-pbrp-loader.php)
	$clean_class_name = $class_name;
	if ( strncasecmp( $class_name, 'PBRP_', 5 ) === 0 ) {
		$clean_class_name = substr( $class_name, 5 );
	}

	// WordPress naming convention: class-pbrp-filename-slug.php
	$wp_filename = 'class-pbrp-' . strtolower( str_replace( '_', '-', $clean_class_name ) ) . '.php';
	
	// We check standard PSR-4 naming, and fallback to WordPress naming convention
	$file_psr4 = rtrim( $base_dir, '/' ) . '/' . $sub_dir . $class_name . '.php';
	
	// Check standard includes and classes folders
	$file_wp_classes = rtrim( $base_dir, '/' ) . '/classes/' . $wp_filename;
	$file_wp_includes = rtrim( $base_dir, '/' ) . '/includes/' . $wp_filename;

	if ( file_exists( $file_psr4 ) ) {
		require_once $file_psr4;
	} elseif ( file_exists( $file_wp_classes ) ) {
		require_once $file_wp_classes;
	} elseif ( file_exists( $file_wp_includes ) ) {
		require_once $file_wp_includes;
	}
} );

/**
 * Register Activation and Deactivation Hooks
 */
function activate_pbrp() {
	require_once PBRP_PLUGIN_DIR . 'includes/class-pbrp-activator.php';
	PostBackupRestorePro\Includes\PBRP_Activator::activate();
}

function deactivate_pbrp() {
	require_once PBRP_PLUGIN_DIR . 'includes/class-pbrp-deactivator.php';
	PostBackupRestorePro\Includes\PBRP_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_pbrp' );
register_deactivation_hook( __FILE__, 'deactivate_pbrp' );

/**
 * Core Plugin Initialization Class
 */
if ( ! class_exists( 'Post_Backup_Restore_Pro_Core' ) ) {
class Post_Backup_Restore_Pro_Core {

	/**
	 * Loader instance to manage all actions and filters.
	 */
	protected $loader;

	/**
	 * Initialize the core.
	 */
	public function __construct() {
		$this->load_dependencies();
		$this->set_locale();
		$this->define_admin_hooks();
	}

	/**
	 * Load core dependency files.
	 */
	private function load_dependencies() {
		// Main hook registry and orchestrator.
		$this->loader = new PostBackupRestorePro\Includes\PBRP_Loader();
	}

	/**
	 * Set the localization locale.
	 */
	private function set_locale() {
		$plugin_i18n = new PostBackupRestorePro\Includes\PBRP_i18n();
		$this->loader->add_action( 'plugins_loaded', $plugin_i18n, 'load_plugin_textdomain' );
	}

	/**
	 * Define admin pages and AJAX endpoints.
	 */
	private function define_admin_hooks() {
		$ajax_handlers = new PostBackupRestorePro\Classes\PBRP_Ajax_Handlers();
		
		// AJAX Actions
		$this->loader->add_action( 'wp_ajax_pbrp_get_posts', $ajax_handlers, 'ajax_get_posts' );
		$this->loader->add_action( 'wp_ajax_pbrp_start_export', $ajax_handlers, 'ajax_start_export' );
		$this->loader->add_action( 'wp_ajax_pbrp_process_export_batch', $ajax_handlers, 'ajax_process_export_batch' );
		$this->loader->add_action( 'wp_ajax_pbrp_finalize_export', $ajax_handlers, 'ajax_finalize_export' );
		$this->loader->add_action( 'wp_ajax_pbrp_preview_import', $ajax_handlers, 'ajax_preview_import' );
		$this->loader->add_action( 'wp_ajax_pbrp_execute_restore', $ajax_handlers, 'ajax_execute_restore' );
		$this->loader->add_action( 'wp_ajax_pbrp_save_settings', $ajax_handlers, 'ajax_save_settings' );
		$this->loader->add_action( 'wp_ajax_pbrp_clear_logs', $ajax_handlers, 'ajax_clear_logs' );
		
		// Admin Menu and Styles
		$this->loader->add_action( 'admin_menu', $this, 'add_admin_menu' );
		$this->loader->add_action( 'admin_enqueue_scripts', $this, 'enqueue_admin_assets' );
	}

	/**
	 * Register Admin Menu Options
	 */
	public function add_admin_menu() {
		add_menu_page(
			esc_html__( 'Post Backup & Restore Pro', 'post-backup-restore-pro' ),
			esc_html__( 'Post Backup & Restore', 'post-backup-restore-pro' ),
			'manage_options',
			'post-backup-restore-pro',
			array( $this, 'render_admin_dashboard' ),
			'dashicons-backup',
			78
		);

		add_submenu_page(
			'post-backup-restore-pro',
			esc_html__( 'Dashboard', 'post-backup-restore-pro' ),
			esc_html__( 'Dashboard', 'post-backup-restore-pro' ),
			'manage_options',
			'post-backup-restore-pro',
			array( $this, 'render_admin_dashboard' )
		);

		add_submenu_page(
			'post-backup-restore-pro',
			esc_html__( 'Export Posts', 'post-backup-restore-pro' ),
			esc_html__( 'Export Posts', 'post-backup-restore-pro' ),
			'manage_options',
			'pbrp-export',
			array( $this, 'render_export_page' )
		);

		add_submenu_page(
			'post-backup-restore-pro',
			esc_html__( 'Import Posts', 'post-backup-restore-pro' ),
			esc_html__( 'Import Posts', 'post-backup-restore-pro' ),
			'manage_options',
			'pbrp-import',
			array( $this, 'render_import_page' )
		);

		add_submenu_page(
			'post-backup-restore-pro',
			esc_html__( 'Settings', 'post-backup-restore-pro' ),
			esc_html__( 'Settings', 'post-backup-restore-pro' ),
			'manage_options',
			'pbrp-settings',
			array( $this, 'render_settings_page' )
		);

		add_submenu_page(
			'post-backup-restore-pro',
			esc_html__( 'Logs', 'post-backup-restore-pro' ),
			esc_html__( 'Logs', 'post-backup-restore-pro' ),
			'manage_options',
			'pbrp-logs',
			array( $this, 'render_logs_page' )
		);

		add_submenu_page(
			'post-backup-restore-pro',
			esc_html__( 'About Developer', 'post-backup-restore-pro' ),
			esc_html__( 'About Developer', 'post-backup-restore-pro' ),
			'manage_options',
			'pbrp-developer',
			array( $this, 'render_developer_page' )
		);
	}

	/**
	 * Enqueue stylesheet and script files in WP Admin
	 */
	public function enqueue_admin_assets( $hook ) {
		if ( strpos( $hook, 'post-backup-restore-pro' ) === false && strpos( $hook, 'pbrp-' ) === false ) {
			return;
		}

		wp_enqueue_style( 'pbrp-admin-css', PBRP_PLUGIN_URL . 'admin/css/admin.css', array(), PBRP_VERSION );
		wp_enqueue_script( 'pbrp-admin-js', PBRP_PLUGIN_URL . 'admin/js/admin.js', array( 'jquery' ), PBRP_VERSION, true );

		// Localize script to securely pass variables and Nonces to JavaScript
		wp_localize_script( 'pbrp-admin-js', 'pbrp_vars', array(
			'ajax_url' => admin_url( 'admin-ajax.php' ),
			'nonce'    => wp_create_nonce( 'pbrp_security_nonce' ),
			'strings'  => array(
				'confirm_clear'  => esc_html__( 'Are you sure you want to clear all logs?', 'post-backup-restore-pro' ),
				'starting'       => esc_html__( 'Initializing backup process...', 'post-backup-restore-pro' ),
				'processing'     => esc_html__( 'Processing batch {current} of {total}...', 'post-backup-restore-pro' ),
				'compressing'    => esc_html__( 'Compressing images and creating ZIP...', 'post-backup-restore-pro' ),
				'completed'      => esc_html__( 'Process completed successfully!', 'post-backup-restore-pro' ),
				'error'          => esc_html__( 'An error occurred. Check logs for details.', 'post-backup-restore-pro' ),
				'invalid_zip'    => esc_html__( 'Please select or drop a valid backup ZIP file.', 'post-backup-restore-pro' ),
				'import_loading' => esc_html__( 'Analyzing backup file. Please wait...', 'post-backup-restore-pro' ),
			)
		) );
	}

	/**
	 * Render views using external template files.
	 */
	public function render_admin_dashboard() {
		include PBRP_PLUGIN_DIR . 'admin/templates/dashboard.php';
	}

	public function render_export_page() {
		include PBRP_PLUGIN_DIR . 'admin/templates/export.php';
	}

	public function render_import_page() {
		include PBRP_PLUGIN_DIR . 'admin/templates/import.php';
	}

	public function render_settings_page() {
		include PBRP_PLUGIN_DIR . 'admin/templates/settings.php';
	}

	public function render_logs_page() {
		include PBRP_PLUGIN_DIR . 'admin/templates/logs.php';
	}

	public function render_developer_page() {
		include PBRP_PLUGIN_DIR . 'admin/templates/developer.php';
	}

	/**
	 * Execute the loader orchestration
	 */
	public function run() {
		$this->loader->run();
	}
}
}

/**
 * Instantiate the Core Plugin
 */
if ( ! function_exists( 'run_post_backup_restore_pro' ) ) {
function run_post_backup_restore_pro() {
	$plugin = new Post_Backup_Restore_Pro_Core();
	$plugin->run();
}
}
run_post_backup_restore_pro();
