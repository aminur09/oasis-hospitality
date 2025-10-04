<?php
/**
 * Oasis Hospitality Theme functions
 * - Registers theme supports and image sizes
 * - Loads pattern files from /patterns
 * - Basic security and SEO tweaks suitable for a block theme
 *
 * @package Oasis
 */

if ( ! defined( 'ABSPATH' ) ) {
	 exit;
}

/**
 * Theme setup
 */
function oasis_setup() {
	// Core supports.
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'editor-styles' );
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );
	add_theme_support( 'automatic-feed-links' );

	// Custom image sizes.
	add_image_size( 'card-3x2', 600, 400, true );
	add_image_size( 'hero-xl', 1920, 1080, true );

	// Register navigation menus (used by core/navigation block).
	register_nav_menus(
		array(
			'primary' => __( 'Primary Menu', 'oasis' ),
			'footer'  => __( 'Footer Menu', 'oasis' ),
		)
	);
}
add_action( 'after_setup_theme', 'oasis_setup' );

/**
 * Enqueue
 */
function oasis_enqueue() {
	// Preload fonts (Inter variable via rsms; Playfair via Google).
	wp_enqueue_style( 'oasis-fonts', 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap', array(), null );
	// Inter variable - stylesheet that loads variable font.
	wp_enqueue_style( 'oasis-inter', 'https://rsms.me/inter/inter.css', array(), null );
}
add_action( 'wp_enqueue_scripts', 'oasis_enqueue' );

/**
 * Register block patterns from /patterns
 */
function oasis_register_block_patterns() {
	$patterns_dir = get_theme_file_path( '/patterns' );

	if ( ! is_dir( $patterns_dir ) ) {
		return;
	}

	$files = glob( $patterns_dir . '/*.html' );
	if ( ! $files ) {
		return;
	}

	foreach ( $files as $file ) {
		$slug  = basename( $file, '.html' );
		$title = ucwords( str_replace( '-', ' ', $slug ) );

		$content = file_get_contents( $file );
		if ( ! $content ) {
			continue;
		}

		register_block_pattern(
			'oasis/' . $slug,
			array(
				'title'      => 'Oasis: ' . $title,
				'categories' => array( 'oasis' ),
				'content'    => $content,
			)
		);
	}

	// Register pattern category.
	register_block_pattern_category(
		'oasis',
		array( 'label' => __( 'Oasis', 'oasis' ) )
	);
}
add_action( 'init', 'oasis_register_block_patterns' );

/**
 * Basic security headers and tweaks
 */
function oasis_send_security_headers() {
	if ( ! headers_sent() ) {
		header( 'X-Content-Type-Options: nosniff' );
		header( 'X-Frame-Options: SAMEORIGIN' );
		header( 'Referrer-Policy: no-referrer-when-downgrade' );
		header( 'X-XSS-Protection: 1; mode=block' );
	}
}
add_action( 'init', 'oasis_send_security_headers' );

/**
 * Allow SVG upload for administrators (for logo assets).
 * Note: Ensure files are sanitized before upload. This allows admin-only by capability check.
 */
function oasis_allow_svg_uploads( $mimes ) {
	if ( current_user_can( 'manage_options' ) ) {
		$mimes['svg'] = 'image/svg+xml';
	}
	return $mimes;
}
add_filter( 'upload_mimes', 'oasis_allow_svg_uploads' );

/**
 * Disable comments on attachments (minor hardening / cleanliness).
 */
add_filter( 'comments_open', function( $open, $post_id ) {
	$post = get_post( $post_id );
	if ( $post && 'attachment' === $post->post_type ) {
		return false;
	}
	return $open;
}, 10, 2 );

/**
 * Helper: Safe text output
 */
function oasis_esc_text( $text ) {
	return esc_html( $text ?? '' );
}