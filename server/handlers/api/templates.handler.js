'use strict';

var Mentat = require('mentat');

module.exports = new Mentat.Handler('Templates', {
  routes: [
    { method: 'GET', path: '/api/templates/{id?}' },
    { method: 'POST', path: '/api/templates/{id?}' },
    { method: 'DELETE', path: '/api/templates/{id}' }
  ],

  GET: function (request, reply) {
    if (request.params.id) {
      return Mentat.controllers.TemplatesController
        .getTemplateById({ id: request.params.id },
          Mentat.Handler.buildDefaultResponder(reply));
    }

    return Mentat.controllers.TemplatesController
      .getTemplates({}, Mentat.Handler.buildDefaultResponder(reply));
  },

  POST: function (request, reply) {
    if (request.params.id) {
      return Mentat.controllers.TemplatesController
        .updateTemplate({ template: request.payload },
          Mentat.Handler.buildDefaultResponder(reply));
    }

    return Mentat.controllers.TemplatesController
      .createTemplate({ template: request.payload },
        Mentat.Handler.buildDefaultResponder(reply));
  },

  DELETE: function (request, reply) {
    return Mentat.controllers.TemplatesController
      .deleteTemplateById({ id: request.params.id },
        Mentat.Handler.buildDefaultResponder(reply));
  }

});