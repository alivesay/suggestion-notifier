'use strict';

var _ = require('lodash');
var Mentat = require('mentat');

Mentat.models.Template.hook('afterCreate', function (template, options) {
  Mentat.controllers.EventsController.log({
    event: {
      type: 'templates:created',
      body: template
    },
    logFields: [ 'title' ]
  });
});

Mentat.models.Template.hook('afterUpdate', function (template, options) {
  Mentat.controllers.EventsController.log({
    event: {
      type: 'templates:updated',
      body: template
    },
    logFields: [ 'title' ]
  });
});

Mentat.models.Template.hook('afterDestroy', function (template, options) {
  Mentat.controllers.EventsController.log({
    event: {
      type: 'templates:deleted',
      body: template
    },
    logFields: [ 'title' ]
  });
});

function getTemplates(options, callback) {
  Mentat.models.Template
    .findAll(options.queryOptions)
    .nodeify(callback);
}

function getTemplateById(options, callback) {
  Mentat.models.Template
    .findById(options.id, options.queryOptions)
    .nodeify(callback);
}

function updateTemplate(options, callback) {
  Mentat.models.Template
    .findById(options.template.id)
    .then(function (template) {
      template
        .update(options.template, options.queryOptions)
        .nodeify(callback);
    })
    .catch(function (err) {
      return callback(err, null);
    });
}

function createTemplate(options, callback) {
  Mentat.models.Template
    .create(options.template, options.queryOptions)
    .nodeify(callback);
}

function deleteTemplateById(options, callback) {
  Mentat.models.Template
    .findById(options.id)
    .then(function (template) {
      template
        .destroy(options.queryOptions)
        .nodeify(callback);
    })
    .catch(function (err) {
      return callback(err, null);
    });
}

module.exports = new Mentat.Controller('Templates', {
  getTemplates: getTemplates,
  getTemplateById: getTemplateById,
  updateTemplate: updateTemplate,
  createTemplate: createTemplate,
  deleteTemplateById: deleteTemplateById
});