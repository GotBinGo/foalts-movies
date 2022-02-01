// std
import { strictEqual } from 'assert';

// 3p
import { Context, createController, getHttpMethod, getPath, isHttpResponseOK } from '@foal/core';

// App
import { ApiController } from './api.controller';

describe('ApiController', () => {

  describe('has a "search" method that', () => {

    it('should handle requests at GET /.', () => {
      strictEqual(getHttpMethod(ApiController, 'search'), 'GET');
      strictEqual(getPath(ApiController, 'search'), '/search');
    });

  });
});
