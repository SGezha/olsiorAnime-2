'use strict';

/**
 * time-mark service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::time-mark.time-mark');
