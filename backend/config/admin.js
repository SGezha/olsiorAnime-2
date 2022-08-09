module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '4ca8d9f007f118549c329e6d88e075cd'),
  },
});
