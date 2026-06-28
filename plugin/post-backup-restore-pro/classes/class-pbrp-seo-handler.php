<?php
/**
 * SEO Plugins Integration Handler.
 *
 * Captures and restores SEO metadata, Facebook Open Graph tags,
 * Twitter cards, canonical links, and focus keywords from Yoast, RankMath, SEOPress, and AIOSEO.
 *
 * @package           PostBackupRestorePro
 * @subpackage        PostBackupRestorePro/classes
 * @author            Atif Syed
 */

namespace PostBackupRestorePro\Classes;

class PBRP_SEO_Handler {

	/**
	 * Read all saved SEO details from a WordPress post
	 *
	 * @param int $post_id The post ID
	 * @return array The compiled SEO parameters
	 */
	public function get_post_seo_metadata( $post_id ) {
		$seo = array(
			'title'             => '',
			'description'       => '',
			'focus_keyword'     => '',
			'canonical_url'     => '',
			'opengraph_title'   => '',
			'opengraph_desc'    => '',
			'opengraph_image'   => '',
			'twitter_title'     => '',
			'twitter_desc'      => '',
			'twitter_image'     => '',
			'robots_noindex'    => 'no',
			'robots_nofollow'   => 'no',
			'schema_type'       => '',
		);

		// 1. Yoast SEO
		if ( defined( 'WPSEO_VERSION' ) || metadata_exists( 'post', $post_id, '_yoast_wpseo_title' ) ) {
			$seo['title']           = get_post_meta( $post_id, '_yoast_wpseo_title', true );
			$seo['description']     = get_post_meta( $post_id, '_yoast_wpseo_metadesc', true );
			$seo['focus_keyword']   = get_post_meta( $post_id, '_yoast_wpseo_focuskw', true );
			$seo['canonical_url']   = get_post_meta( $post_id, '_yoast_wpseo_canonical', true );
			$seo['opengraph_title'] = get_post_meta( $post_id, '_yoast_wpseo_opengraph-title', true );
			$seo['opengraph_desc']  = get_post_meta( $post_id, '_yoast_wpseo_opengraph-description', true );
			$seo['opengraph_image'] = get_post_meta( $post_id, '_yoast_wpseo_opengraph-image', true );
			$seo['twitter_title']   = get_post_meta( $post_id, '_yoast_wpseo_twitter-title', true );
			$seo['twitter_desc']    = get_post_meta( $post_id, '_yoast_wpseo_twitter-description', true );
			$seo['twitter_image']   = get_post_meta( $post_id, '_yoast_wpseo_twitter-image', true );
			$seo['robots_noindex']  = get_post_meta( $post_id, '_yoast_wpseo_meta-robots-noindex', true ) === '1' ? 'yes' : 'no';
			$seo['robots_nofollow'] = get_post_meta( $post_id, '_yoast_wpseo_meta-robots-nofollow', true ) === '1' ? 'yes' : 'no';
		}

		// 2. RankMath SEO
		if ( defined( 'RANK_MATH_VERSION' ) || metadata_exists( 'post', $post_id, 'rank_math_title' ) ) {
			$seo['title']           = get_post_meta( $post_id, 'rank_math_title', true ) ?: $seo['title'];
			$seo['description']     = get_post_meta( $post_id, 'rank_math_description', true ) ?: $seo['description'];
			$seo['focus_keyword']   = get_post_meta( $post_id, 'rank_math_focus_keyword', true ) ?: $seo['focus_keyword'];
			$seo['canonical_url']   = get_post_meta( $post_id, 'rank_math_canonical_url', true ) ?: $seo['canonical_url'];
			$seo['opengraph_title'] = get_post_meta( $post_id, 'rank_math_facebook_title', true ) ?: $seo['opengraph_title'];
			$seo['opengraph_desc']  = get_post_meta( $post_id, 'rank_math_facebook_description', true ) ?: $seo['opengraph_desc'];
			$seo['opengraph_image'] = get_post_meta( $post_id, 'rank_math_facebook_image', true ) ?: $seo['opengraph_image'];
			$seo['twitter_title']   = get_post_meta( $post_id, 'rank_math_twitter_title', true ) ?: $seo['twitter_title'];
			$seo['twitter_desc']    = get_post_meta( $post_id, 'rank_math_twitter_description', true ) ?: $seo['twitter_desc'];
			$seo['twitter_image']   = get_post_meta( $post_id, 'rank_math_twitter_image', true ) ?: $seo['twitter_image'];
			
			$robots = get_post_meta( $post_id, 'rank_math_robots', true );
			if ( is_array( $robots ) ) {
				$seo['robots_noindex']  = in_array( 'noindex', $robots ) ? 'yes' : 'no';
				$seo['robots_nofollow'] = in_array( 'nofollow', $robots ) ? 'yes' : 'no';
			}
			$seo['schema_type']     = get_post_meta( $post_id, 'rank_math_rich_snippet', true );
		}

		// 3. SEOPress
		if ( metadata_exists( 'post', $post_id, '_seopress_titles_title' ) ) {
			$seo['title']           = get_post_meta( $post_id, '_seopress_titles_title', true ) ?: $seo['title'];
			$seo['description']     = get_post_meta( $post_id, '_seopress_titles_desc', true ) ?: $seo['description'];
			$seo['focus_keyword']   = get_post_meta( $post_id, '_seopress_analysis_target_keywords', true ) ?: $seo['focus_keyword'];
			$seo['canonical_url']   = get_post_meta( $post_id, '_seopress_social_canonical', true ) ?: $seo['canonical_url'];
			$seo['opengraph_title'] = get_post_meta( $post_id, '_seopress_social_fb_title', true ) ?: $seo['opengraph_title'];
			$seo['opengraph_desc']  = get_post_meta( $post_id, '_seopress_social_fb_desc', true ) ?: $seo['opengraph_desc'];
			$seo['opengraph_image'] = get_post_meta( $post_id, '_seopress_social_fb_img', true ) ?: $seo['opengraph_image'];
			$seo['robots_noindex']  = get_post_meta( $post_id, '_seopress_robots_noindex', true ) === 'yes' ? 'yes' : 'no';
			$seo['robots_nofollow'] = get_post_meta( $post_id, '_seopress_robots_nofollow', true ) === 'yes' ? 'yes' : 'no';
		}

		return $seo;
	}

	/**
	 * Apply and map SEO parameters to a restored WordPress post
	 *
	 * @param int $post_id The newly restored post ID
	 * @param array $seo_data Compiled SEO array from posts.json
	 */
	public function restore_post_seo_metadata( $post_id, $seo_data ) {
		if ( empty( $seo_data['SEO Title'] ) && empty( $seo_data['Meta Description'] ) ) {
			return;
		}

		$title           = sanitize_text_field( $seo_data['SEO Title'] );
		$desc            = sanitize_text_field( $seo_data['Meta Description'] );
		$focus_kw        = sanitize_text_field( $seo_data['Focus Keyword'] );
		$canonical       = esc_url_raw( $seo_data['Canonical URL'] ?? '' );
		$schema_type     = sanitize_text_field( $seo_data['Schema Type'] ?? '' );

		// Apply to Yoast SEO schema
		update_post_meta( $post_id, '_yoast_wpseo_title', $title );
		update_post_meta( $post_id, '_yoast_wpseo_metadesc', $desc );
		update_post_meta( $post_id, '_yoast_wpseo_focuskw', $focus_kw );
		if ( $canonical ) {
			update_post_meta( $post_id, '_yoast_wpseo_canonical', $canonical );
		}

		// Apply to RankMath SEO schema
		update_post_meta( $post_id, 'rank_math_title', $title );
		update_post_meta( $post_id, 'rank_math_description', $desc );
		update_post_meta( $post_id, 'rank_math_focus_keyword', $focus_kw );
		if ( $canonical ) {
			update_post_meta( $post_id, 'rank_math_canonical_url', $canonical );
		}
		if ( $schema_type ) {
			update_post_meta( $post_id, 'rank_math_rich_snippet', $schema_type );
		}

		// Apply to SEOPress
		update_post_meta( $post_id, '_seopress_titles_title', $title );
		update_post_meta( $post_id, '_seopress_titles_desc', $desc );
		update_post_meta( $post_id, '_seopress_analysis_target_keywords', $focus_kw );
	}
}
