define('web-client/tests/app.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - app.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint.\n');
  });
});
define('web-client/tests/authenticators/oauth2.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - authenticators/oauth2.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'authenticators/oauth2.js should pass ESLint.\n');
  });
});
define('web-client/tests/authenticators/torii.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - authenticators/torii.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'authenticators/torii.js should pass ESLint.\n');
  });
});
define('web-client/tests/controllers/application.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - controllers/application.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'controllers/application.js should pass ESLint.\n31:11  - Unexpected console statement. (no-console)\n37:10  - \'error\' is defined but never used. (no-unused-vars)');
  });
});
define('web-client/tests/helpers/destroy-app', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = destroyApp;

  function destroyApp(application) {
    _ember['default'].run(application, 'destroy');
  }
});
define('web-client/tests/helpers/destroy-app.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - helpers/destroy-app.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/destroy-app.js should pass ESLint.\n');
  });
});
define('web-client/tests/helpers/ember-simple-auth', ['exports', 'ember-simple-auth/authenticators/test'], function (exports, _emberSimpleAuthAuthenticatorsTest) {
  exports.authenticateSession = authenticateSession;
  exports.currentSession = currentSession;
  exports.invalidateSession = invalidateSession;

  var TEST_CONTAINER_KEY = 'authenticator:test';

  function ensureAuthenticator(app, container) {
    var authenticator = container.lookup(TEST_CONTAINER_KEY);
    if (!authenticator) {
      app.register(TEST_CONTAINER_KEY, _emberSimpleAuthAuthenticatorsTest['default']);
    }
  }

  function authenticateSession(app, sessionData) {
    var container = app.__container__;

    var session = container.lookup('service:session');
    ensureAuthenticator(app, container);
    session.authenticate(TEST_CONTAINER_KEY, sessionData);
    return wait();
  }

  ;

  function currentSession(app) {
    return app.__container__.lookup('service:session');
  }

  ;

  function invalidateSession(app) {
    var session = app.__container__.lookup('service:session');
    if (session.get('isAuthenticated')) {
      session.invalidate();
    }
    return wait();
  }

  ;
});
define('web-client/tests/helpers/module-for-acceptance', ['exports', 'qunit', 'ember', 'web-client/tests/helpers/start-app', 'web-client/tests/helpers/destroy-app'], function (exports, _qunit, _ember, _webClientTestsHelpersStartApp, _webClientTestsHelpersDestroyApp) {
  var Promise = _ember['default'].RSVP.Promise;

  exports['default'] = function (name) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    (0, _qunit.module)(name, {
      beforeEach: function beforeEach() {
        this.application = (0, _webClientTestsHelpersStartApp['default'])();

        if (options.beforeEach) {
          return options.beforeEach.apply(this, arguments);
        }
      },

      afterEach: function afterEach() {
        var _this = this;

        var afterEach = options.afterEach && options.afterEach.apply(this, arguments);
        return Promise.resolve(afterEach).then(function () {
          return (0, _webClientTestsHelpersDestroyApp['default'])(_this.application);
        });
      }
    });
  };
});
define('web-client/tests/helpers/module-for-acceptance.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - helpers/module-for-acceptance.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/module-for-acceptance.js should pass ESLint.\n');
  });
});
define('web-client/tests/helpers/resolver', ['exports', 'web-client/resolver', 'web-client/config/environment'], function (exports, _webClientResolver, _webClientConfigEnvironment) {

  var resolver = _webClientResolver['default'].create();

  resolver.namespace = {
    modulePrefix: _webClientConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _webClientConfigEnvironment['default'].podModulePrefix
  };

  exports['default'] = resolver;
});
define('web-client/tests/helpers/resolver.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - helpers/resolver.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/resolver.js should pass ESLint.\n');
  });
});
define('web-client/tests/helpers/start-app', ['exports', 'ember', 'web-client/app', 'web-client/config/environment'], function (exports, _ember, _webClientApp, _webClientConfigEnvironment) {
  exports['default'] = startApp;

  function startApp(attrs) {
    var application = undefined;

    var attributes = _ember['default'].merge({}, _webClientConfigEnvironment['default'].APP);
    attributes = _ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    _ember['default'].run(function () {
      application = _webClientApp['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }
});
define('web-client/tests/helpers/start-app.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - helpers/start-app.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/start-app.js should pass ESLint.\n');
  });
});
define('web-client/tests/helpers/torii', ['exports'], function (exports) {
  exports.stubValidSession = stubValidSession;

  function stubValidSession(application, sessionData) {
    var session = application.__container__.lookup('service:session');
    var sm = session.get('stateMachine');
    Ember.run(function () {
      sm.send('startOpen');
      sm.send('finishOpen', sessionData);
    });
  }
});
define('web-client/tests/resolver.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - resolver.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass ESLint.\n');
  });
});
define('web-client/tests/router.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - router.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass ESLint.\n');
  });
});
define('web-client/tests/routes/application.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - routes/application.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/application.js should pass ESLint.\n');
  });
});
define('web-client/tests/services/current-user.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - services/current-user.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'services/current-user.js should pass ESLint.\n');
  });
});
define('web-client/tests/test-helper', ['exports', 'web-client/tests/helpers/resolver', 'ember-qunit'], function (exports, _webClientTestsHelpersResolver, _emberQunit) {

  (0, _emberQunit.setResolver)(_webClientTestsHelpersResolver['default']);
});
define('web-client/tests/test-helper.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - test-helper.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint.\n');
  });
});
define('web-client/tests/torii-providers/dropbox-oauth2.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - torii-providers/dropbox-oauth2.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'torii-providers/dropbox-oauth2.js should pass ESLint.\n');
  });
});
define('web-client/tests/unit/services/current-user-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('service:current-user', 'Unit | Service | current user', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });
});
define('web-client/tests/unit/services/current-user-test.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('ESLint - unit/services/current-user-test.js');
  QUnit.test('should pass ESLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/current-user-test.js should pass ESLint.\n');
  });
});
define('web-client/tests/web-client/templates/about.template-lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('TemplateLint - web-client/templates/about.hbs');
  QUnit.test('should pass TemplateLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'web-client/templates/about.hbs should pass TemplateLint.\n');
  });
});
define('web-client/tests/web-client/templates/application.template-lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('TemplateLint - web-client/templates/application.hbs');
  QUnit.test('should pass TemplateLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'web-client/templates/application.hbs should pass TemplateLint.\n');
  });
});
define('web-client/tests/web-client/templates/index.template-lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('TemplateLint - web-client/templates/index.hbs');
  QUnit.test('should pass TemplateLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'web-client/templates/index.hbs should pass TemplateLint.\n');
  });
});
define('web-client/tests/web-client/templates/privacy.template-lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('TemplateLint - web-client/templates/privacy.hbs');
  QUnit.test('should pass TemplateLint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'web-client/templates/privacy.hbs should pass TemplateLint.\n');
  });
});
/* jshint ignore:start */

require('web-client/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;

/* jshint ignore:end */
//# sourceMappingURL=tests.map