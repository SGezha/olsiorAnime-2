'use strict';

/**
 *  donate controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::donate.donate');
