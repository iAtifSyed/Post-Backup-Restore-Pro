<?php
/**
 * Media Integration and Attachment Handler.
 *
 * Sniffs inline and featured images from post markup, tracks absolute local filepaths,
 * and sideloads images into the WordPress uploads folder and Media Library during restore.
 *
 * @package           PostBackupRestorePro
 * @subpackage        PostBackupRestorePro/classes
 * @author            Atif Syed
 */

namespace PostBackupRestorePro\Classes;

use PostBackupRestorePro\Includes\PBRP_Logger;

class PBRP_Media_Handler {

	/**
	 * Scan post content and thumbnail, aggregating all linked images
	 *
	 * @param int $post_id The post ID
	 * @return array Multi-dimensional array of image filenames, original urls, and absolute paths
	 */
	public function sniff_post_images( $post_id ) {
		$images = array();
		$post   = get_post( $post_id );

		if ( ! $post ) {
			return $images;
		}

		// 1. Sniff Featured Image
		$featured_image_id = get_post_thumbnail_id( $post_id );
		if ( $featured_image_id ) {
			$this->append_image_meta( $featured_image_id, $images );
		}

		// 2. Sniff inline images from content
		$content = $post->post_content;

		// Regex pattern to extract src URLs from standard HTML image tags
		preg_match_all( '/<img[^>]+src=[\'"]([^\'"]+)[\'"]/i', $content, $matches );
		
		if ( ! empty( $matches[1] ) ) {
			$upload_dir = wp_upload_dir();
			$base_url   = $upload_dir['baseurl'];
			$base_dir   = $upload_dir['basedir'];

			foreach ( $matches[1] as $img_url ) {
				// We only back up images hosted on this local site
				if ( strpos( $img_url, $base_url ) !== false ) {
					// Translate attachment URL to physical server directory path
					$rel_path  = str_replace( $base_url, '', $img_url );
					$file_path = path_join( $base_dir, $rel_path );

					if ( file_exists( $file_path ) ) {
						$filename = basename( $file_path );
						$images[ $img_url ] = array(
							'filename'     => $filename,
							'original_url' => $img_url,
							'file_path'    => $file_path
						);
					}
				}
			}
		}

		return array_values( $images );
	}

	/**
	 * Helper function to retrieve attachment paths and append them to list
	 */
	private function append_image_meta( $attachment_id, &$images ) {
		$file_path = get_attached_file( $attachment_id );
		if ( $file_path && file_exists( $file_path ) ) {
			$img_url  = wp_get_attachment_url( $attachment_id );
			$filename = basename( $file_path );
			
			$images[ $img_url ] = array(
				'filename'     => $filename,
				'original_url' => $img_url,
				'file_path'    => $file_path
			);
		}
	}

	/**
	 * Sideload an extracted image into the WP Uploads directory and Media Library
	 *
	 * @param string $file_path Absolute path to the extracted image file
	 * @param string $parent_title Post title to use for description/alt
	 * @return int|false Newly created attachment ID or false on failure
	 */
	public function sideload_image( $file_path, $parent_title ) {
		if ( ! file_exists( $file_path ) ) {
			return false;
		}

		$filename = basename( $file_path );
		$upload_dir = wp_upload_dir();

		// Create year/month subdirectories natively
		$target_folder = path_join( $upload_dir['basedir'], current_time( 'Y/m' ) );
		if ( ! file_exists( $target_folder ) ) {
			wp_mkdir_p( $target_folder );
		}

		// Ensure unique filename in target folder
		$target_file_name = wp_unique_filename( $target_folder, $filename );
		$target_file_path = path_join( $target_folder, $target_file_name );

		// Copy file to active upload folder
		if ( ! @copy( $file_path, $target_file_path ) ) {
			PBRP_Logger::log( 'Media Sideload failed: Unable to copy ' . $filename . ' to uploads folder.', 'warning' );
			return false;
		}

		// Detect file type
		$filetype = wp_check_filetype( $target_file_name, null );

		// Assemble attachment record data
		$attachment = array(
			'guid'           => $upload_dir['url'] . '/' . _wp_relative_upload_path( $target_file_path ),
			'post_mime_type' => $filetype['type'],
			'post_title'     => preg_replace( '/\.[^.]+$/', '', $target_file_name ),
			'post_content'   => '',
			'post_status'    => 'inherit'
		);

		// Insert the attachment record
		$attach_id = wp_insert_attachment( $attachment, $target_file_path );

		if ( is_wp_error( $attach_id ) ) {
			PBRP_Logger::log( 'Media Sideload failed: DB insert error for ' . $target_file_name, 'warning' );
			return false;
		}

		// Generate attachment metadata (image sizes, thumbnails)
		require_once ABSPATH . 'wp-admin/includes/image.php';
		$attach_data = wp_generate_attachment_metadata( $attach_id, $target_file_path );
		wp_update_attachment_metadata( $attach_id, $attach_data );

		// Add Alt Text tag
		update_post_meta( $attach_id, '_wp_attachment_image_alt', sanitize_text_field( $parent_title ) );

		return $attach_id;
	}
}
