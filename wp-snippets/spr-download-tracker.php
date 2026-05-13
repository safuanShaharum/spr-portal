<?php
/**
 * SPR Stats Endpoint (Koko Analytics passthrough)
 *
 * Paste into WP Code Snippets, "Run snippet everywhere", Activate.
 * Install on BOTH local WP and cmsodspr staging.
 *
 * Provides:
 *   - GET /wp-json/spr/v1/stats → { today, month, year, downloads }
 *
 * All numbers sourced from Koko Analytics tables. Downloads counted by
 * pageviews on synthetic /muat-turun/<filename> paths (written by the
 * Next.js proxy on every CSV/PDF click).
 */

add_action('rest_api_init', function () {
    register_rest_route('spr/v1', '/stats', [
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        'callback'            => function () {
            global $wpdb;

            $today       = current_time('Y-m-d');
            $month_start = current_time('Y-m-01');
            $year_start  = current_time('Y-01-01');

            $site_stats  = $wpdb->prefix . 'koko_analytics_site_stats';
            $post_stats  = $wpdb->prefix . 'koko_analytics_post_stats';
            $paths       = $wpdb->prefix . 'koko_analytics_paths';

            // Visitors aggregated from Koko site_stats
            $today_v = (int) $wpdb->get_var($wpdb->prepare("SELECT COALESCE(SUM(visitors),0) FROM $site_stats WHERE date = %s", $today));
            $month_v = (int) $wpdb->get_var($wpdb->prepare("SELECT COALESCE(SUM(visitors),0) FROM $site_stats WHERE date >= %s", $month_start));
            $year_v  = (int) $wpdb->get_var($wpdb->prepare("SELECT COALESCE(SUM(visitors),0) FROM $site_stats WHERE date >= %s", $year_start));

            // Downloads = total pageviews on /muat-turun/* paths
            $downloads = (int) $wpdb->get_var("SELECT COALESCE(SUM(s.pageviews),0) FROM $post_stats s JOIN $paths p ON p.id = s.path_id WHERE p.path LIKE '/muat-turun/%'");

            return new WP_REST_Response([
                'today'     => $today_v,
                'month'     => $month_v,
                'year'      => $year_v,
                'downloads' => $downloads,
            ], 200, ['Cache-Control' => 'public, max-age=30']);
        },
    ]);
});
