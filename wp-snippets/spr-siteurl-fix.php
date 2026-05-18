<?php
/**
 * Plugin Name: SPR Siteurl Fix
 * Description: Rewrite WP-output URLs (imej, PDF, uploads) supaya guna public
 *              domain Next.js portal, bukan internal WP hostname. Pakai bila
 *              tak nak ubah WP siteurl/home (Option B dalam DEPLOYMENT.md).
 * Author:      SPR Open Data
 * Version:     1.0.0
 *
 * Install: drop in wp-content/mu-plugins/. Edit domain di bawah.
 */

if (!defined('ABSPATH')) exit;

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG — ubah ikut deployment
// ─────────────────────────────────────────────────────────────────────────────
define('SPR_INTERNAL_HOST', 'http://wp-internal.spr.local');       // WP internal URL (no trailing slash)
define('SPR_PUBLIC_HOST',   'https://opendata.spr.gov.my');         // Next.js portal public URL
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Rewrite upload base URL.
 * Affects: media library URLs, attachment URLs, ACF file/image fields.
 */
add_filter('upload_dir', function ($dirs) {
    $dirs['baseurl'] = str_replace(SPR_INTERNAL_HOST, SPR_PUBLIC_HOST, $dirs['baseurl']);
    $dirs['url']     = str_replace(SPR_INTERNAL_HOST, SPR_PUBLIC_HOST, $dirs['url']);
    return $dirs;
}, 10);

/**
 * Rewrite individual attachment URLs.
 * Catches wp_get_attachment_url(), wp_get_attachment_image_src(), etc.
 */
add_filter('wp_get_attachment_url', function ($url) {
    return str_replace(SPR_INTERNAL_HOST, SPR_PUBLIC_HOST, $url);
});

add_filter('wp_get_attachment_image_src', function ($image) {
    if (is_array($image) && isset($image[0])) {
        $image[0] = str_replace(SPR_INTERNAL_HOST, SPR_PUBLIC_HOST, $image[0]);
    }
    return $image;
});

/**
 * Rewrite ACF file/image return arrays.
 * ACF often returns ['url' => 'http://wp-internal/...'] — fix it.
 */
add_filter('acf/format_value', function ($value, $post_id, $field) {
    if (is_array($value) && isset($value['url'])) {
        $value['url'] = str_replace(SPR_INTERNAL_HOST, SPR_PUBLIC_HOST, $value['url']);
        if (isset($value['sizes']) && is_array($value['sizes'])) {
            foreach ($value['sizes'] as $k => $v) {
                if (is_string($v)) {
                    $value['sizes'][$k] = str_replace(SPR_INTERNAL_HOST, SPR_PUBLIC_HOST, $v);
                }
            }
        }
    } elseif (is_string($value) && strpos($value, SPR_INTERNAL_HOST) !== false) {
        $value = str_replace(SPR_INTERNAL_HOST, SPR_PUBLIC_HOST, $value);
    }
    return $value;
}, 20, 3);

/**
 * Safety net — REST API responses sometimes embed raw URLs in custom fields.
 * Run a final string replace on JSON output for /spr/v1/* endpoints.
 */
add_filter('rest_pre_serve_request', function ($served, $result, $request) {
    if (strpos($request->get_route(), '/spr/v1/') !== 0) return $served;
    // Let WP serve normally — string replace happens via output buffer below.
    return $served;
}, 10, 3);

add_action('rest_api_init', function () {
    if (strpos($_SERVER['REQUEST_URI'] ?? '', '/spr/v1/') === false) return;
    ob_start(function ($buffer) {
        return str_replace(SPR_INTERNAL_HOST, SPR_PUBLIC_HOST, $buffer);
    });
});
