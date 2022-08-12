module.exports = [
  'strapi::errors',
  'strapi::security',
  {
    name: "strapi::cors",
    config: {
      enabled: true,
      headers: '*',
      origin: ['https://smotrel.net', 'https://olsioradmin.smotrel.net', 'http://localhost:1337', 'http://localhost:8080'],
      keepHeaderOnError: true,
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
