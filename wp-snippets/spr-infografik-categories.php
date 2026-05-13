<?php
/**
 * SPR Infografik Categories — REST endpoint
 *
 * Paste into WP Code Snippets, "Run snippet everywhere", Activate.
 *
 * Exposes the kategori_infografik taxonomy as a list of {slug, label, count}
 * so the frontend can render its tab bar dynamically. Adding a new term in
 * WP admin will surface as a new tab automatically after the next page load.
 *
 * Endpoint: GET /wp-json/spr/v1/infografik/categories
 */

add_action('rest_api_init', function () {
    register_rest_route('spr/v1', '/infografik/categories', [
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        'callback'            => function () {
            $terms = get_terms([
                'taxonomy'   => 'kategori_infografik',
                'hide_empty' => false,
                'orderby'    => 'term_order',
                'order'      => 'ASC',
            ]);
            if (is_wp_error($terms) || !is_array($terms)) {
                return new WP_REST_Response([], 200);
            }
            $result = [];
            foreach ($terms as $t) {
                $result[] = [
                    'slug'  => $t->slug,
                    'label' => $t->name,
                    'count' => (int) $t->count,
                ];
            }
            return new WP_REST_Response($result, 200, ['Cache-Control' => 'public, max-age=300']);
        },
    ]);
});
