'use strict';

var _ = require('lodash');
var Mentat = require('mentat');

Mentat.models.Template.hook('afterCreate', function (template, options) {
  Mentat.controllers.EventsController.log({
    type: 'templates:created',
    body: template
  }, {
    logFields: [ 'title' ]
  });
});

Mentat.models.Template.hook('afterUpdate', function (template, options) {
  Mentat.controllers.EventsController.log({
    type: 'templates:updated',
    body: template
  }, {
    logFields: [ 'title' ]
  });
});

Mentat.models.Template.hook('afterDestroy', function (template, options) {
  Mentat.controllers.EventsController.log({
    type: 'templates:deleted',
    body: template
  }, {
    logFields: [ 'title' ]
  });
});

function getTemplates(options, callback) {
  Mentat.models.Template
    .findAll(options)
    .nodeify(callback);
}

function getTemplateById(id, options, callback) {
  Mentat.models.Template
    .findById(id, options)
    .nodeify(callback);
}

function updateTemplate(template, options, callback) {
  Mentat.models.Template
    .findById(template.id)
    .then(function (templateInstance) {
      templateInstance
        .update(template, options)
        .nodeify(callback);
    })
    .catch(function (err) {
      return callback(err, null);
    });
}

function createTemplate(template, options, callback) {
  Mentat.models.Template
    .create(template, options)
    .nodeify(callback);
}

function deleteTemplateById(id, options, callback) {
  Mentat.models.Template
    .findById(id)
    .then(function (template) {
      template
        .destroy(options)
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