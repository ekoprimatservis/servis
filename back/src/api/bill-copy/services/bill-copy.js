'use strict';

/**
 * bill-copy service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::bill-copy.bill-copy');
