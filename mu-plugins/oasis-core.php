<?php
/**
 * Plugin Name: Oasis Core
 * Description: MU plugin for Oasis Hospitality — registers Projects CPT, taxonomy, image size, creates Careers category, and security hardening.
 * Author: Oasis Hospitality / Genie (Cosine)
 * Version: 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Security hardening
 */
// Disable XML-RPC.
add_filter( 'xmlrpc_enabled', '__return_false' );

// Disallow file editing via dashboard.
if ( ! defined( 'DISALLOW_FILE_EDIT' ) ) {
	define( 'DISALLOW_FILE_EDIT', true );
}

// Sanitize output helper.
function oasis_core_esc( $text ) {
	return esc_html( $text ?? '' );
}

/**
 * Image sizes
 */
add_action( 'after_setup_theme', function() {
	add_image_size( 'card-3x2', 600, 400, true );
} );

/**
 * Register Projects CPT and Project Type taxonomy
 */
add_action( 'init', function() {
	$labels = array(
		'name'               => __( 'Projects', 'oasis' ),
		'singular_name'      => __( 'Project', 'oasis' ),
		'add_new'            => __( 'Add New', 'oasis' ),
		'add_new_item'       => __( 'Add New Project', 'oasis' ),
		'edit_item'          => __( 'Edit Project', 'oasis' ),
		'new_item'           => __( 'New Project', 'oasis' ),
		'view_item'          => __( 'View Project', 'oasis' ),
		'search_items'       => __( 'Search Projects', 'oasis' ),
		'not_found'          => __( 'No projects found', 'oasis' ),
		'not_found_in_trash' => __( 'No projects found in Trash', 'oasis' ),
		'all_items'          => __( 'All Projects', 'oasis' ),
	);

	register_post_type( 'project', array(
		'labels'             => $labels,
		'public'             => true,
		'show_in_rest'       => true,
		'has_archive'        => true,
		'menu_icon'          => 'dashicons-building',
		'supports'           => array( 'title', 'editor', 'thumbnail', 'excerpt' ),
		'taxonomies'         => array(),
		'rewrite'            => array( 'slug' => 'projects' ),
	) );

	// Taxonomy: Project Type.
	$tax_labels = array(
		'name'          => __( 'Project Types', 'oasis' ),
		'singular_name' => __( 'Project Type', 'oasis' ),
	);
	register_taxonomy( 'project_type', 'project', array(
		'labels'            => $tax_labels,
		'public'            => true,
		'show_in_rest'      => true,
		'hierarchical'      => true,
		'rewrite'           => array( 'slug' => 'project-type' ),
	) );
} );

/**
 * Seed default taxonomy terms and Careers category on first run
 */
add_action( 'init', function() {
	// Project Type terms.
	$types = array( 'New Build', 'Renovation', 'Brand Conversion', 'Management Only' );
	foreach ( $types as $type ) {
		if ( ! term_exists( $type, 'project_type' ) ) {
			wp_insert_term( $type, 'project_type' );
		}
	}

	// Careers category.
	if ( ! term_exists( 'Careers', 'category' ) ) {
		wp_insert_term( 'Careers', 'category', array( 'slug' => 'careers' ) );
	}
} );

/**
 * Helper meta fields (stored via custom fields or plugins)
 * This theme uses content blocks; meta display placeholders exist in single-project template.
 * For advanced meta management, consider ACF or core Custom Fields.
 */

/**
 * No admin notices; MU plugin should be quiet.
 */