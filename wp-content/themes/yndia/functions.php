<?php
add_theme_support('post-thumbnails');

// Remove o bloqueio do WordPress para o upload de arquivos .svg:
function add_svg_to_upload_mimes( $upload_mimes ) {
	$upload_mimes['svg'] = 'image/svg+xml';
	$upload_mimes['svgz'] = 'image/svg+xml';
	return $upload_mimes;
}

add_filter('upload_mimes', 'add_svg_to_upload_mimes', 10, 1);

// Registra os menus do tema
function register_yndia_menus() {
	register_nav_menus( array(
		'main_menu_desktop' => 'Menu Principal Desktop',
		'main_menu_mobile' => 'Menu Principal Mobile',
		'social_menu' => 'Menu de redes sociais',
	) );
}

add_action('init', 'register_yndia_menus');

// Habilita o polylang na REST API
function enable_polylang_rest_responses() {
	global $polylang;

	$default = pll_default_language();
	$langs = pll_languages_list();
	$cur_lang = $_GET['lang'];

	if (!in_array($cur_lang, $langs)) {
		$cur_lang = $default;
	}

	$polylang->curlang = $polylang->model->get_language($cur_lang);

	$GLOBALS['text_direction'] = $polylang->curlang->is_rtl ? 'rtl' : 'ltr';
}

add_action('rest_api_init', 'enable_polylang_rest_responses');

/////
function xcompile_post_type_labels($singular = 'Post', $plural = 'Posts') {
    $p_lower = strtolower($plural);
    $s_lower = strtolower($singular);

    return [
        'name' => $plural,
        'singular_name' => $singular,
        'add_new_item' => "New $singular",
        'edit_item' => "Edit $singular",
        'view_item' => "View $singular",
        'view_items' => "View $plural",
        'search_items' => "Search $plural",
        'not_found' => "No $p_lower found",
        'not_found_in_trash' => "No $p_lower found in trash",
        'parent_item_colon' => "Parent $singular",
        'all_items' => "All $plural",
        'archives' => "$singular Archives",
        'attributes' => "$singular Attributes",
        'insert_into_item' => "Insert into $s_lower",
        'uploaded_to_this_item' => "Uploaded to this $s_lower",
    ];
}

function add_text_editor_meta_box(WP_Post $post, $field_name, $box_title) {
    add_meta_box($field_name . '_meta', $box_title, function () use ($post, $field_name) {
        $field_value = get_post_meta($post->ID, $field_name, true);
        $nonce = $field_name . '_nonce';

        wp_nonce_field($nonce, $nonce);
        wp_editor($field_value, $field_name, array('wpautop' => false));
    });
}

function register_input_meta_box(WP_Post $post, $field_name, $box_title) {
    add_meta_box($field_name . '_meta',
        $box_title,
        function () use ($post, $field_name) {
            $field_value = get_post_meta($post->ID, $field_name, true);
            $nonce = $field_name . '_nonce';

            wp_nonce_field($nonce, $nonce);
            ?>
            <input id="<?php echo $field_name; ?>"
                   name="<?php echo $field_name; ?>"
                   type="text"
                   value="<?php echo esc_attr($field_value); ?>"
                   style="width: 100%;">
            <?php
        });
}

function register_image_meta_box(WP_POST $post, $post_type, $field_name, $title) {
    $meta_box_id = $field_name . '_meta';

    add_meta_box($meta_box_id, $title, function () use ($post, $field_name, $meta_box_id) {
        $post_meta = get_post_meta($post->ID);
        $field_value = $post_meta[$field_name];
        $nonce_field = $field_name . '_nonce';

        wp_nonce_field($nonce_field, $nonce_field);
        ?>
        <p class="hide-if-has-image">
            <a href="" class="<?php echo $field_name; ?>-upload">Definir imagem</a>
        </p>
        <p class="hide-if-has-no-image">
            <a href="" class="<?php echo $field_name; ?>-upload">
                <img style="width: auto; max-height: 200px;" id="<?php echo $field_name; ?>-preview" src="">
            </a>
        </p>
        <p class="hide-if-has-no-image">Clique na imagem para editá-la ou atualizá-la.</p>
        <p class="hide-if-has-no-image">
            <a href="" class="<?php echo $field_name; ?>-clear">Remover imagem</a>
        </p>
        <input type="hidden" name="<?php echo $field_name; ?>" id="<?php echo $field_name; ?>" value="<?php if (isset($post_meta[$field_name])){ echo $post_meta[$field_name][0]; } ?>" />

        <script>
            jQuery('#<?php echo $meta_box_id; ?> .<?php echo $field_name; ?>-upload').click((event) => {
                event.preventDefault();

                const send_attachment_bkp = wp.media.editor.send.attachment;

                wp.media.editor.send.attachment = (props, attachment) => {
                    jQuery('#<?php echo $meta_box_id; ?> .hide-if-has-image').hide();
                    jQuery('#<?php echo $meta_box_id; ?> .hide-if-has-no-image').show();
                    jQuery('#<?php echo $field_name; ?>').val(attachment.url);
                    jQuery('#<?php echo $field_name; ?>-preview').attr('src', attachment.url);
                    wp.media.editor.send.attachment = send_attachment_bkp;
                };

                wp.media.editor.open();

                return false;
            });

            jQuery('.<?php echo $field_name; ?>-clear').click((event) => {
                event.preventDefault();

                jQuery('#<?php echo $meta_box_id; ?> .hide-if-has-image').show();
                jQuery('#<?php echo $meta_box_id; ?> .hide-if-has-no-image').hide();
                jQuery('#<?php echo $field_name; ?>').val('');
                jQuery('#<?php echo $field_name; ?>-preview').attr('src', '');
                wp.media.editor.send.attachment = '';
            });

            <?php if (isset($field_value) && $field_value[0]): ?>
            jQuery('#<?php echo $meta_box_id; ?> .hide-if-has-image').hide();
            jQuery('#<?php echo $field_name; ?>-preview').attr('src', '<?php echo $field_value[0]; ?>');
            <?php endif; ?>
            <?php if (!isset($field_value) || !$field_value[0]): ?>
            jQuery('#<?php echo $meta_box_id; ?> .hide-if-has-no-image').hide();
            <?php endif; ?>
        </script>
        <?php
    }, $post_type, 'side', 'low');
}

function update_custom_field($post_id, $post_type, $field_name) {
    $post = get_post($post_id);
    $is_revision = wp_is_post_revision($post_id);

    if ($post->post_type !== $post_type || $is_revision) {
        return;
    }

    if (!isset($_POST[$field_name])) {
        return;
    }

    $nonce_field = $field_name . '_nonce';

    if (!check_admin_referer($nonce_field, $nonce_field)) {
        return;
    }

    $field_value = trim($_POST[$field_name]);

    if (!empty_str($field_value)) {
        update_post_meta($post_id, $field_name, $field_value);
    } else if (empty_str($field_value)) {
        delete_post_meta($post_id, $field_name);
    }
}

function empty_str( $str ) {
    return !isset($str) || $str === "";
}

function register_custom_post_type(
    $post_type,
    $singular_cpt_title,
    $plural_cpt_title,
    $rest_base,
    $cpt_supports,
    $admin_menu_icon,
    $register_meta_box_cb = false) {
    $labels = xcompile_post_type_labels($singular_cpt_title, $plural_cpt_title);
    $supports = $cpt_supports;
    $arguments = [
        'show_in_rest' => true,
        'rest_base' => $rest_base,
        'supports' => $supports,
        'public' => true,
        'show_in_admin_bar' => true,
        'menu_icon' => $admin_menu_icon,
        'labels' => $labels,
    ];

    if (isset($register_meta_box_cb)) {
        $arguments['register_meta_box_cb'] = $register_meta_box_cb;
    }

    register_post_type($post_type, $arguments);
}

function register_cpt_cf_rest_field($post_type, $field_name) {
    register_rest_field($post_type, $field_name, array(
        'get_callback' => function($cp) use ($field_name) {
            return get_post_meta($cp['id'], $field_name, true);
        },
        'schema' => array('type' => 'string'),
    ));
}

function register_cpt_thumb_rest_field($post_type, $field_name) {
    register_rest_field($post_type, $field_name, array(
        'get_callback' => function ($cp) {
            return get_the_post_thumbnail_url($cp['id'], 'full');
        },
        'schema' => array('type' => 'string'),
    ));
}

// ELEMENTOS DO RÓTULO
function register_label_element_post_type() {
    register_custom_post_type(
        'label_element',
        'Elemento do Rótulo',
        'Elementos do Rótulo',
        'label-elements',
        array('title', 'editor'),
        'dashicons-welcome-view-site',
        'add_label_element_meta_boxes');
}

function register_label_element_rest_fields() {
    $post_type = 'label_element';

    register_cpt_cf_rest_field($post_type, 'label_element_id');
    register_cpt_cf_rest_field($post_type, 'label_element_classic_image');
    register_cpt_cf_rest_field($post_type, 'label_element_extradry_image');
}

function add_label_element_meta_boxes(WP_Post $post) {
    $post_type = 'label_element';

    register_input_meta_box($post, 'label_element_id', 'ID');
    register_image_meta_box($post, $post_type, 'label_element_classic_image', 'Imagem na versão Yndiá Clássica');
    register_image_meta_box($post, $post_type, 'label_element_extradry_image', 'Imagem na versão Extra-Dry');
}

function update_label_element_custom_fields($post_id) {
    $post_type = 'label_element';

    update_custom_field($post_id, $post_type, 'label_element_id');
    update_custom_field($post_id, $post_type, 'label_element_classic_image');
    update_custom_field($post_id, $post_type, 'label_element_extradry_image');
}

add_action('init', 'register_label_element_post_type');
add_action('save_post', 'update_label_element_custom_fields');
add_action('rest_api_init', 'register_label_element_rest_fields');

// REVENDEDORES
function register_retailer_post_type() {
    register_custom_post_type(
        'retailer',
        'Revendedor',
        'Revendedores',
        'retailers',
        array('title'),
        'dashicons-welcome-view-site',
        'register_retailer_meta_boxes');
}

function register_retailer_rest_fields() {
    $post_type = 'retailer';

    register_cpt_cf_rest_field($post_type, 'retailer_address_1');
    register_cpt_cf_rest_field($post_type, 'retailer_address_2');
}

function register_retailer_meta_boxes(WP_Post $post) {
    register_input_meta_box($post, 'retailer_address_1', 'Endereço 1');
    register_input_meta_box($post, 'retailer_address_2', 'Endereço 2');
}

function update_retailer_custom_fields($post_id) {
    $post_type = 'retailer';

    update_custom_field($post_id, $post_type, 'retailer_address_1');
    update_custom_field($post_id, $post_type, 'retailer_address_2');
}

add_action('init', 'register_retailer_post_type');
add_action('save_post', 'update_retailer_custom_fields');
add_action('rest_api_init', 'register_retailer_rest_fields');

// ELEMENTOS DA CARBONATAÇÃO
function register_carbonation_element_post_type() {
    register_custom_post_type(
        'carbonation_element',
        'Elemento da Carbonatação',
        'Elementos da Carbonatação',
        'carbonation-elements',
        array('title', 'editor', 'thumbnail'),
        'dashicons-welcome-view-site',
        'register_carbonation_element_meta_box');
}

function register_carbonation_element_rest_fields() {
    $post_type = 'carbonation_element';

    register_cpt_cf_rest_field($post_type, 'carbonation_element_id');
    register_cpt_thumb_rest_field($post_type, 'carbonation_element_image');
}

function register_carbonation_element_meta_box(WP_Post $post) {
    register_input_meta_box($post, 'carbonation_element_id', 'ID');
}

function update_carbonation_element_custom_field($post_id) {
    update_custom_field($post_id, 'carbonation_element', 'carbonation_element_id');
}

add_action('init', 'register_carbonation_element_post_type');
add_action('save_post', 'update_carbonation_element_custom_field');
add_action('rest_api_init', 'register_carbonation_element_rest_fields');

// MANIFESTOS
function register_manifesto_post_type() {
    register_custom_post_type(
        'manifesto',
        'Manifesto',
        'Manifestos',
        'manifestos',
        array('title', 'editor', 'thumbnail'),
        'dashicons-welcome-view-site');
}

function register_manifesto_rest_fields() {
    register_cpt_thumb_rest_field('manifesto', 'manifesto_image');
}

add_action('init', 'register_manifesto_post_type');
add_action('rest_api_init', 'register_manifesto_rest_fields');

// RÓTULOS DA GARRAFA
function register_bottle_label_post_type() {
    register_custom_post_type(
        'bottle_label',
        'Rótulo',
        'Rótulos',
        'bottle-labels',
        array('title', 'editor', 'thumbnail'),
        'dashicons-welcome-view-site',
        'register_bottle_label_meta_boxes');
}

function register_bottle_label_rest_fields() {
    $post_type = 'bottle_label';

    register_cpt_cf_rest_field($post_type, 'bottle_label_id');
    register_cpt_cf_rest_field($post_type, 'bottle_label_title');
    register_cpt_thumb_rest_field($post_type, 'bottle_label_image');
}

function register_bottle_label_meta_boxes(WP_POST $post) {
    register_input_meta_box($post, 'bottle_label_title', 'Título');
    register_input_meta_box($post, 'bottle_label_id', 'ID');
}

function position_bottle_label_title_meta_box(WP_POST $post) {
	$post_type = 'bottle_label';

	if ($post->post_type !== $post_type) {
		return;
	}

    global $wp_meta_boxes;

    do_meta_boxes(get_current_screen(), 'advanced', $post);

    unset($wp_meta_boxes[$post_type]['advanced']);
}

function update_bottle_label_custom_fields($post_id) {
    $post_type = 'bottle_label';

    update_custom_field($post_id, $post_type, 'bottle_label_id');
    update_custom_field($post_id, $post_type, 'bottle_label_title');
}

add_action('init', 'register_bottle_label_post_type');
add_action('rest_api_init', 'register_bottle_label_rest_fields');
add_action('edit_form_after_title', 'position_bottle_label_title_meta_box');
add_action('save_post', 'update_bottle_label_custom_fields');

// COCKTAILS
function register_cocktail_post_type() {
    register_custom_post_type(
        'cocktail',
        'Cocktail',
        'Cocktails',
        'cocktails',
        array('title', 'thumbnail'),
        'dashicons-welcome-view-site',
        'register_cocktail_meta_boxes');
}

function register_cocktail_rest_fields() {
    $post_type = 'cocktail';

    register_cpt_cf_rest_field($post_type, 'cocktail_specifications');
    register_cpt_cf_rest_field($post_type, 'cocktail_ingredients');
    register_cpt_cf_rest_field($post_type, 'cocktail_directions');
    register_cpt_cf_rest_field($post_type, '');
    register_cpt_thumb_rest_field($post_type, 'cocktail_image');
}

function register_cocktail_meta_boxes(WP_POST $post) {
    add_text_editor_meta_box($post, 'cocktail_specifications', 'Especificações');
    add_text_editor_meta_box($post, 'cocktail_ingredients', 'Ingredientes');
    add_text_editor_meta_box($post, 'cocktail_directions', 'Preparação');
}

function update_cocktail_custom_fields($post_id) {
    $post_type = 'cocktail';

    update_custom_field($post_id, $post_type, 'cocktail_specifications');
    update_custom_field($post_id, $post_type, 'cocktail_ingredients');
    update_custom_field($post_id, $post_type, 'cocktail_directions');
}

add_action('init', 'register_cocktail_post_type');
add_action('rest_api_init', 'register_cocktail_rest_fields');
add_action('save_post', 'update_cocktail_custom_fields');

// MENU
function get_menu_by_location($location_name) {
	$locations = get_nav_menu_locations();
	$menu_id = $locations[$location_name] ;
	$menu = wp_get_nav_menu_object($menu_id);
	$menu_items = wp_get_nav_menu_items($menu);

	return $menu_items;
}

function get_main_desktop_menu() {
	return get_menu_by_location('main_menu_desktop');
}

function get_main_mobile_menu() {
	return get_menu_by_location('main_menu_mobile');
}

function get_social_menu() {
	return get_menu_by_location('social_menu');
}

function get_languages_menu() {
	if (function_exists('pll_the_languages')) {
		return pll_the_languages(array('raw'=>1));
	}

	return null;
}

function registerYndiaMenuRestRoute() {
	register_rest_route(
		'wp/v2', 'menus/main-menu-desktop',
		array(
			'methods' => 'GET',
			'callback' => 'get_main_desktop_menu',
		));

	register_rest_route(
        'wp/v2', 'menus/main-menu-mobile',
        array(
            'methods' => 'GET',
            'callback' => 'get_main_mobile_menu'
        ));

	register_rest_route(
		'wp/v2', 'menus/social-menu',
		array(
			'methods' => 'GET',
			'callback' => 'get_social_menu',
		));

	register_rest_route(
		'wp/v2', 'menus/languages-menu',
		array(
			'methods' => 'GET',
			'callback' => 'get_languages_menu',
		));
}

add_action('rest_api_init', 'registerYndiaMenuRestRoute');
