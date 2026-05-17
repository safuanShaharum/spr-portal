<?php
/**
 * Plugin Name: SPR Rebuild Trigger
 * Description: Fires HTTP webhook to Next.js portal when ACF Excel master file is updated.
 *              Install sebagai mu-plugin: drop dalam wp-content/mu-plugins/.
 * Author:      SPR Open Data
 * Version:     1.0.0
 */

if (!defined('ABSPATH')) exit;

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG — ubah ikut deployment
// ─────────────────────────────────────────────────────────────────────────────
define('SPR_REBUILD_URL',   'https://opendata.spr.gov.my/api/rebuild');
define('SPR_REBUILD_TOKEN', 'PASTE_TOKEN_FROM_UBUNTU_ENV_HERE');

// ACF field key/name yang hold master Excel file. Adjust kalau lain.
define('SPR_EXCEL_FIELD_NAME', 'master_excel');   // ACF field name
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fire webhook to Next.js — async (non-blocking).
 */
function spr_fire_rebuild_webhook($source = 'unknown') {
    $args = [
        'method'   => 'POST',
        'timeout'  => 5,
        'blocking' => false,    // fire-and-forget
        'headers'  => [
            'Authorization' => 'Bearer ' . SPR_REBUILD_TOKEN,
            'Content-Type'  => 'application/json',
        ],
        'body'     => wp_json_encode([
            'source'    => $source,
            'timestamp' => current_time('c'),
        ]),
        'sslverify' => true,
    ];
    wp_remote_post(SPR_REBUILD_URL, $args);
    error_log("[SPR Rebuild] Webhook fired from: $source");
}

/**
 * Hook 1 — ACF: bila Options page Excel field di-save.
 * Adjust hook name ikut ACF field setup. Common pattern: acf/save_post
 */
add_action('acf/save_post', function ($post_id) {
    // Only fire when Options page is saved (not regular posts).
    if ($post_id !== 'options') return;

    // Optional: only fire if the Excel field actually changed.
    // Get current and previous values.
    $current = get_field(SPR_EXCEL_FIELD_NAME, 'options');
    if (!$current) return;

    spr_fire_rebuild_webhook('acf_options:' . SPR_EXCEL_FIELD_NAME);
}, 20);

/**
 * Hook 2 — fallback: bila attachment (file Excel) di-upload baru.
 * Catches direct media library upload kalau ACF tak fire.
 */
add_action('add_attachment', function ($attachment_id) {
    $mime = get_post_mime_type($attachment_id);
    $excel_mimes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel',                                          // .xls
    ];
    if (!in_array($mime, $excel_mimes, true)) return;

    spr_fire_rebuild_webhook('attachment_upload:' . $attachment_id);
});

/**
 * Manual trigger via admin bar (untuk debugging).
 * Klik "Rebuild Portal" di admin bar → fire webhook.
 */
add_action('admin_bar_menu', function ($bar) {
    if (!current_user_can('manage_options')) return;
    $bar->add_node([
        'id'    => 'spr-rebuild',
        'title' => '🔄 Rebuild Portal',
        'href'  => wp_nonce_url(admin_url('admin-post.php?action=spr_rebuild'), 'spr_rebuild'),
    ]);
}, 100);

add_action('admin_post_spr_rebuild', function () {
    check_admin_referer('spr_rebuild');
    if (!current_user_can('manage_options')) wp_die('Forbidden');
    spr_fire_rebuild_webhook('manual_admin_bar');
    wp_safe_redirect(admin_url('?spr_rebuild=fired'));
    exit;
});

add_action('admin_notices', function () {
    if (isset($_GET['spr_rebuild']) && $_GET['spr_rebuild'] === 'fired') {
        echo '<div class="notice notice-success"><p>Portal rebuild triggered. Tunggu 2-3 minit untuk frontend update.</p></div>';
    }
});
