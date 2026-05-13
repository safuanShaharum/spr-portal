<?php
/**
 * SPR FAQ — ACF Options sub-page + REST endpoint
 *
 * Paste into WP Code Snippets, "Run snippet everywhere", Activate.
 * Install on BOTH local WP and cmsodspr staging.
 *
 * Setup steps after activating:
 *   1. ACF → Tools → Import Field Groups → upload spr-faq-acf.json
 *   2. Open Portal Data → Soalan Lazim → add FAQ entries (title + PDF file)
 *   3. Verify endpoint: GET /wp-json/spr/v1/faq
 *
 * If parent_slug below doesn't match your existing Portal Data parent
 * Options page, adjust accordingly.
 */

// Register Options page for FAQ. Standalone top-level menu — easiest path
// since parent_slug of existing Portal Data parent may differ across sites.
// Move under Portal Data later by setting `parent_slug` to its actual menu_slug.
add_action('acf/init', function () {
    if (function_exists('acf_add_options_page')) {
        acf_add_options_page([
            'page_title' => 'Soalan Lazim (FAQ)',
            'menu_title' => 'Soalan Lazim',
            'menu_slug'  => 'acf-options-soalan-lazim',
            'capability' => 'edit_posts',
            'icon_url'   => 'dashicons-format-aside',
            'position'   => 30,
        ]);
    }
});

// Public REST endpoint — returns [{title, url}, ...]
add_action('rest_api_init', function () {
    register_rest_route('spr/v1', '/faq', [
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        'callback'            => function () {
            $items = function_exists('get_field') ? (get_field('faq_items', 'option') ?: []) : [];
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
                    'url'   => $url,
                ];
            }
            return new WP_REST_Response($result, 200, ['Cache-Control' => 'public, max-age=300']);
        },
    ]);
});
