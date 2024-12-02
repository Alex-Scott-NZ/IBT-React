<?php

add_action('init', function () {
    require_once get_stylesheet_directory() . '/acf-placeholder-setup.php';
    require_once get_stylesheet_directory() . '/Thumbhash.php';
    require_once get_stylesheet_directory() . '/thumbhash-functions.php';
});



function my_theme_enqueue_styles() {
    $parent_style = 'twentytwentyone-style';
    wp_enqueue_style($parent_style, get_template_directory_uri() . '/style.css');
    wp_enqueue_style('child-style', get_stylesheet_directory_uri() . '/style.css', array($parent_style));
}
add_action('wp_enqueue_scripts', 'my_theme_enqueue_styles');

add_action('pre_get_posts', function ($query) {
    if (is_admin() && $query->is_main_query() && $query->get('post_type') === 'article') {
        error_log('Query Vars: ' . print_r($query->query_vars, true));
    }
}, 20);

// Add a dropdown filter for Related Journal in the Articles admin list
add_action('restrict_manage_posts', 'add_related_journal_filter');
function add_related_journal_filter($post_type) {
    // Only show on Article list page
    if ($post_type !== 'article') {
        return;
    }

    // Get all Journal Issues
    $journals = get_posts([
        'post_type' => 'journal-issue', // Corrected post type slug
        'posts_per_page' => -1,
        'orderby' => 'title',
        'order' => 'ASC',
    ]);

    $selected = isset($_GET['filter_by_journal']) ? $_GET['filter_by_journal'] : '';

    echo '<select name="filter_by_journal">';
    echo '<option value="">All Journals</option>';
    echo '<option value="no_journal"' . selected($selected, 'no_journal', false) . '>No Journal Assigned</option>';

    foreach ($journals as $journal) {
        echo '<option value="' . esc_attr($journal->ID) . '"' . selected($selected, $journal->ID, false) . '>' . esc_html($journal->post_title) . '</option>';
    }

    echo '</select>';
}

add_action('pre_get_posts', 'filter_articles_by_related_journal');
function filter_articles_by_related_journal($query) {
    if (!is_admin() || !$query->is_main_query()) {
        return;
    }

    // Check the post type directly from the query
    $post_type = $query->get('post_type');
    if ($post_type !== 'article') {
        return;
    }

    if (isset($_GET['filter_by_journal']) && $_GET['filter_by_journal'] !== '') {
        $journal_id = sanitize_text_field($_GET['filter_by_journal']);

        if ($journal_id === 'no_journal') {
            // Show articles with no journal assigned
            $meta_query = array(
                'relation' => 'OR',
                array(
                    'key' => 'related_journal',
                    'compare' => 'NOT EXISTS'
                ),
                array(
                    'key' => 'related_journal',
                    'value' => '',
                    'compare' => '='
                ),
            );
        } else {
            // Show articles with a specific journal
            $meta_query = array(
                array(
                    'key' => 'related_journal',
                    'value' => $journal_id, // Direct equality comparison
                    'compare' => '='
                )
            );
        }

        // Set the meta query
        $query->set('meta_query', $meta_query);
    }
}

// Add column to Articles
add_filter('manage_article_posts_columns', 'add_journal_column');
function add_journal_column($columns) {
    $columns['related_journal'] = 'Related Journal';
    return $columns;
}

// Populate the Related Journal column
add_action('manage_article_posts_custom_column', 'populate_journal_column', 10, 2);
function populate_journal_column($column, $post_id) {
    if ($column === 'related_journal') {
        // Get the Journal associated with the Article
        $journal = get_field('related_journal', $post_id);
        if ($journal) {
            // Ensure $journal is a WP_Post object
            $journal_id = is_object($journal) ? $journal->ID : $journal;
            echo '<a href="' . get_edit_post_link($journal_id) . '">' . get_the_title($journal_id) . '</a>';
        } else {
            echo '—'; // Display a dash if no Journal is associated
        }
    }
}

// Make the 'Related Journal' column sortable
add_filter('manage_edit-article_sortable_columns', 'make_related_journal_column_sortable');
function make_related_journal_column_sortable($columns) {
    $columns['related_journal'] = 'related_journal';
    return $columns;
}

add_action('pre_get_posts', 'related_journal_orderby');
function related_journal_orderby($query) {
    global $wpdb;

    if (!is_admin() || !$query->is_main_query()) {
        return;
    }

    // Check the post type
    $post_type = $query->get('post_type');
    if ($post_type !== 'article') {
        return;
    }

    $orderby = $query->get('orderby');

    if ('related_journal' === $orderby) {
        // Add a JOIN to link the related_journal ID to the post_title in journal-issue
        add_filter('posts_join', 'related_journal_join');
        add_filter('posts_orderby', 'related_journal_orderby_clause');
    }
}



// Join the posts table to get related Journal's title
function related_journal_join($join) {
    global $wpdb;

    $join .= " LEFT JOIN {$wpdb->postmeta} AS pm_related_journal 
               ON {$wpdb->posts}.ID = pm_related_journal.post_id 
               AND pm_related_journal.meta_key = 'related_journal'";
    $join .= " LEFT JOIN {$wpdb->posts} AS p_related_journal 
               ON pm_related_journal.meta_value = p_related_journal.ID";

    return $join;
}



// Modify the ORDER BY clause to sort by the related Journal's title
function related_journal_orderby_clause($orderby) {
    global $wpdb;

    $order = isset($_GET['order']) && strtoupper($_GET['order']) === 'DESC' ? 'DESC' : 'ASC';
    $orderby = "p_related_journal.post_title $order, {$wpdb->posts}.post_title $order";

    return $orderby;
}

// Clean up the filters after the query runs
add_action('posts_results', 'related_journal_remove_query_filters');
function related_journal_remove_query_filters($posts) {
    remove_filter('posts_join', 'related_journal_join');
    remove_filter('posts_orderby', 'related_journal_orderby_clause');
    return $posts;
}

// Add support for meta_value and meta_value_num ordering in GraphQL
add_filter('graphql_post_object_connection_query_args', function($query_args, $source, $args, $context, $info) {
    if (isset($args['where']['orderby']) && is_array($args['where']['orderby'])) {
        foreach ($args['where']['orderby'] as $orderby) {
            if (!empty($orderby['field']) && in_array($orderby['field'], ['META_VALUE', 'META_VALUE_NUM']) && !empty($args['where']['metaKey'])) {
                $query_args['meta_key'] = $args['where']['metaKey'];
                $query_args['orderby'] = strtolower($orderby['field']);
            }
        }
    }

    // Add support for custom meta queries
    if (isset($args['where']['metaQuery']) && is_array($args['where']['metaQuery'])) {
        $meta_query = [];
        foreach ($args['where']['metaQuery'] as $meta_condition) {
            if (isset($meta_condition['key']) && isset($meta_condition['compare'])) {
                $meta_query_item = [
                    'key' => $meta_condition['key'],
                    'compare' => $meta_condition['compare'],
                ];
                if (isset($meta_condition['value'])) {
                    $meta_query_item['value'] = $meta_condition['value'];
                }
                if (isset($meta_condition['type'])) {
                    $meta_query_item['type'] = $meta_condition['type'];
                }
                $meta_query[] = $meta_query_item;
            }
        }
        if (!empty($meta_query)) {
            $query_args['meta_query'] = isset($query_args['meta_query']) ? 
                array_merge($query_args['meta_query'], $meta_query) : $meta_query;
        }
    }

    return $query_args;
}, 10, 5);

// Add metaKey argument to GraphQL schema
add_filter('graphql_input_fields', function($fields, $type_name) {
    if ($type_name === 'RootQueryToArticleConnectionWhereArgs') {
        $fields['metaKey'] = [
            'type' => 'String',
            'description' => 'Custom meta key for ordering',
        ];
        $fields['metaQuery'] = [
            'type' => ['list_of' => 'MetaQueryInput'],
            'description' => 'Filter articles by custom meta queries',
        ];
    }
    return $fields;
}, 10, 2);

add_filter('graphql_input_fields', function($fields, $type_name) {
    if ($type_name === 'RootQueryToJournalIssueConnectionWhereArgs') {
        $fields['metaKey'] = [
            'type' => 'String',
            'description' => 'Custom meta key for ordering',
        ];
        $fields['metaQuery'] = [
            'type' => ['list_of' => 'MetaQueryInput'],
            'description' => 'Filter journal issues by custom meta queries',
        ];
    }
    return $fields;
}, 10, 2);

// Add META_VALUE and META_VALUE_NUM to orderby enum
add_filter('graphql_PostObjectsConnectionOrderbyEnum_values', function($values) {
    $values['META_VALUE'] = [
        'value' => 'meta_value',
        'description' => 'Order by meta value',
    ];
    $values['META_VALUE_NUM'] = [
        'value' => 'meta_value_num',
        'description' => 'Order by numeric meta value',
    ];
    return $values;
});

// Register MetaQueryInput type
add_action('graphql_register_types', function() {
    register_graphql_input_type('MetaQueryInput', [
        'description' => 'Input for a meta query',
        'fields' => [
            'key' => [
                'type' => 'String',
                'description' => 'Custom field key',
            ],
            'value' => [
                'type' => ['list_of' => 'String'],
                'description' => 'Custom field value (or array of values)',
            ],
            'compare' => [
                'type' => 'String',
                'description' => 'Comparison operator to test',
            ],
            'type' => [
                'type' => 'String',
                'description' => 'Custom field type',
            ],
        ],
    ]);
});

function add_cors_http_header() {
    header("Access-Control-Allow-Origin: *");
}
add_action('init', 'add_cors_http_header');

function generate_thumbhash($attachment_id) {
    // Get the image path
    $image_path = get_attached_file($attachment_id);
    if (!$image_path) {
        error_log('Thumbhash: Could not get image path for attachment ' . $attachment_id);
        return false;
    }
    
    try {
        // Get mime type
        $mime_type = mime_content_type($image_path);
        error_log("Thumbhash: Processing {$mime_type} image: {$image_path}");

        // Create image resource
        $content = file_get_contents($image_path);
        $source = imagecreatefromstring($content);
        if (!$source) {
            error_log("Thumbhash: Failed to create image resource for {$mime_type}");
            return false;
        }

        // Get original dimensions
        $orig_width = imagesx($source);
        $orig_height = imagesy($source);
        error_log("Thumbhash: Original dimensions - {$orig_width}x{$orig_height}");

        // Calculate new dimensions (100px max)
        $max_dimension = 100;
        if ($orig_width > $orig_height) {
            $width = $max_dimension;
            $height = floor($orig_height * ($max_dimension / $orig_width));
        } else {
            $height = $max_dimension;
            $width = floor($orig_width * ($max_dimension / $orig_height));
        }
        error_log("Thumbhash: Resizing to {$width}x{$height}");

        // Resize image
        $resized = imagescale($source, $width, $height);
        if (!$resized) {
            error_log("Thumbhash: Failed to resize image");
            imagedestroy($source);
            return false;
        }

        // Convert to string
        ob_start();
        switch ($mime_type) {
            case 'image/png':
                $success = imagepng($resized);
                break;
            case 'image/jpeg':
                $success = imagejpeg($resized);
                break;
            case 'image/webp':
                $success = imagewebp($resized);
                break;
            default:
                $success = imagepng($resized); // fallback to PNG
                break;
        }
        $content = ob_get_clean();

        if (!$success || empty($content)) {
            error_log("Thumbhash: Failed to convert resized image to string");
            imagedestroy($source);
            imagedestroy($resized);
            return false;
        }

        // Clean up
        imagedestroy($source);
        imagedestroy($resized);

        // Now process with thumbhash
        if (extension_loaded('imagick')) {
            list($width, $height, $pixels) = \Thumbhash\extract_size_and_pixels_with_imagick($content);
        } else {
            list($width, $height, $pixels) = \Thumbhash\extract_size_and_pixels_with_gd($content);
        }

        // Generate thumbhash
        $hash = \Thumbhash\Thumbhash::RGBAToHash($width, $height, $pixels);
        
        // Convert to data URL (like in the example)
        $data_url = \Thumbhash\Thumbhash::toDataURL($hash);
        
        error_log("Thumbhash: Successfully generated hash for {$mime_type} image");
        return $data_url;

    } catch (\Exception $e) {
        error_log('Thumbhash: Error generating hash - ' . $e->getMessage());
        return false;
    }
}

// Hook to generate thumbhash when image is uploaded
function save_thumbhash_on_upload($attachment_id) {
    if (!wp_attachment_is_image($attachment_id)) {
        error_log('Thumbhash: Not an image attachment: ' . $attachment_id);
        return;
    }
    
    error_log('Thumbhash: Processing attachment ID: ' . $attachment_id);
    $data_url = generate_thumbhash($attachment_id);
    
    if ($data_url) {
        // Store the data URL directly
        update_post_meta($attachment_id, 'thumbhash', $data_url);
        error_log('Thumbhash: Successfully saved data URL for attachment ' . $attachment_id);
    } else {
        error_log('Thumbhash: Failed to generate thumbhash for attachment ' . $attachment_id);
    }
}
add_action('add_attachment', 'save_thumbhash_on_upload');

// Register thumbhash field in GraphQL
add_action('graphql_register_types', function() {
    register_graphql_field('MediaItem', 'thumbhash', [
        'type' => 'String',
        'description' => 'Thumbhash representation of the image',
        'resolve' => function($post) {
            return get_post_meta($post->ID, 'thumbhash', true);
        }
    ]);
});

// Optional: WP-CLI command to generate thumbhashes for existing images
if (defined('WP_CLI') && WP_CLI) {
    WP_CLI::add_command('generate-thumbhashes', function() {
        $args = array(
            'post_type' => 'attachment',
            'post_mime_type' => 'image',
            'post_status' => 'inherit',
            'posts_per_page' => -1,
        );
        
        $attachments = get_posts($args);
        
        WP_CLI::line(sprintf('Found %d images', count($attachments)));
        
        foreach ($attachments as $attachment) {
            $data_url = generate_thumbhash($attachment->ID);
            if ($data_url) {
                update_post_meta($attachment->ID, 'thumbhash', $data_url);
                WP_CLI::success(sprintf('Generated thumbhash for image %d', $attachment->ID));
            } else {
                WP_CLI::warning(sprintf('Failed to generate thumbhash for image %d', $attachment->ID));
            }
        }
    });
}

