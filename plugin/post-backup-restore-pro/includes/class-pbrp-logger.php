<?php
/**
 * Logger Class for storing and displaying plugin activities.
 *
 * @package           PostBackupRestorePro
 * @subpackage        PostBackupRestorePro/includes
 * @author            Atif Syed
 */

namespace PostBackupRestorePro\Includes;

class PBRP_Logger {

	/**
	 * Log a message with a specific level.
	 */
	public static function log( $message, $type = 'info', $context = array() ) {
		$logs = get_option( 'pbrp_logs', array() );

		// Cap logs at 500 entries to prevent database bloating.
		if ( count( $logs ) >= 500 ) {
			array_shift( $logs );
		}

		$log_entry = array(
			'timestamp' => current_time( 'mysql' ),
			'type'      => sanitize_text_field( $type ),
			'message'   => sanitize_text_field( $message ),
			'context'   => self::sanitize_context( $context )
		);

		$logs[] = $log_entry;
		update_option( 'pbrp_logs', $logs );
	}

	/**
	 * Log a successful backup with summary metrics.
	 */
	public static function log_backup( $zip_name, $posts_count, $images_count, $size, $duration ) {
		$history = get_option( 'pbrp_backup_history', array() );

		// Cap history at 100 entries.
		if ( count( $history ) >= 100 ) {
			array_shift( $history );
		}

		$history[] = array(
			'timestamp'    => current_time( 'mysql' ),
			'zip_name'     => sanitize_text_field( $zip_name ),
			'posts_count'  => intval( $posts_count ),
			'images_count' => intval( $images_count ),
			'size'         => sanitize_text_field( $size ),
			'duration'     => sanitize_text_field( $duration ),
			'status'       => 'success'
		);

		update_option( 'pbrp_backup_history', $history );

		self::log(
			sprintf(
				'Backup generated successfully: %s (%d posts, %d images, Size: %s, Duration: %s)',
				$zip_name,
				$posts_count,
				$images_count,
				$size,
				$duration
			),
			'success'
		);
	}

	/**
	 * Retrieve all saved logs.
	 */
	public static function get_logs() {
		return get_option( 'pbrp_logs', array() );
	}

	/**
	 * Retrieve all saved backup history.
	 */
	public static function get_history() {
		return get_option( 'pbrp_backup_history', array() );
	}

	/**
	 * Clear all logs and history.
	 */
	public static function clear() {
		update_option( 'pbrp_logs', array() );
		self::log( 'Logs cleared successfully.', 'info' );
	}

	/**
	 * Sanitize context array before storing.
	 */
	private static function sanitize_context( $context ) {
		if ( ! is_array( $context ) ) {
			return array();
		}

		$clean = array();
		foreach ( $context as $key => $val ) {
			if ( is_scalar( $val ) ) {
				$clean[ sanitize_key( $key ) ] = sanitize_text_field( $val );
			}
		}
		return $clean;
	}
}
