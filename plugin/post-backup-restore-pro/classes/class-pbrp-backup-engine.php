<?php
/**
 * Main Backup Generation Engine.
 *
 * Extracts WordPress posts, builds JSON/CSV/XML, detects and copies media assets,
 * and packages them into a clean and secure ZIP structure.
 *
 * @package           PostBackupRestorePro
 * @subpackage        PostBackupRestorePro/classes
 * @author            Atif Syed
 */

namespace PostBackupRestorePro\Classes;

use PostBackupRestorePro\Includes\PBRP_Logger;

class PBRP_Backup_Engine {

	/**
	 * Backup configuration settings
	 */
	protected $settings;

	/**
	 * Constructor. Load saved settings.
	 */
	public function __construct() {
		$this->settings = get_option( 'pbrp_settings', array() );
	}

	/**
	 * Run the full backup process for an array of selected post IDs
	 *
	 * @param array $post_ids List of selected post IDs to export
	 * @return array|false Metadata about the generated backup, or false on failure
	 */
	public function create_backup( $post_ids ) {
		if ( empty( $post_ids ) || ! is_array( $post_ids ) ) {
			PBRP_Logger::log( 'Export failed: No posts specified.', 'error' );
			return false;
		}

		$start_time = microtime( true );
		$upload_dir = wp_upload_dir();
		$temp_dir_name = 'pbrp-export-' . wp_generate_password( 12, false );
		$export_path   = path_join( $upload_dir['basedir'] . '/pbrp-backups', $temp_dir_name );

		if ( ! wp_mkdir_p( $export_path ) ) {
			PBRP_Logger::log( 'Export failed: Unable to create temporary export workspace.', 'error' );
			return false;
		}

		// Create subdirectories inside workspace
		wp_mkdir_p( path_join( $export_path, 'posts' ) );
		wp_mkdir_p( path_join( $export_path, 'images' ) );
		wp_mkdir_p( path_join( $export_path, 'metadata' ) );

		$posts_meta_data = array();
		$csv_rows        = array();
		$xml_data        = array();
		$copied_images   = array();
		
		$media_handler = new PBRP_Media_Handler();
		$seo_handler   = new PBRP_SEO_Handler();

		// Add CSV Headers
		$csv_rows[] = array( 'Title', 'Slug', 'URL', 'Date', 'Category', 'Author', 'Featured Image URL' );

		// Process each post
		foreach ( $post_ids as $post_id ) {
			$post = get_post( $post_id );
			if ( ! $post ) {
				continue;
			}

			// Sniff all content and featured images
			$post_images = $media_handler->sniff_post_images( $post_id );
			
			// Copy images into the export folder
			foreach ( $post_images as $image ) {
				$destination = path_join( $export_path . '/images', $image['filename'] );
				if ( ! file_exists( $destination ) ) {
					if ( @copy( $image['file_path'], $destination ) ) {
						$copied_images[] = $image['filename'];
					}
				}
			}

			// Gather SEO Data
			$seo_data = $seo_handler->get_post_seo_metadata( $post_id );

			// Custom Fields
			$custom_fields = array();
			$all_meta = get_post_meta( $post_id );
			foreach ( $all_meta as $key => $values ) {
				// Avoid internal core private fields
				if ( strpos( $key, '_' ) !== 0 ) {
					$custom_fields[ $key ] = $values[0];
				}
			}

			// Calculate stats
			$word_count   = str_word_count( strip_tags( $post->post_content ) );
			$reading_time = ceil( $word_count / 200 ); // average reading pace 200 wpm

			// Get categories and tags
			$categories = wp_get_post_categories( $post_id, array( 'fields' => 'names' ) );
			$tags       = wp_get_post_tags( $post_id, array( 'fields' => 'names' ) );

			// Post Metadata item for JSON
			$meta_item = array(
				'ID'               => $post->ID,
				'Title'            => $post->post_title,
				'Slug'             => $post->post_name,
				'URL'              => get_permalink( $post->ID ),
				'Published Date'   => $post->post_date,
				'Modified Date'    => $post->post_modified,
				'Author'           => get_the_author_meta( 'display_name', $post->post_author ),
				'Categories'       => $categories,
				'Tags'             => $tags,
				'SEO Title'        => ! empty( $seo_data['title'] ) ? $seo_data['title'] : $post->post_title,
				'Meta Description' => ! empty( $seo_data['description'] ) ? $seo_data['description'] : '',
				'Focus Keyword'    => ! empty( $seo_data['focus_keyword'] ) ? $seo_data['focus_keyword'] : '',
				'Featured Image'   => get_the_post_thumbnail_url( $post_id, 'full' ),
				'Gallery Images'   => $post_images,
				'Content'          => $post->post_content,
				'Excerpt'          => $post->post_excerpt,
				'Word Count'       => $word_count,
				'Reading Time'     => $reading_time . ' min',
				'Custom Fields'    => $custom_fields,
				'Status'           => $post->post_status,
			);

			$posts_meta_data[] = $meta_item;

			// Add CSV Row
			$csv_rows[] = array(
				$post->post_title,
				$post->post_name,
				get_permalink( $post->ID ),
				$post->post_date,
				implode( ', ', $categories ),
				get_the_author_meta( 'display_name', $post->post_author ),
				get_the_post_thumbnail_url( $post_id, 'full' ) ?: ''
			);

			// Render Post to standalone HTML file
			$html_content = $this->render_post_html( $post, $meta_item );
			@file_put_contents( path_join( $export_path . '/posts', "post-{$post->ID}.html" ), $html_content );
		}

		// Write JSON file
		@file_put_contents(
			path_join( $export_path . '/metadata', 'posts.json' ),
			json_encode( $posts_meta_data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES )
		);

		// Write CSV file
		$csv_fp = @fopen( path_join( $export_path . '/metadata', 'posts.csv' ), 'w' );
		if ( $csv_fp ) {
			foreach ( $csv_rows as $row ) {
				fputcsv( $csv_fp, $row );
			}
			fclose( $csv_fp );
		}

		// Write WordPress standard XML file
		$xml_content = $this->render_wordpress_export_xml( $posts_meta_data );
		@file_put_contents( path_join( $export_path . '/metadata', 'wordpress-export.xml' ), $xml_content );

		// Write readme.txt and version.json
		$readme_content = $this->render_readme_txt( count( $post_ids ) );
		@file_put_contents( path_join( $export_path, 'readme.txt' ), $readme_content );

		$version_data = array(
			'plugin_version' => PBRP_VERSION,
			'wp_version'     => get_bloginfo( 'version' ),
			'export_date'    => current_time( 'mysql' ),
			'posts_count'    => count( $post_ids ),
			'images_count'   => count( $copied_images )
		);
		@file_put_contents(
			path_join( $export_path, 'version.json' ),
			json_encode( $version_data, JSON_PRETTY_PRINT )
		);

		// Create ZIP archive
		$zip_filename = 'backup-' . current_time( 'Y-m-d-H-i-s' ) . '-' . wp_generate_password( 6, false ) . '.zip';
		$zip_file_path = path_join( $upload_dir['basedir'] . '/pbrp-backups', $zip_filename );

		$zip = new \ZipArchive();
		if ( $zip->open( $zip_file_path, \ZipArchive::CREATE ) === true ) {
			$this->add_folder_to_zip( $export_path, $zip, strlen( $export_path . '/' ) );
			$zip->close();
		} else {
			PBRP_Logger::log( 'Export failed: ZipArchive could not be created.', 'error' );
			$this->recursive_delete( $export_path );
			return false;
		}

		// Delete Temporary folder
		$this->recursive_delete( $export_path );

		$duration = round( microtime( true ) - $start_time, 2 ) . ' seconds';
		$zip_size = size_format( @filesize( $zip_file_path ) );

		PBRP_Logger::log_backup( $zip_filename, count( $post_ids ), count( $copied_images ), $zip_size, $duration );

		return array(
			'zip_name'     => $zip_filename,
			'zip_url'      => content_url( 'uploads/pbrp-backups/' . $zip_filename ),
			'posts_count'  => count( $post_ids ),
			'images_count' => count( $copied_images ),
			'size'         => $zip_size,
			'duration'     => $duration
		);
	}

	/**
	 * Append a full directory structure recursively inside a ZIP archive
	 */
	private function add_folder_to_zip( $folder, &$zip, $exclusiveLength ) {
		$handle = opendir( $folder );
		while ( false !== ( $f = readdir( $handle ) ) ) {
			if ( '.' !== $f && '..' !== $f ) {
				$filePath = "$folder/$f";
				$localPath = substr( $filePath, $exclusiveLength );
				if ( is_file( $filePath ) ) {
					$zip->addFile( $filePath, $localPath );
				} elseif ( is_dir( $filePath ) ) {
					$zip->addEmptyDir( $localPath );
					$this->add_folder_to_zip( $filePath, $zip, $exclusiveLength );
				}
			}
		}
		closedir( $handle );
	}

	/**
	 * Helper function to render a post as beautiful self-contained HTML
	 */
	private function render_post_html( $post, $meta ) {
		$categories = implode( ', ', $meta['Categories'] );
		$tags       = implode( ', ', $meta['Tags'] );
		$seo_title  = esc_html( $meta['SEO Title'] );
		$seo_desc   = esc_html( $meta['Meta Description'] );

		ob_start();
		?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title><?php echo esc_html( $post->post_title ); ?></title>
	<meta name="slug" content="<?php echo esc_attr( $post->post_name ); ?>">
	<meta name="published_date" content="<?php echo esc_attr( $post->post_date ); ?>">
	<meta name="modified_date" content="<?php echo esc_attr( $post->post_modified ); ?>">
	<meta name="author" content="<?php echo esc_attr( $meta['Author'] ); ?>">
	<meta name="categories" content="<?php echo esc_attr( $categories ); ?>">
	<meta name="tags" content="<?php echo esc_attr( $tags ); ?>">
	<meta name="seo_title" content="<?php echo esc_attr( $seo_title ); ?>">
	<meta name="seo_description" content="<?php echo esc_attr( $seo_desc ); ?>">
	<style>
		body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; color: #333; }
		h1 { font-size: 2.5rem; margin-bottom: 5px; color: #111; }
		.meta { font-size: 0.9rem; color: #666; margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 15px; }
		.featured-image { max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 30px; }
		.content { font-size: 1.1rem; }
	</style>
</head>
<body>
	<h1><?php echo esc_html( $post->post_title ); ?></h1>
	<div class="meta">
		<strong>Published:</strong> <?php echo esc_html( $post->post_date ); ?> | 
		<strong>Author:</strong> <?php echo esc_html( $meta['Author'] ); ?> | 
		<strong>Categories:</strong> <?php echo esc_html( $categories ); ?> | 
		<strong>Tags:</strong> <?php echo esc_html( $tags ); ?>
	</div>
	<?php if ( ! empty( $meta['Featured Image'] ) ) : ?>
		<img src="../images/<?php echo esc_attr( basename( $meta['Featured Image'] ) ); ?>" class="featured-image" alt="<?php echo esc_attr( $post->post_title ); ?>">
	<?php endif; ?>
	<div class="content">
		<?php echo wp_kses_post( wpautop( $post->post_content ) ); ?>
	</div>
</body>
</html>
		<?php
		return ob_get_clean();
	}

	/**
	 * Build standardized standard WordPress XML Import format
	 */
	private function render_wordpress_export_xml( $posts ) {
		ob_start();
		echo '<?xml version="1.0" encoding="UTF-8" ?>' . "\n";
		?>
<rss version="2.0"
	xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
	xmlns:content="http://purl.org/rss/1.0/modules/content/"
	xmlns:wfw="http://wellformedweb.org/CommentAPI/"
	xmlns:dc="http://purl.org/dc/elements/1.1/"
	xmlns:wp="http://wordpress.org/export/1.2/"
>
<channel>
	<title><?php bloginfo_rss('name'); ?></title>
	<link><?php bloginfo_rss('url'); ?></link>
	<description><?php bloginfo_rss('description'); ?></description>
	<pubDate><?php echo current_time('r'); ?></pubDate>
	<language><?php bloginfo_rss('language'); ?></language>
	<wp:wxr_version>1.2</wp:wxr_version>
	<?php foreach ( $posts as $p ) : ?>
	<item>
		<title><?php echo esc_xml( $p['Title'] ); ?></title>
		<link><?php echo esc_url( $p['URL'] ); ?></link>
		<pubDate><?php echo esc_xml( date('r', strtotime($p['Published Date'])) ); ?></pubDate>
		<dc:creator><?php echo esc_xml( $p['Author'] ); ?></dc:creator>
		<guid isPermaLink="false"><?php echo esc_url( $p['URL'] ); ?></guid>
		<description><![CDATA[<?php echo wp_kses_post($p['Excerpt']); ?>]]></description>
		<content:encoded><![CDATA[<?php echo wp_kses_post($p['Content']); ?>]]></content:encoded>
		<wp:post_id><?php echo intval( $p['ID'] ); ?></wp:post_id>
		<wp:post_date><![CDATA[<?php echo esc_xml($p['Published Date']); ?>]]></wp:post_date>
		<wp:post_name><![CDATA[<?php echo esc_xml($p['Slug']); ?>]]></wp:post_name>
		<wp:status><![CDATA[<?php echo esc_xml($p['Status']); ?>]]></wp:status>
		<wp:post_type><![CDATA[post]]></wp:post_type>
		<?php foreach ( $p['Categories'] as $cat ) : ?>
			<category domain="category" nicename="<?php echo esc_attr(sanitize_title($cat)); ?>"><![CDATA[<?php echo esc_xml($cat); ?>]]></category>
		<?php endforeach; ?>
		<?php foreach ( $p['Tags'] as $tag ) : ?>
			<category domain="post_tag" nicename="<?php echo esc_attr(sanitize_title($tag)); ?>"><![CDATA[<?php echo esc_xml($tag); ?>]]></category>
		<?php endforeach; ?>
	</item>
	<?php endforeach; ?>
</channel>
</rss>
		<?php
		return ob_get_clean();
	}

	/**
	 * Build README.txt to package into the ZIP
	 */
	private function render_readme_txt( $posts_count ) {
		return "==================================================\n" .
			   "Post Backup & Restore Pro - Export File\n" .
			   "==================================================\n\n" .
			   "This backup ZIP file was created securely by Post Backup & Restore Pro on " . current_time( 'mysql' ) . ".\n\n" .
			   "Backup Summary:\n" .
			   "- Total Posts Packed: " . $posts_count . "\n" .
			   "- Core Generator: Post Backup & Restore Pro v" . PBRP_VERSION . "\n" .
			   "- Developer: Atif Syed (http://iatifsyed.github.io/)\n\n" .
			   "Directories in this ZIP:\n" .
			   "- /posts/      : HTML files for easy reading/manipulation\n" .
			   "- /images/     : All featured and embedded inline content images\n" .
			   "- /metadata/   : CSV, JSON and XML schemas used for absolute WordPress sync\n\n" .
			   "Keep this ZIP file safe. You can restore these posts completely to any other WordPress site running Post Backup & Restore Pro.\n";
	}

	/**
	 * Recursive folder delete helper
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
