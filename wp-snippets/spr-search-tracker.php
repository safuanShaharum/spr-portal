<?php
/**
 * SPR Search Tracker
 *
 * Paste into WP Code Snippets, "Run snippet everywhere", Activate.
 * Install on BOTH local WP and cmsodspr staging (and the SPR production WP).
 *
 * Provides:
 *   - POST /wp-json/spr/v1/search-log      { q, results }  → records a search (results>0 only)
 *   - GET  /wp-json/spr/v1/popular-searches?limit=3        → top-N { data:[{q,hits}] }
 *
 * Stores only the query text + aggregate count in a custom table. No user
 * identity, IP, or session is recorded.
 */

if (!defined('ABSPATH')) exit;

// Normalise a query for grouping. Mirrors normalize() in lib/search.ts.
function spr_search_normalize($s) {
    $s = mb_strtolower(trim($s));
    $s = preg_replace('/\bke-?(\d)/', '$1', $s);
    $s = preg_replace('/[^a-z0-9]+/', ' ', $s);
    $s = preg_replace('/\s+/', ' ', $s);
    return trim($s);
}

// Create the log table once (guarded by a version option).
function spr_search_ensure_table() {
    if (get_option('spr_search_log_version') === '1') return;
    global $wpdb;
    $table   = $wpdb->prefix . 'spr_search_log';
    $charset = $wpdb->get_charset_collate();
    $sql = "CREATE TABLE $table (
        query_norm VARCHAR(191) NOT NULL,
        query_display VARCHAR(255) NOT NULL,
        hits INT UNSIGNED NOT NULL DEFAULT 1,
        last_seen DATETIME NOT NULL,
        PRIMARY KEY (query_norm)
    ) $charset;";
    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    dbDelta($sql);
    update_option('spr_search_log_version', '1');
}

add_action('rest_api_init', function () {
    // POST /spr/v1/search-log
    register_rest_route('spr/v1', '/search-log', [
        'methods'             => 'POST',
        'permission_callback' => '__return_true',
        'callback'            => function (WP_REST_Request $req) {
            global $wpdb;
            $results = (int) $req->get_param('results');
            $q_raw   = (string) $req->get_param('q');

            if ($results <= 0) {
                return new WP_REST_Response(['ok' => false, 'reason' => 'no_results'], 200);
            }
            $norm = spr_search_normalize($q_raw);
            $len  = mb_strlen($norm);
            if ($len < 2 || $len > 100) {
                return new WP_REST_Response(['ok' => false, 'reason' => 'invalid'], 200);
            }

            spr_search_ensure_table();
            $table   = $wpdb->prefix . 'spr_search_log';
            $display = trim(mb_substr($q_raw, 0, 255));
            $now     = current_time('mysql');

            $wpdb->query($wpdb->prepare(
                "INSERT INTO $table (query_norm, query_display, hits, last_seen)
                 VALUES (%s, %s, 1, %s)
                 ON DUPLICATE KEY UPDATE
                    hits = hits + 1,
                    query_display = VALUES(query_display),
                    last_seen = VALUES(last_seen)",
                $norm, $display, $now
            ));

            return new WP_REST_Response(['ok' => true], 200);
        },
    ]);

    // GET /spr/v1/popular-searches
    register_rest_route('spr/v1', '/popular-searches', [
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        'callback'            => function (WP_REST_Request $req) {
            global $wpdb;
            spr_search_ensure_table();

            $limit = (int) $req->get_param('limit');
            if ($limit <= 0)  $limit = 3;
            if ($limit > 10)  $limit = 10;

            $table = $wpdb->prefix . 'spr_search_log';
            $rows  = $wpdb->get_results($wpdb->prepare(
                "SELECT query_display AS q, hits FROM $table
                 ORDER BY hits DESC, last_seen DESC LIMIT %d",
                $limit
            ), ARRAY_A);

            $data = array_map(function ($r) {
                return ['q' => $r['q'], 'hits' => (int) $r['hits']];
            }, $rows ?: []);

            return new WP_REST_Response(['data' => $data], 200, ['Cache-Control' => 'public, max-age=300']);
        },
    ]);
});
