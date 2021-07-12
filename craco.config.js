const CracoLessPlugin = require('craco-less');

module.exports = {
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: {
                            '@font-family': 'Roboto, sans-serif',

                            // colors
                            '@color_primary': '#0199fc',
                            '@color_secondary': '#4267b2',
                            '@color_border': '#cfd2d4',
                            '@color_light': '#f5f6f7',
                            '@color_bg_gray': '#edf1f2',
                            '@color_sidebar_bg': ' #5f6e86',
                            '@color_sidebar_bg_hover': '#3d485a',
                            '@color_sidebar_color': '#a3abbb',
                            '@color_sidebar_color_hover': '#dcddec',
                            '@color_sidebar_customer_trial': '#f50',
                            '@color_sidebar_customer_premium': '#87d068',
                            '@color_bg_footer': '#162337',
                            '@color_card_border': '#cfd2d4',
                            '@color_select_background': '#fcfcfd',
                            '@color_select_border': '#cfd2d4',
                            '@color_select_icon_chevron_down_svgfill': '#848484',
                            '@color_table_row_dark': '#fafbfc',
                            '@color_table_footer_text': '#848484',
                            '@color_table_footer_background': '#ffffff',
                            '@color_card_header': '#f6f8f8',
                            '@color_text': '#101025',
                            '@color_text_bold': '#40484e',
                            '@color_primary_empty_page': '#0872d7',
                            '@color_info_1': '#6c6fbf',
                            '@color_dark': '#101025',
                            '@scrollbar_color': '#7a7c7e',
                            '@color_menu_item_selected': '#395b9e',

                            //  sizes
                            '@size_container': '1200px',
                            '@size_space': '15px',
                            '@size_border_radius': '2px',
                            '@size_header': '50px',
                            '@size-space': '15px',
                            '@color-border': '#e9ebee',

                            // Table
                            '@table-header-bg': ' @color_card_header',

                            '@border-color-base': '#cfd2d4',
                        },
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};
