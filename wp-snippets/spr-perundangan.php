<?php
/**
 * SPR Perundangan — ACF Options page + REST endpoint
 *
 * Paste into WP Code Snippets, "Run snippet everywhere", Activate.
 * Install on cmsodspr (and local if you dev-point to local).
 *
 * Setup steps after activating:
 *   1. ACF → Tools → Import Field Groups → upload spr-perundangan-acf.json
 *   2. Open Perundangan → add entries (title + PDF file)
 *   3. Verify endpoint: GET /wp-json/spr/v1/perundangan
 */

add_action('acf/init', function () {
    if (function_exists('acf_add_options_page')) {
        acf_add_options_page([
            'page_title' => 'Peruntukan Undang-undang',
            'menu_title' => 'Perundangan',
            'menu_slug'  => 'acf-options-perundangan',
            'capability' => 'edit_posts',
            'icon_url'   => 'dashicons-book-alt',
            'position'   => 31,
        ]);
    }
});

add_action('rest_api_init', function () {
    register_rest_route('spr/v1', '/perundangan', [
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        'callback'            => function () {
            $items = function_exists('get_field') ? (get_field('perundangan_items', 'option') ?: []) : [];
            $result = [];
            foreach ($items as $item) {
                $pdf = $item['pdf_file'] ?? null;
                $url = null;
                if (is_array($pdf)) {
                    $url = $pdf['url'] ?? null;
                } elseif (is_numeric($pdf)) {
                    $url = wp_get_attachment_url((int) $pdf) ?: null;
                } elseif (is_string($pdf) && $pdf !== '') {
                    $url = $pdf;
                }
                $result[] = [
                    'title' => isset($item['title']) ? (string) $item['title'] : '',
                    'year'  => isset($item['year']) ? (string) $item['year'] : '',
                    'url'   => $url,
                ];
            }
            return new WP_REST_Response($result, 200, ['Cache-Control' => 'public, max-age=300']);
        },
    ]);
});
