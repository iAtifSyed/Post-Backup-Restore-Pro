<?php
/**
 * Developer and About page template.
 *
 * @package           PostBackupRestorePro
 * @subpackage        PostBackupRestorePro/admin/templates
 * @author            Atif Syed
 */

// Block direct access
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<div class="wrap pbrp-admin-wrap">
	<h1 class="wp-heading-inline"><?php esc_html_e( 'About Atif Syed', 'post-backup-restore-pro' ); ?></h1>
	<hr class="wp-header-end">

	<div class="pbrp-developer-profile-container">
		<!-- Main Profile Details Column -->
		<div class="pbrp-card developer-bio-card">
			<div class="developer-header-row">
				<div class="dev-avatar-placeholder">
					<span class="dashicons dashicons-businessman"></span>
				</div>
				<div class="dev-meta">
					<h2><?php esc_html_e( 'Atif Syed', 'post-backup-restore-pro' ); ?></h2>
					<p class="tagline"><?php esc_html_e( 'Senior WordPress Plugin Architect & Security Engineer', 'post-backup-restore-pro' ); ?></p>
					<div class="contact-badges">
						<span class="pbrp-badge badge-info"><span class="dashicons dashicons-phone"></span> +92-300-4860591</span>
						<span class="pbrp-badge badge-info"><span class="dashicons dashicons-email"></span> atifsyedlive@gmail.com</span>
					</div>
				</div>
			</div>

			<div class="bio-body-text">
				<p><?php esc_html_e( 'With over a decade of core WordPress, full-stack, and security engineering experience, Atif Syed is committed to writing secure, highly performant, and beginner-friendly WordPress tools.', 'post-backup-restore-pro' ); ?></p>
				<p><?php esc_html_e( 'Post Backup & Restore Pro was designed with one specific focus: eliminating the over-engineering, sluggish performance, and safety vulnerabilities characteristic of general-purpose site migration tools. By zooming in specifically on post entries, content tags, categories, internal links, and inline media attachments, it gets the job done securely and instantly.', 'post-backup-restore-pro' ); ?></p>
			</div>

			<div class="dev-link-buttons-row">
				<a href="http://iatifsyed.github.io/" class="button button-primary button-large" target="_blank" rel="noopener noreferrer">
					<span class="dashicons dashicons-admin-home"></span> <?php esc_html_e( 'Developer Website', 'post-backup-restore-pro' ); ?>
				</a>
				<a href="http://github.com/iatifsyed" class="button button-secondary button-large" target="_blank" rel="noopener noreferrer">
					<span class="dashicons dashicons-networking"></span> <?php esc_html_e( 'GitHub Profile', 'post-backup-restore-pro' ); ?>
				</a>
			</div>
		</div>

		<!-- Support / License details sidebar -->
		<div class="developer-sidebar-container">
			<div class="pbrp-card license-details-card">
				<h3><?php esc_html_e( 'Plugin Metadata', 'post-backup-restore-pro' ); ?></h3>
				<table class="pbrp-info-table">
					<tbody>
						<tr>
							<td><strong><?php esc_html_e( 'Plugin Name:', 'post-backup-restore-pro' ); ?></strong></td>
							<td><?php esc_html_e( 'Post Backup & Restore Pro', 'post-backup-restore-pro' ); ?></td>
						</tr>
						<tr>
							<td><strong><?php esc_html_e( 'Active Version:', 'post-backup-restore-pro' ); ?></strong></td>
							<td><?php echo esc_html( PBRP_VERSION ); ?></td>
						</tr>
						<tr>
							<td><strong><?php esc_html_e( 'License:', 'post-backup-restore-pro' ); ?></strong></td>
							<td><?php esc_html_e( 'GPL v2 or later', 'post-backup-restore-pro' ); ?></td>
						</tr>
						<tr>
							<td><strong><?php esc_html_e( 'Text Domain:', 'post-backup-restore-pro' ); ?></strong></td>
							<td><code>post-backup-restore-pro</code></td>
						</tr>
					</tbody>
				</table>
			</div>

			<div class="pbrp-card donate-card">
				<h3><span class="dashicons dashicons-heart"></span> <?php esc_html_e( 'Support My Open Source Work', 'post-backup-restore-pro' ); ?></h3>
				<p><?php esc_html_e( 'If this plugin saved your time or helped your clients migrate their content successfully, consider buying me a coffee! It fuels future developments and supports free open-source releases.', 'post-backup-restore-pro' ); ?></p>
				<a href="https://github.com/sponsors/iatifsyed" class="button pbrp-donate-button button-large" target="_blank" rel="noopener noreferrer">
					<span class="dashicons dashicons-heart"></span> <?php esc_html_e( 'Donate via GitHub Sponsors', 'post-backup-restore-pro' ); ?>
				</a>
			</div>
		</div>
	</div>
</div>
