<?php
/**
 * Main Restore and Import Engine.
 *
 * Safe ZIP Extraction, Zip Slip validation, metadata parsing,
 * duplicate comparison, image importing, and site reconstruction.
 *
 * @package           PostBackupRestorePro
 * @subpackage        PostBackupRestorePro/classes
 * @author            Atif Syed
 */

namespace PostBackupRestorePro\Classes;

use PostBackupRestorePro\Includes\PBRP_Logger;

class PBRP_Restore_Engine {

	/**
	 * Configured settings
	 */
	protected $settings;

	/**
	 * Constructor. Load settings.
	 */
	public function __construct() {
		$this->settings = get_option( 'pbrp_settings', array() );
	}

	/**
	 * Run analysis on an uploaded ZIP file before proceeding with the actual import.
	 *
	 * @param string $zip_file_path Absolute path to the uploaded ZIP file
	 * @return array|false Metadata summary of the ZIP contents, or false on error
	 */
	public function preview_backup( $zip_file_path ) {
		if ( ! file_exists( $zip_file_path ) ) {
			PBRP_Logger::log( 'Restore preview failed: Target ZIP does not exist.', 'error' );
			return false;
		}

		$zip = new \ZipArchive();
		if ( $zip->open( $zip_file_path ) !== true ) {
			PBRP_Logger::log( 'Restore preview failed: Unable to open ZIP file.', 'error' );
			return false;
		}

		// Read version.json and metadata/posts.json directly from the ZIP
		$version_content = $zip->getFromName( 'version.json' );
		$posts_content   = $zip->getFromName( 'metadata/posts.json' );
		$zip->close();

		if ( ! $posts_content ) {
			PBRP_Logger::log( 'Restore preview failed: ZIP lacks crucial metadata/posts.json schema.', 'error' );
			return false;
		}

		$posts_data   = json_decode( $posts_content, true );
		$version_data = $version_content ? json_decode( $version_content, true ) : array();

		if ( ! is_array( $posts_data ) ) {
			PBRP_Logger::log( 'Restore preview failed: Invalid metadata format in ZIP.', 'error' );
			return false;
		}

		// Calculate overview variables
		$authors    = array();
		$categories = array();
		$tags       = array();
		$images_count = 0;

		foreach ( $posts_data as $post ) {
			if ( ! empty( $post['Author'] ) ) {
				$authors[] = $post['Author'];
			}
			if ( ! empty( $post['Categories'] ) && is_array( $post['Categories'] ) ) {
				$categories = array_merge( $categories, $post['Categories'] );
			}
			if ( ! empty( $post['Tags'] ) && is_array( $post['Tags'] ) ) {
				$tags = array_merge( $tags, $post['Tags'] );
			}
			if ( ! empty( $post['Gallery Images'] ) && is_array( $post['Gallery Images'] ) ) {
				$images_count += count( $post['Gallery Images'] );
			}
		}

		return array(
			'posts_count'  => count( $posts_data ),
			'images_count' => $images_count,
			'categories'   => array_values( array_unique( $categories ) ),
			'tags'         => array_values( array_unique( $tags ) ),
			'authors'      => array_values( array_unique( $authors ) ),
			'version'      => ! empty( $version_data['plugin_version'] ) ? $version_data['plugin_version'] : '1.0.0',
			'export_date'  => ! empty( $version_data['export_date'] ) ? $version_data['export_date'] : 'Unknown'
		);
	}

	/**
	 * Run the full restore operation
	 *
	 * @param string $zip_file_path Path to uploaded zip file
	 * @param string $duplicate_strategy 'skip', 'replace', or 'rename'
	 * @param string $import_strategy 'all', 'new_only', 'content_only', 'images_only'
	 * @return array|false Stats about the completed restore, or false on error
	 */
	public function execute_restore( $zip_file_path, $duplicate_strategy = 'skip', $import_strategy = 'all' ) {
		$start_time = microtime( true );
		$upload_dir = wp_upload_dir();
		$temp_dir_name = 'pbrp-import-' . wp_generate_password( 12, false );
		$extract_path   = path_join( $upload_dir['basedir'] . '/pbrp-backups', $temp_dir_name );

		if ( ! wp_mkdir_p( $extract_path ) ) {
			PBRP_Logger::log( 'Restore failed: Unable to create temporary extraction folder.', 'error' );
			return false;
		}

		$zip = new \ZipArchive();
		if ( $zip->open( $zip_file_path ) !== true ) {
			PBRP_Logger::log( 'Restore failed: Unable to open import ZIP file.', 'error' );
			$this->recursive_delete( $extract_path );
			return false;
		}

		// Extract all files with Zip Slip vulnerability validation
		for ( $i = 0; $i < $zip->numFiles; $i++ ) {
			$entry_name = $zip->getNameIndex( $i );

			// Zip Slip Protection: Ensure no directory traversal bypasses
			if ( strpos( $entry_name, '..' ) !== false || strpos( $entry_name, '\\' ) !== false ) {
				PBRP_Logger::log( 'Security Warning: Blocked an attempted Directory Traversal / Zip Slip exploit inside ZIP file: ' . $entry_name . ' (Skipped malicious file safely to protect system integrity)', 'warning' );
				continue;
			}

			$full_extracted_path = path_join( $extract_path, $entry_name );
			
			// Create directory if needed
			if ( '/' === substr( $entry_name, -1 ) ) {
				wp_mkdir_p( $full_extracted_path );
			} else {
				// Create parent directories if they don't exist
				wp_mkdir_p( dirname( $full_extracted_path ) );
				@copy( 'zip://' . $zip_file_path . '#' . $entry_name, $full_extracted_path );
			}
		}
		$zip->close();

		// Read posts.json
		$posts_json_file = path_join( $extract_path . '/metadata', 'posts.json' );
		if ( ! file_exists( $posts_json_file ) ) {
			PBRP_Logger::log( 'Restore failed: posts.json metadata file not found in ZIP archive.', 'error' );
			$this->recursive_delete( $extract_path );
			return false;
		}

		$posts_data = json_decode( file_get_contents( $posts_json_file ), true );
		if ( ! is_array( $posts_data ) ) {
			PBRP_Logger::log( 'Restore failed: posts.json file is corrupted or empty.', 'error' );
			$this->recursive_delete( $extract_path );
			return false;
		}

		$restored_count  = 0;
		$skipped_count   = 0;
		$replaced_count  = 0;
		$imported_images = 0;

		$media_handler = new PBRP_Media_Handler();
		$seo_handler   = new PBRP_SEO_Handler();

		foreach ( $posts_data as $post_meta ) {
			$title = sanitize_text_field( $post_meta['Title'] );
			$slug  = sanitize_title( $post_meta['Slug'] );

			// Check for existing duplicate post
			$existing_post = $this->get_duplicate_post( $slug, $title );
			$post_action   = 'insert';

			if ( $existing_post ) {
				if ( 'skip' === $duplicate_strategy ) {
					$skipped_count++;
					continue;
				} elseif ( 'replace' === $duplicate_strategy ) {
					$post_action = 'update';
				} elseif ( 'rename' === $duplicate_strategy ) {
					$slug = $slug . '-' . wp_generate_password( 4, false );
					$title = $title . ' (Imported)';
					$post_action = 'insert';
				}
			}

			// If we only want to import "new" posts and this exists, skip
			if ( 'new_only' === $import_strategy && $existing_post ) {
				$skipped_count++;
				continue;
			}

			// Sideload Images first if "all" or "images_only"
			$featured_image_id = 0;
			$content_images_map = array();

			if ( 'content_only' !== $import_strategy ) {
				// Sideload Featured Image
				if ( ! empty( $post_meta['Featured Image'] ) ) {
					$fi_basename = basename( $post_meta['Featured Image'] );
					$fi_local_path = path_join( $extract_path . '/images', $fi_basename );
					if ( file_exists( $fi_local_path ) ) {
						$fi_id = $media_handler->sideload_image( $fi_local_path, $title );
						if ( $fi_id ) {
							$featured_image_id = $fi_id;
							$imported_images++;
						}
					}
				}

				// Sideload Gallery / Content Inline Images
				if ( ! empty( $post_meta['Gallery Images'] ) && is_array( $post_meta['Gallery Images'] ) ) {
					foreach ( $post_meta['Gallery Images'] as $g_image ) {
						$gi_basename = $g_image['filename'];
						$gi_local_path = path_join( $extract_path . '/images', $gi_basename );
						if ( file_exists( $gi_local_path ) ) {
							$gi_id = $media_handler->sideload_image( $gi_local_path, $title . ' - Inline Asset' );
							if ( $gi_id ) {
								$content_images_map[ $g_image['original_url'] ] = wp_get_attachment_url( $gi_id );
								$imported_images++;
							}
						}
					}
				}
			}

			// Rewrite inline URLs in content to point to our newly imported media files
			$post_content = $post_meta['Content'];
			if ( ! empty( $content_images_map ) ) {
				foreach ( $content_images_map as $orig_url => $new_url ) {
					$post_content = str_replace( $orig_url, $new_url, $post_content );
				}
			}

			// Assemble post array
			$post_arr = array(
				'post_title'   => $title,
				'post_content' => $post_content,
				'post_excerpt' => sanitize_textarea_field( $post_meta['Excerpt'] ),
				'post_status'  => sanitize_text_field( $post_meta['Status'] ),
				'post_name'    => $slug,
				'post_type'    => 'post',
				'post_date'    => sanitize_text_field( $post_meta['Published Date'] ),
				'post_modified'=> sanitize_text_field( $post_meta['Modified Date'] ),
			);

			if ( 'update' === $post_action ) {
				$post_arr['ID'] = $existing_post->ID;
				$new_post_id = wp_update_post( $post_arr );
				$replaced_count++;
			} else {
				$new_post_id = wp_insert_post( $post_arr );
				$restored_count++;
			}

			if ( is_wp_error( $new_post_id ) ) {
				PBRP_Logger::log( 'Restore error: Failed to insert/update post: ' . $title, 'warning' );
				continue;
			}

			// Apply terms: Categories and Tags
			if ( ! empty( $post_meta['Categories'] ) && is_array( $post_meta['Categories'] ) ) {
				wp_set_object_terms( $new_post_id, $post_meta['Categories'], 'category' );
			}
			if ( ! empty( $post_meta['Tags'] ) && is_array( $post_meta['Tags'] ) ) {
				wp_set_object_terms( $new_post_id, $post_meta['Tags'], 'post_tag' );
			}

			// Attach Featured Image
			if ( $featured_image_id ) {
				set_post_thumbnail( $new_post_id, $featured_image_id );
			}

			// Apply SEO Metadata
			$seo_handler->restore_post_seo_metadata( $new_post_id, $post_meta );

			// Restore Custom Fields
			if ( ! empty( $post_meta['Custom Fields'] ) && is_array( $post_meta['Custom Fields'] ) ) {
				foreach ( $post_meta['Custom Fields'] as $f_key => $f_val ) {
					update_post_meta( $new_post_id, sanitize_key( $f_key ), sanitize_text_field( $f_val ) );
				}
			}
		}

		// Delete temporary folder files and folder
		$this->recursive_delete( $extract_path );

		// Delete original ZIP file to prevent directory clogging
		@unlink( $zip_file_path );

		$duration = round( microtime( true ) - $start_time, 2 ) . ' seconds';
		
		PBRP_Logger::log(
			sprintf(
				'Restore completed successfully: %d imported, %d updated, %d skipped, %d images mapped. (Duration: %s)',
				$restored_count,
				$replaced_count,
				$skipped_count,
				$imported_images,
				$duration
			),
			'success'
		);

		return array(
			'imported' => $restored_count,
			'updated'  => $replaced_count,
			'skipped'  => $skipped_count,
			'images'   => $imported_images,
			'duration' => $duration
		);
	}

	/**
	 * Find standard duplicate post based on matching slug or matching title
	 */
	private function get_duplicate_post( $slug, $title ) {
		// Try by slug first
		$posts = get_posts( array(
			'name'        => $slug,
			'post_type'   => 'post',
			'post_status' => 'any',
			'numberposts' => 1,
		) );

		if ( ! empty( $posts ) ) {
			return $posts[0];
		}

		// Try by Title
		$posts = get_posts( array(
			'title'       => $title,
			'post_type'   => 'post',
			'post_status' => 'any',
			'numberposts' => 1,
		) );

		if ( ! empty( $posts ) ) {
			return $posts[0];
		}

		return false;
	}

	/**
	 * Recursive directory delete helper
	 */
	private function recursive_delete( $dir ) {
		if ( ! is_dir( $dir ) ) {
			return;
		}

		$files = array_diff( scandir( $dir ), array( '.', '..' ) );
		foreach ( $files as $file ) {
			( is_dir( "$dir/$file" ) ) ? $this->recursive_delete( "$dir/$file" ) : @unlink( "$dir/$file" );
		}
		return @rmdir( $dir );
	}
}
