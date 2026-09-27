<?php
/**
 * Plugin Name: Herb Effectiveness Calculator (HEC)
 * Plugin URI: https://www.tabeebpedia.com
 * Description: A calculator that allows users to select herbs from six categories and calculate their effectiveness based on weight.
 * Version: 1.2
 * Author: S.A.Wahab
 * Author URI: https://www.Nuktaguidance.com
 * License: GPL2
 */

// Enqueue necessary scripts and styles
function hec_enqueue_scripts() {
    wp_enqueue_script('jquery');
    wp_enqueue_script('jquery-ui-autocomplete');
    wp_enqueue_style('hec-style', plugin_dir_url(__FILE__) . 'style.css');
    wp_enqueue_style('jquery-ui-css', 'https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css');
}
add_action('wp_enqueue_scripts', 'hec_enqueue_scripts');

// Define the categories and their effectiveness values
function hec_get_category_effectiveness() {
    return [
        'خشک گرم' => ['گرم' => 30, 'سرد' => 0, 'خشک' => 70, 'تر' => 0],
        'گرم خشک' => ['گرم' => 70, 'سرد' => 0, 'خشک' => 30, 'تر' => 0],
        'گرم تر' => ['گرم' => 70, 'سرد' => 0, 'خشک' => 0, 'تر' => 30],
        'تر گرم' => ['گرم' => 30, 'سرد' => 0, 'خشک' => 0, 'تر' => 70],
        'تر سرد' => ['گرم' => 0, 'سرد' => 30, 'خشک' => 0, 'تر' => 70],
        'خشک سرد' => ['گرم' => 0, 'سرد' => 30, 'خشک' => 70, 'تر' => 0]
    ];
}

// Define the allowed categories
function hec_get_allowed_categories() {
    return [
        'خشک گرم', 'گرم خشک', 'گرم تر', 'تر گرم', 'تر سرد', 'خشک سرد'
    ];
}

// Shortcode to display the herb effectiveness calculator
function hec_display_effectiveness_calculator() {
    $output = '<div id="hec-container">';
    $output .= '<h2>Herb Effectiveness Calculator</h2>';
    $output .= '<p>Select a herb from the categories below and enter its weight in grams.</p>';
    $output .= '<form id="hec-form">';
    $output .= '<label for="hec-herb-names">Start typing herb names:</label>';
    $output .= '<input type="text" id="hec-herb-names" name="hec_herb_names">';
    $output .= '<label for="hec-herb-weight">Enter weight (in grams):</label>';
    $output .= '<input type="number" id="hec-herb-weight" name="hec_herb_weight" min="1">';
    $output .= '<button type="button" id="hec-add-herb-btn">Add Herb</button>';
    $output .= '<ul id="hec-selected-herbs"></ul>';
    $output .= '<button type="button" id="hec-calculate-btn">Calculate Effectiveness</button>';
    $output .= '</form>';

    // Results display
    $output .= '<div id="hec-results">';
    $output .= '<h3>Results:</h3>';
    $output .= '<table>';
    $output .= '<tr><th>Type</th><th>Percentage</th><th>Amount</th></tr>';
    $output .= '<tr><td>گرم</td><td><span id="hec-warm-percentage">0%</span></td><td><span id="hec-warm-amount">0</span></td></tr>';
    $output .= '<tr><td>خشک</td><td><span id="hec-dry-percentage">0%</span></td><td><span id="hec-dry-amount">0</span></td></tr>';
    $output .= '<tr><td>سرد</td><td><span id="hec-cold-percentage">0%</span></td><td><span id="hec-cold-amount">0</span></td></tr>';
    $output .= '<tr><td>تر</td><td><span id="hec-wet-percentage">0%</span></td><td><span id="hec-wet-amount">0</span></td></tr>';
    $output .= '</table>';
    $output .= '</div>';
    $output .= '</div>';

    return $output;
}
add_shortcode('hec_effectiveness_calculator', 'hec_display_effectiveness_calculator');

// Ajax handler to search posts for autocomplete
function hec_search_posts() {
    $term = sanitize_text_field($_GET['term']);
    $allowed_categories = hec_get_allowed_categories();

    // Fetch posts based on the search term and allowed categories
    $posts = get_posts([
        's' => $term,
        'numberposts' => -1, // Retrieve all posts matching the search term
        'post_type' => 'post'
    ]);
    
    $post_titles = [];
    foreach ($posts as $post) {
        $categories = get_the_category($post->ID);
        foreach ($categories as $category) {
            if (in_array($category->name, $allowed_categories)) {
                $post_titles[] = $post->post_title;
                break; // No need to check other categories if already matched
            }
        }
    }
    
    // Ensure unique post titles in search results
    $post_titles = array_unique($post_titles);
    wp_send_json($post_titles);
}
add_action('wp_ajax_hec_search_posts', 'hec_search_posts');
add_action('wp_ajax_nopriv_hec_search_posts', 'hec_search_posts');

// Ajax handler to calculate effectiveness percentages based on selected herbs
function hec_calculate_effectiveness_percentages() {
    if (isset($_POST['herb_names']) && isset($_POST['herb_weights'])) {
        $herb_names = $_POST['herb_names'];
        $herb_weights = $_POST['herb_weights'];
        $category_effectiveness = hec_get_category_effectiveness();
        
        $warm_total = 0;
        $dry_total = 0;
        $cold_total = 0;
        $wet_total = 0;
        $grand_total = 0;

        foreach ($herb_names as $index => $herb_name) {
            $herb_weight = $herb_weights[$index]; // Get the corresponding weight
            $post = get_page_by_title($herb_name, OBJECT, 'post');

            if ($post) {
                $categories = get_the_category($post->ID);
                foreach ($categories as $category) {
                    $category_name = $category->name;
                    
                    if (isset($category_effectiveness[$category_name])) {
                        $effectiveness = $category_effectiveness[$category_name];

                        $warm_total += ($effectiveness['گرم'] * $herb_weight) / 100;
                        $dry_total += ($effectiveness['خشک'] * $herb_weight) / 100;
                        $cold_total += ($effectiveness['سرد'] * $herb_weight) / 100;
                        $wet_total += ($effectiveness['تر'] * $herb_weight) / 100;
                    }
                }
            }
        }

        $grand_total = $warm_total + $dry_total + $cold_total + $wet_total;

        // Prepare the final results
        $results = [
            'warm_percentage' => ($grand_total > 0) ? number_format(($warm_total / $grand_total) * 100, 2) . '%' : '0%',
            'dry_percentage' => ($grand_total > 0) ? number_format(($dry_total / $grand_total) * 100, 2) . '%' : '0%',
            'cold_percentage' => ($grand_total > 0) ? number_format(($cold_total / $grand_total) * 100, 2) . '%' : '0%',
            'wet_percentage' => ($grand_total > 0) ? number_format(($wet_total / $grand_total) * 100, 2) . '%' : '0%',
            'warm_amount' => number_format($warm_total, 2),
            'dry_amount' => number_format($dry_total, 2),
            'cold_amount' => number_format($cold_total, 2),
            'wet_amount' => number_format($wet_total, 2),
        ];

        wp_send_json($results);
    }
    wp_die();
}
add_action('wp_ajax_hec_calculate', 'hec_calculate_effectiveness_percentages');
add_action('wp_ajax_nopriv_hec_calculate', 'hec_calculate_effectiveness_percentages');

// Add JavaScript for autocomplete, form handling, and effectiveness calculation
function hec_add_ajax_script() {
?>
    <script type="text/javascript">
    jQuery(document).ready(function($) {
        // Autocomplete functionality for herb names
        $('#hec-herb-names').autocomplete({
            source: function(request, response) {
                $.ajax({
                    url: "<?php echo admin_url('admin-ajax.php'); ?>",
                    data: {
                        action: 'hec_search_posts',
                        term: request.term
                    },
                    success: function(data) {
                        response(data);
                    }
                });
            }
        });

        // Add selected herb to the list
        $('#hec-add-herb-btn').click(function() {
            var herbName = $('#hec-herb-names').val();
            var herbWeight = $('#hec-herb-weight').val();

            if (herbName && herbWeight) {
                $('#hec-selected-herbs').append(
                    '<li>' + herbName + ' (' + herbWeight + 'g) ' + 
                    '<button type="button" class="hec-remove-herb-btn">Remove</button>' + 
                    '<input type="hidden" name="herb_names[]" value="' + herbName + '">' +
                    '<input type="hidden" name="herb_weights[]" value="' + herbWeight + '">'
                );
                $('#hec-herb-names').val('');
                $('#hec-herb-weight').val('');
            }
        });

        // Calculate effectiveness when button is clicked
        $('#hec-calculate-btn').click(function() {
            var herbNames = [];
            var herbWeights = [];
            $('#hec-selected-herbs li').each(function() {
                var herbName = $(this).find('input[name="herb_names[]"]').val();
                var herbWeight = $(this).find('input[name="herb_weights[]"]').val();
                herbNames.push(herbName);
                herbWeights.push(herbWeight);
            });

            $.ajax({
                url: "<?php echo admin_url('admin-ajax.php'); ?>",
                type: "POST",
                data: {
                    action: 'hec_calculate',
                    herb_names: herbNames,
                    herb_weights: herbWeights
                },
                success: function(data) {
                    $('#hec-warm-percentage').text(data.warm_percentage);
                    $('#hec-dry-percentage').text(data.dry_percentage);
                    $('#hec-cold-percentage').text(data.cold_percentage);
                    $('#hec-wet-percentage').text(data.wet_percentage);
                    $('#hec-warm-amount').text(data.warm_amount);
                    $('#hec-dry-amount').text(data.dry_amount);
                    $('#hec-cold-amount').text(data.cold_amount);
                    $('#hec-wet-amount').text(data.wet_amount);
                }
            });
        });

        // Remove selected herb from the list
        $(document).on('click', '.hec-remove-herb-btn', function() {
            $(this).parent().remove();
        });
    });
    </script>
<?php
}
add_action('wp_footer', 'hec_add_ajax_script');
