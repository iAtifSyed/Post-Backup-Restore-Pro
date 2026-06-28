<?php
/**
 * Settings page template.
 *
 * @package           PostBackupRestorePro
 * @subpackage        PostBackupRestorePro/admin/templates
 * @author            Atif Syed
 */

// Block direct access
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$settings = get_option( 'pbrp_settings', array() );
?>
<div class="wrap pbrp-admin-wrap">
	<h1 class="wp-heading-inline"><?php esc_html_e( 'Plugin Settings', 'post-backup-restore-pro' ); ?></h1>
	<hr class="wp-header-end">

	<div class="pbrp-card settings-panel-card">
		<h2><span class="dashicons dashicons-admin-generic"></span> <?php esc_html_e( 'Configure Post Backup & Restore Pro', 'post-backup-restore-pro' ); ?></h2>
		<p class="description"><?php esc_html_e( 'Adjust performance configurations, ZIP file options, media sideload parameters, and advanced security layers.', 'post-backup-restore-pro' ); ?></p>
		
		<form id="pbrp-settings-form" method="post" action="">
			<table class="form-table" role="presentation">
				<tbody>
					<!-- ZIP Compression -->
					<tr>
						<th scope="row"><label for="pbrp-zip-compression"><?php esc_html_e( 'ZIP Compression Level', 'post-backup-restore-pro' ); ?></label></th>
						<td>
							<select id="pbrp-zip-compression" name="zip_compression">
								<?php for ( $i = 1; $i <= 9; $i++ ) : ?>
									<option value="<?php echo $i; ?>" <?php selected( $settings['zip_compression'] ?? 6, $i ); ?>>
										<?php printf( esc_html__( 'Level %d (Default %s)', 'post-backup-restore-pro' ), $i, ($i === 6 ? '✓' : '') ); ?>
									</option>
								<?php endfor; ?>
							</select>
							<p class="description"><?php esc_html_e( 'Select the compression level for the generated backup ZIP files. Higher levels yield smaller sizes but require more memory and processing.', 'post-backup-restore-pro' ); ?></p>
						</td>
					</tr>

					<!-- Image quality -->
					<tr>
						<th scope="row"><label for="pbrp-image-quality"><?php esc_html_e( 'Sideloaded Image Quality', 'post-backup-restore-pro' ); ?></label></th>
						<td>
							<input type="number" id="pbrp-image-quality" name="image_quality" min="10" max="100" value="<?php echo intval( $settings['image_quality'] ?? 80 ); ?>" class="small-text">
							<span class="unit">%</span>
							<p class="description"><?php esc_html_e( 'Define the compression quality (10 - 100) when sideloading image attachments into the library.', 'post-backup-restore-pro' ); ?></p>
						</td>
					</tr>

					<!-- Max Execution Time -->
					<tr>
						<th scope="row"><label for="pbrp-max-execution-time"><?php esc_html_e( 'Max Script Duration', 'post-backup-restore-pro' ); ?></label></th>
						<td>
							<input type="number" id="pbrp-max-execution-time" name="max_execution_time" min="30" max="300" value="<?php echo intval( $settings['max_execution_time'] ?? 120 ); ?>" class="regular-text">
							<span class="unit"><?php esc_html_e( 'seconds', 'post-backup-restore-pro' ); ?></span>
							<p class="description"><?php esc_html_e( 'Adjust the maximum PHP execution limit during backup bundling or unzip extraction steps to avoid timeout thresholds.', 'post-backup-restore-pro' ); ?></p>
						</td>
					</tr>

					<!-- Chunk Size -->
					<tr>
						<th scope="row"><label for="pbrp-chunk-size"><?php esc_html_e( 'Batch Chunk Limit', 'post-backup-restore-pro' ); ?></label></th>
						<td>
							<input type="number" id="pbrp-chunk-size" name="chunk_size" min="1" max="100" value="<?php echo intval( $settings['chunk_size'] ?? 10 ); ?>" class="small-text">
							<span class="unit">MB</span>
							<p class="description"><?php esc_html_e( 'Control the maximum batch memory boundary limit of ZIP chunk packaging processes.', 'post-backup-restore-pro' ); ?></p>
						</td>
					</tr>

					<!-- Attributes checkboxes -->
					<tr>
						<th scope="row"><?php esc_html_e( 'Include Metadata Attributes', 'post-backup-restore-pro' ); ?></th>
						<td>
							<fieldset>
								<label for="pbrp-export-comments">
									<input type="checkbox" id="pbrp-export-comments" name="export_comments" value="yes" <?php checked( $settings['export_comments'] ?? 'yes', 'yes' ); ?>>
									<?php esc_html_e( 'Include user discussion comments in output schemas', 'post-backup-restore-pro' ); ?>
								</label>
								<br>
								<label for="pbrp-export-drafts">
									<input type="checkbox" id="pbrp-export-drafts" name="export_drafts" value="yes" <?php checked( $settings['export_drafts'] ?? 'yes', 'yes' ); ?>>
									<?php esc_html_e( 'Include post drafts and scheduled items in search indices', 'post-backup-restore-pro' ); ?>
								</label>
								<br>
								<label for="pbrp-export-revisions">
									<input type="checkbox" id="pbrp-export-revisions" name="export_revisions" value="yes" <?php checked( $settings['export_revisions'] ?? 'no', 'yes' ); ?>>
									<?php esc_html_e( 'Include historical revisions (Warning: raises sizes)', 'post-backup-restore-pro' ); ?>
								</label>
								<br>
								<label for="pbrp-export-attachments">
									<input type="checkbox" id="pbrp-export-attachments" name="export_attachments" value="yes" <?php checked( $settings['export_attachments'] ?? 'yes', 'yes' ); ?>>
									<?php esc_html_e( 'Automatically detect and copy internal image files into ZIP', 'post-backup-restore-pro' ); ?>
								</label>
							</fieldset>
						</td>
					</tr>

					<!-- AES Encryption -->
					<tr>
						<th scope="row"><label for="pbrp-aes-encryption"><?php esc_html_e( 'ZIP Encryption', 'post-backup-restore-pro' ); ?></label></th>
						<td>
							<select id="pbrp-aes-encryption" name="aes_encryption">
								<option value="no" <?php selected( $settings['aes_encryption'] ?? 'no', 'no' ); ?>><?php esc_html_e( 'Disabled (Standard readable ZIP)', 'post-backup-restore-pro' ); ?></option>
								<option value="yes" <?php selected( $settings['aes_encryption'] ?? 'no', 'yes' ); ?>><?php esc_html_e( 'AES-256 Bit Encryption (Password Protected)', 'post-backup-restore-pro' ); ?></option>
							</select>
							<div id="encryption-password-field" style="margin-top: 10px; <?php echo ( ($settings['aes_encryption'] ?? 'no') === 'yes' ) ? '' : 'display:none;'; ?>">
								<input type="password" id="pbrp-encryption-key" name="encryption_key" value="<?php echo esc_attr( $settings['encryption_key'] ?? '' ); ?>" class="regular-text" placeholder="<?php esc_attr_e( 'Enter secure ZIP password...', 'post-backup-restore-pro' ); ?>">
							</div>
						</td>
					</tr>

					<!-- Backup Exclusions -->
					<tr>
						<th scope="row"><?php esc_html_e( 'Space-Saving Exclusions', 'post-backup-restore-pro' ); ?></th>
						<td>
							<fieldset>
								<p>
									<label for="pbrp-exclude-extensions"><strong><?php esc_html_e( 'Exclude File Extensions:', 'post-backup-restore-pro' ); ?></strong></label><br>
									<input type="text" id="pbrp-exclude-extensions" name="exclude_extensions" value="<?php echo esc_attr( isset($settings['exclude_extensions']) ? implode(', ', (array) $settings['exclude_extensions']) : '.mp4, .zip, .tar.gz, .log' ); ?>" class="regular-text">
									<br><span class="description"><?php esc_html_e( 'Comma-separated list of extensions to skip (e.g. .mp4, .zip, .log).', 'post-backup-restore-pro' ); ?></span>
								</p>
								<p style="margin-top: 12px;">
									<label for="pbrp-exclude-folders"><strong><?php esc_html_e( 'Exclude Folder Directories:', 'post-backup-restore-pro' ); ?></strong></label><br>
									<input type="text" id="pbrp-exclude-folders" name="exclude_folders" value="<?php echo esc_attr( isset($settings['exclude_folders']) ? implode(', ', (array) $settings['exclude_folders']) : 'wp-content/cache, wp-content/uploads/tmp' ); ?>" class="regular-text">
									<br><span class="description"><?php esc_html_e( 'Comma-separated list of folders relative to root to skip from compile (e.g. wp-content/cache).', 'post-backup-restore-pro' ); ?></span>
								</p>
							</fieldset>
						</td>
					</tr>

					<!-- Automated Backup Scheduling -->
					<tr>
						<th scope="row"><?php esc_html_e( 'Automated Backup Scheduling', 'post-backup-restore-pro' ); ?></th>
						<td>
							<fieldset>
								<label for="pbrp-schedule-enabled">
									<input type="checkbox" id="pbrp-schedule-enabled" name="schedule_enabled" value="yes" <?php checked( $settings['schedule_enabled'] ?? 'no', 'yes' ); ?>>
									<strong><?php esc_html_e( 'Enable Automated Scheduled Backups', 'post-backup-restore-pro' ); ?></strong>
								</label>
								
								<div id="pbrp-schedule-options-panel" style="margin-top: 12px; padding-left: 20px; border-left: 3px solid #2271b1; <?php echo ( ($settings['schedule_enabled'] ?? 'no') === 'yes' ) ? '' : 'display:none;'; ?>">
									<p>
										<label for="pbrp-schedule-interval"><strong><?php esc_html_e( 'Backup Frequency Interval:', 'post-backup-restore-pro' ); ?></strong></label><br>
										<select id="pbrp-schedule-interval" name="schedule_interval">
											<option value="daily" <?php selected( $settings['schedule_interval'] ?? 'weekly', 'daily' ); ?>><?php esc_html_e( 'Daily (Runs every midnight)', 'post-backup-restore-pro' ); ?></option>
											<option value="weekly" <?php selected( $settings['schedule_interval'] ?? 'weekly', 'weekly' ); ?>><?php esc_html_e( 'Weekly (Runs Sunday at 00:00)', 'post-backup-restore-pro' ); ?></option>
											<option value="monthly" <?php selected( $settings['schedule_interval'] ?? 'weekly', 'monthly' ); ?>><?php esc_html_e( 'Monthly (Runs 1st day of month)', 'post-backup-restore-pro' ); ?></option>
										</select>
									</p>
									<p style="margin-top: 10px;">
										<label for="pbrp-schedule-retention"><strong><?php esc_html_e( 'Local Storage Retention Limit:', 'post-backup-restore-pro' ); ?></strong></label><br>
										<input type="number" id="pbrp-schedule-retention" name="schedule_retention_limit" min="1" max="50" value="<?php echo intval( $settings['schedule_retention_limit'] ?? 10 ); ?>" class="small-text">
										<span class="unit"><?php esc_html_e( 'backups', 'post-backup-restore-pro' ); ?></span>
										<br><span class="description"><?php esc_html_e( 'The maximum number of past automated ZIP backups to retain in local storage before automatically purging the oldest packages.', 'post-backup-restore-pro' ); ?></span>
									</p>
								</div>
							</fieldset>
							
							<script type="text/javascript">
								jQuery(document).ready(function($) {
									$('#pbrp-schedule-enabled').on('change', function() {
										if ($(this).is(':checked')) {
											$('#pbrp-schedule-options-panel').slideDown(200);
										} else {
											$('#pbrp-schedule-options-panel').slideUp(200);
										}
									});
								});
							</script>
						</td>
					</tr>
				</tbody>
			</table>

			<p class="submit">
				<button type="submit" name="submit" id="pbrp-btn-save-settings" class="button button-primary button-large"><?php esc_html_e( 'Save Settings', 'post-backup-restore-pro' ); ?></button>
			</p>
		</form>
	</div>
</div>
