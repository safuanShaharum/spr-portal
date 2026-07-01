<?php
/**
 * Plugin Name: SPR Siteurl Fix
 * Description: WP siteurl kat server SPR ialah https://127.0.0.1 — URL media
 *              (imej infografik, PDF, uploads) jadi https://127.0.0.1/wp-content/...
 *              yang browser TAK boleh load. Snippet ni tulis-semula URL tu dalam
 *              output REST /spr/v1/* menjadi root-relative (/wp-content/...),
 *              supaya browser load dari origin portal (nginx route /wp-content ke WP).
 *              Robust merentas http/https/IP/domain.
 * Author:      SPR Open Data
 * Version:     2.0.0
 *
 * Install: WP Code Snippets ("Run everywhere", Activate) ATAU drop dalam
 *          wp-content/mu-plugins/. Pasang di WP server SPR (10.24.131.103).
 */

if (!defined('ABSPATH')) exit;

// Host dalaman WP yang perlu dibuang dari URL output (kedua-dua protokol).
// Kosongkan protokol+host → URL jadi root-relative (/wp-content/uploads/...).
if (!function_exists('spr_fix_internal_urls')) {
    function spr_fix_internal_urls($buffer) {
        return str_replace(
            ['https://127.0.0.1', 'http://127.0.0.1'],
            '',
            $buffer
        );
    }
}

// Tulis-semula semua URL dalaman dalam JSON output endpoint /spr/v1/*.
add_action('rest_api_init', function () {
    if (strpos($_SERVER['REQUEST_URI'] ?? '', '/spr/v1/') === false) return;
    ob_start('spr_fix_internal_urls');
});
