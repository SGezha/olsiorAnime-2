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
        }, "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "coffee", "winter"],
        base: true,
        utils: true,
        logs: true,
        rtl: false,
        prefix: "",
    },
};
