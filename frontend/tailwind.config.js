module.exports = {
    content: [
        './*.{html,js,vue}',
        './pages/**/*.{html,js,vue}',
        './components/**/*.{html,js,vue}',
    ],
    plugins: [require('daisyui')],
    daisyui: {
        styled: true,
        themes: ["light", {
            dark: {
                ...require("daisyui/src/colors/themes")["[data-theme=night]"],
            }
        }],
        base: true,
        utils: true,
        logs: true,
        rtl: false,
        prefix: "",
    },
};
