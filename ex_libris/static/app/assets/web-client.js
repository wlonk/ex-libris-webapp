"use strict";

/* jshint ignore:start */



/* jshint ignore:end */

define('web-client/adapters/application', ['exports', 'web-client/adapters/drf'], function (exports, _webClientAdaptersDrf) {
  exports['default'] = _webClientAdaptersDrf['default'];
});
define('web-client/adapters/drf', ['exports', 'ember', 'ember-django-adapter/adapters/drf', 'web-client/config/environment'], function (exports, _ember, _emberDjangoAdapterAdaptersDrf, _webClientConfigEnvironment) {
  exports['default'] = _emberDjangoAdapterAdaptersDrf['default'].extend({
    host: _ember['default'].computed(function () {
      return _webClientConfigEnvironment['default'].APP.API_HOST;
    }),

    namespace: _ember['default'].computed(function () {
      return _webClientConfigEnvironment['default'].APP.API_NAMESPACE;
    })
  });
});
define('web-client/app', ['exports', 'ember', 'web-client/resolver', 'ember-load-initializers', 'web-client/config/environment'], function (exports, _ember, _webClientResolver, _emberLoadInitializers, _webClientConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _webClientConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _webClientConfigEnvironment['default'].podModulePrefix,
    Resolver: _webClientResolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _webClientConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});
define('web-client/authenticators/oauth2', ['exports', 'ember-simple-auth/authenticators/oauth2-password-grant'], function (exports, _emberSimpleAuthAuthenticatorsOauth2PasswordGrant) {
  exports['default'] = _emberSimpleAuthAuthenticatorsOauth2PasswordGrant['default'].extend();
});
define('web-client/authenticators/torii', ['exports', 'ember', 'ember-simple-auth/authenticators/torii'], function (exports, _ember, _emberSimpleAuthAuthenticatorsTorii) {
  exports['default'] = _emberSimpleAuthAuthenticatorsTorii['default'].extend({
    torii: _ember['default'].inject.service()
  });
});
define('web-client/components/app-version', ['exports', 'ember-cli-app-version/components/app-version', 'web-client/config/environment'], function (exports, _emberCliAppVersionComponentsAppVersion, _webClientConfigEnvironment) {

  var name = _webClientConfigEnvironment['default'].APP.name;
  var version = _webClientConfigEnvironment['default'].APP.version;

  exports['default'] = _emberCliAppVersionComponentsAppVersion['default'].extend({
    version: version,
    name: name
  });
});
define('web-client/components/torii-iframe-placeholder', ['exports', 'torii/components/torii-iframe-placeholder'], function (exports, _toriiComponentsToriiIframePlaceholder) {
  exports['default'] = _toriiComponentsToriiIframePlaceholder['default'];
});
define('web-client/controllers/application', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({
    session: _ember['default'].inject.service(),

    actions: {
      invalidateSession: function invalidateSession() {
        this.get('session').invalidate();
      },

      authenticate: function authenticate(provider) {
        var _this = this;

        this.get('session').authenticate('authenticator:torii', provider).then(function () {
          var authenticated = _this.get('session.data.authenticated');
          // pass authCode to backend endpoint
          // which will exchange it for a bearer token from dropbox
          // and return an Ex Libris bearer token
          var data = {
            redirect_uri: authenticated.redirectUri,
            code: authenticated.authorizationCode
          };
          return _ember['default'].$.ajax('/api-token-auth/', {
            method: 'POST',
            data: data
          });
        }, function (error) {
          console.error(error);
        }).then(function (data) {
          _this.set('currentUser.token', data.token);
        }, function (error) {
          _this.get('session').invalidate();
        });
      }
    }
  });
});
define('web-client/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _emberInflectorLibHelpersPluralize) {
  exports['default'] = _emberInflectorLibHelpersPluralize['default'];
});
define('web-client/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _emberInflectorLibHelpersSingularize) {
  exports['default'] = _emberInflectorLibHelpersSingularize['default'];
});
define('web-client/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'web-client/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _webClientConfigEnvironment) {
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(_webClientConfigEnvironment['default'].APP.name, _webClientConfigEnvironment['default'].APP.version)
  };
});
define('web-client/initializers/container-debug-adapter', ['exports', 'ember-resolver/container-debug-adapter'], function (exports, _emberResolverContainerDebugAdapter) {
  exports['default'] = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _emberResolverContainerDebugAdapter['default']);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('web-client/initializers/data-adapter', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `data-adapter` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'data-adapter',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('web-client/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data/-private/core'], function (exports, _emberDataSetupContainer, _emberDataPrivateCore) {

  /*
  
    This code initializes Ember-Data onto an Ember application.
  
    If an Ember.js developer defines a subclass of DS.Store on their application,
    as `App.StoreService` (or via a module system that resolves to `service:store`)
    this code will automatically instantiate it and make it available on the
    router.
  
    Additionally, after an application's controllers have been injected, they will
    each have the store made available to them.
  
    For example, imagine an Ember.js application with the following classes:
  
    App.StoreService = DS.Store.extend({
      adapter: 'custom'
    });
  
    App.PostsController = Ember.ArrayController.extend({
      // ...
    });
  
    When the application is initialized, `App.ApplicationStore` will automatically be
    instantiated, and the instance of `App.PostsController` will have its `store`
    property set to that instance.
  
    Note that this code will only be run if the `ember-application` package is
    loaded. If Ember Data is being used in an environment other than a
    typical application (e.g., node.js where only `ember-runtime` is available),
    this code will be ignored.
  */

  exports['default'] = {
    name: 'ember-data',
    initialize: _emberDataSetupContainer['default']
  };
});
define('web-client/initializers/ember-simple-auth', ['exports', 'ember', 'web-client/config/environment', 'ember-simple-auth/configuration', 'ember-simple-auth/initializers/setup-session', 'ember-simple-auth/initializers/setup-session-service'], function (exports, _ember, _webClientConfigEnvironment, _emberSimpleAuthConfiguration, _emberSimpleAuthInitializersSetupSession, _emberSimpleAuthInitializersSetupSessionService) {
  exports['default'] = {
    name: 'ember-simple-auth',
    initialize: function initialize(registry) {
      var config = _webClientConfigEnvironment['default']['ember-simple-auth'] || {};
      config.baseURL = _webClientConfigEnvironment['default'].baseURL;
      _emberSimpleAuthConfiguration['default'].load(config);

      (0, _emberSimpleAuthInitializersSetupSession['default'])(registry);
      (0, _emberSimpleAuthInitializersSetupSessionService['default'])(registry);
    }
  };
});
define('web-client/initializers/export-application-global', ['exports', 'ember', 'web-client/config/environment'], function (exports, _ember, _webClientConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_webClientConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var value = _webClientConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_webClientConfigEnvironment['default'].modulePrefix);
      }

      if (!window[globalName]) {
        window[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete window[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('web-client/initializers/initialize-torii-callback', ['exports', 'torii/redirect-handler'], function (exports, _toriiRedirectHandler) {
  exports['default'] = {
    name: 'torii-callback',
    before: 'torii',
    initialize: function initialize(application) {
      if (arguments[1]) {
        // Ember < 2.1
        application = arguments[1];
      }
      application.deferReadiness();
      _toriiRedirectHandler['default'].handle(window)['catch'](function () {
        application.advanceReadiness();
      });
    }
  };
});
define('web-client/initializers/initialize-torii-session', ['exports', 'torii/bootstrap/session', 'torii/configuration'], function (exports, _toriiBootstrapSession, _toriiConfiguration) {
  exports['default'] = {
    name: 'torii-session',
    after: 'torii',

    initialize: function initialize(application) {
      if (arguments[1]) {
        // Ember < 2.1
        application = arguments[1];
      }
      var configuration = (0, _toriiConfiguration.getConfiguration)();
      if (!configuration.sessionServiceName) {
        return;
      }

      (0, _toriiBootstrapSession['default'])(application, configuration.sessionServiceName);

      var sessionFactoryName = 'service:' + configuration.sessionServiceName;
      application.inject('adapter', configuration.sessionServiceName, sessionFactoryName);
    }
  };
});
define('web-client/initializers/initialize-torii', ['exports', 'torii/bootstrap/torii', 'torii/configuration', 'web-client/config/environment'], function (exports, _toriiBootstrapTorii, _toriiConfiguration, _webClientConfigEnvironment) {

  var initializer = {
    name: 'torii',
    initialize: function initialize(application) {
      if (arguments[1]) {
        // Ember < 2.1
        application = arguments[1];
      }
      (0, _toriiConfiguration.configure)(_webClientConfigEnvironment['default'].torii || {});
      (0, _toriiBootstrapTorii['default'])(application);
      application.inject('route', 'torii', 'service:torii');
    }
  };

  exports['default'] = initializer;
});
define('web-client/initializers/injectStore', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `injectStore` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'injectStore',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('web-client/initializers/simple-auth-token', ['exports', 'ember-simple-auth-token/authenticators/token', 'ember-simple-auth-token/authenticators/jwt', 'ember-simple-auth-token/authorizers/token', 'ember-simple-auth-token/configuration', 'web-client/config/environment'], function (exports, _emberSimpleAuthTokenAuthenticatorsToken, _emberSimpleAuthTokenAuthenticatorsJwt, _emberSimpleAuthTokenAuthorizersToken, _emberSimpleAuthTokenConfiguration, _webClientConfigEnvironment) {

  /**
    Ember Simple Auth Token's Initializer.
    By default load both the Token and JWT (with refresh) Authenticators.
  */
  exports['default'] = {
    name: 'ember-simple-auth-token',
    before: 'ember-simple-auth',
    initialize: function initialize(container) {
      _emberSimpleAuthTokenConfiguration['default'].load(container, _webClientConfigEnvironment['default']['ember-simple-auth-token'] || {});
      container.register('authorizer:token', _emberSimpleAuthTokenAuthorizersToken['default']);
      container.register('authenticator:token', _emberSimpleAuthTokenAuthenticatorsToken['default']);
      container.register('authenticator:jwt', _emberSimpleAuthTokenAuthenticatorsJwt['default']);
    }
  };
});
define('web-client/initializers/store', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `store` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'store',
    after: 'ember-data',
    initialize: _ember['default'].K
  };
});
define('web-client/initializers/transforms', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `transforms` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'transforms',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define("web-client/instance-initializers/ember-data", ["exports", "ember-data/-private/instance-initializers/initialize-store-service"], function (exports, _emberDataPrivateInstanceInitializersInitializeStoreService) {
  exports["default"] = {
    name: "ember-data",
    initialize: _emberDataPrivateInstanceInitializersInitializeStoreService["default"]
  };
});
define('web-client/instance-initializers/ember-simple-auth', ['exports', 'ember-simple-auth/instance-initializers/setup-session-restoration'], function (exports, _emberSimpleAuthInstanceInitializersSetupSessionRestoration) {
  exports['default'] = {
    name: 'ember-simple-auth',
    initialize: function initialize(instance) {
      (0, _emberSimpleAuthInstanceInitializersSetupSessionRestoration['default'])(instance);
    }
  };
});
define('web-client/instance-initializers/setup-routes', ['exports', 'torii/bootstrap/routing', 'torii/configuration', 'torii/router-dsl-ext'], function (exports, _toriiBootstrapRouting, _toriiConfiguration, _toriiRouterDslExt) {
  exports['default'] = {
    name: 'torii-setup-routes',
    initialize: function initialize(applicationInstance, registry) {
      var configuration = (0, _toriiConfiguration.getConfiguration)();

      if (!configuration.sessionServiceName) {
        return;
      }

      var router = applicationInstance.get('router');
      var setupRoutes = function setupRoutes() {
        var authenticatedRoutes = router.router.authenticatedRoutes;
        var hasAuthenticatedRoutes = !Ember.isEmpty(authenticatedRoutes);
        if (hasAuthenticatedRoutes) {
          (0, _toriiBootstrapRouting['default'])(applicationInstance, authenticatedRoutes);
        }
        router.off('willTransition', setupRoutes);
      };
      router.on('willTransition', setupRoutes);
    }
  };
});
define('web-client/instance-initializers/walk-providers', ['exports', 'torii/lib/container-utils', 'torii/configuration'], function (exports, _toriiLibContainerUtils, _toriiConfiguration) {
  exports['default'] = {
    name: 'torii-walk-providers',
    initialize: function initialize(applicationInstance) {
      var configuration = (0, _toriiConfiguration.getConfiguration)();
      // Walk all configured providers and eagerly instantiate
      // them. This gives providers with initialization side effects
      // like facebook-connect a chance to load up assets.
      for (var key in configuration.providers) {
        if (configuration.providers.hasOwnProperty(key)) {
          (0, _toriiLibContainerUtils.lookup)(applicationInstance, 'torii-provider:' + key);
        }
      }
    }
  };
});
define('web-client/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  exports['default'] = _emberResolver['default'];
});
define('web-client/router', ['exports', 'ember', 'web-client/config/environment'], function (exports, _ember, _webClientConfigEnvironment) {

    var Router = _ember['default'].Router.extend({
        location: _webClientConfigEnvironment['default'].locationType,
        rootURL: _webClientConfigEnvironment['default'].rootURL
    });

    Router.map(function () {
        this.route('index', { path: '/' });
        this.route('about', { path: '/about' });
        this.route('privacy', { path: '/privacy' });
        this.route('users', { path: '/users' });
        this.route('user', { path: '/users/:user_id' });
        this.route('books', { path: '/books' });
        this.route('book', { path: '/books/:book_id' });
    });

    exports['default'] = Router;
});
define('web-client/routes/application', ['exports', 'ember', 'ember-simple-auth/mixins/application-route-mixin'], function (exports, _ember, _emberSimpleAuthMixinsApplicationRouteMixin) {
  exports['default'] = _ember['default'].Route.extend(_emberSimpleAuthMixinsApplicationRouteMixin['default'], {
    currentUser: _ember['default'].inject.service(),

    beforeModel: function beforeModel() {
      return this._loadCurrentUser();
    },

    sessionAuthenticated: function sessionAuthenticated() {
      var _this = this;

      this._super.apply(this, arguments);
      this._loadCurrentUser()['catch'](function () {
        return _this.get('session').invalidate();
      });
    },

    _loadCurrentUser: function _loadCurrentUser() {
      return this.get('currentUser').load();
    }
  });
});
define('web-client/serializers/application', ['exports', 'web-client/serializers/drf'], function (exports, _webClientSerializersDrf) {
  exports['default'] = _webClientSerializersDrf['default'];
});
define('web-client/serializers/drf', ['exports', 'ember-django-adapter/serializers/drf'], function (exports, _emberDjangoAdapterSerializersDrf) {
  exports['default'] = _emberDjangoAdapterSerializersDrf['default'];
});
define('web-client/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _emberAjaxServicesAjax) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberAjaxServicesAjax['default'];
    }
  });
});
define('web-client/services/current-user', ['exports', 'ember'], function (exports, _ember) {
  var service = _ember['default'].inject.service;
  var isEmpty = _ember['default'].isEmpty;
  var RSVP = _ember['default'].RSVP;
  exports['default'] = _ember['default'].Service.extend({
    session: service(),
    store: service(),

    load: function load() {
      var _this = this;

      return new RSVP.Promise(function (resolve, reject) {
        var userId = _this.get('session.data.authenticated.user_id');
        if (!isEmpty(userId)) {
          return _this.get('store').find('user', userId).then(function (user) {
            _this.set('user', user);
          }, reject);
        } else {
          resolve();
        }
      });
    }
  });
});
define('web-client/services/popup', ['exports', 'torii/services/popup'], function (exports, _toriiServicesPopup) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _toriiServicesPopup['default'];
    }
  });
});
define('web-client/services/session', ['exports', 'ember-simple-auth/services/session'], function (exports, _emberSimpleAuthServicesSession) {
  exports['default'] = _emberSimpleAuthServicesSession['default'];
});
define('web-client/services/torii-session', ['exports', 'torii/services/session'], function (exports, _toriiServicesSession) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _toriiServicesSession['default'];
    }
  });
});
define('web-client/services/torii', ['exports', 'torii/services/torii'], function (exports, _toriiServicesTorii) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _toriiServicesTorii['default'];
    }
  });
});
define('web-client/session-stores/application', ['exports', 'ember-simple-auth/session-stores/adaptive'], function (exports, _emberSimpleAuthSessionStoresAdaptive) {
  exports['default'] = _emberSimpleAuthSessionStoresAdaptive['default'].extend();
});
define("web-client/templates/about", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.0",
          "loc": {
            "source": null,
            "start": {
              "line": 52,
              "column": 29
            },
            "end": {
              "line": 52,
              "column": 55
            }
          },
          "moduleName": "web-client/templates/about.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("here");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 53,
            "column": 0
          }
        },
        "moduleName": "web-client/templates/about.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h1");
        var el2 = dom.createTextNode("About Ex Libris");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("h2");
        var el2 = dom.createTextNode("What's this all about, anyway?");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode("\nWell, I've got a lot of PDFs in my Dropbox. For the most part, they're\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("abbr");
        dom.setAttribute(el2, "title", "Role-Playing Game");
        var el3 = dom.createTextNode("RPG");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode(" rules, but all kinds of other things\nfind their way in there, too: fiction, histories of China, books on how to run\na successful Kickstarter campaign, and more.\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode("\nI wanted a better way to manage them than a bunch of folders. Something a bit\nmore like iTunes, frankly, where I could search by author, publisher, year,\nor title, and actually find what I was looking for. Thus, Ex Libris.\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("h2");
        var el2 = dom.createTextNode("Huh, cool. But who are you?");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode("\nMy name's Kit La Touche. I'm a linguist, programmer, game designer, and\nwannabe seamonster. I ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("a");
        dom.setAttribute(el2, "href", "https://twitter.com/wlonk");
        var el3 = dom.createTextNode(" tweet");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\nsometimes, too.\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("h2");
        var el2 = dom.createTextNode("Why \"Ex Libris\"?");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode("\nSo, the phrase is Latin for \"from the books (of)\", and is a common sight on\nbookplates, which are no longer common sights. They were once a way of\nmarking books as belonging to a certain person's personal library. When I was\na little kid, my parents made me a stamp in the tradition of a bookplate,\nthat read \"");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("span");
        dom.setAttribute(el2, "class", "small-caps");
        var el3 = dom.createTextNode("Ex Libris Kit La Touche");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\" and had a\npicture of a polar bear reading, and I fell in love with the phrase. Years\nlater, I decided to use it here.\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("h2");
        var el2 = dom.createTextNode("You didn't do this all on your own, did you?");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode("\nAbsolutely not! I had and have some great help from some great people. First,\nthe design is the work of my friend \n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("a");
        dom.setAttribute(el2, "href", "http://websterdesigns.co/");
        var el3 = dom.createTextNode("Brooke");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode(", and the logo is by her friend\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("a");
        dom.setAttribute(el2, "href", "http://www.goodknightstudio.com/");
        var el3 = dom.createTextNode("Zoe");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode(". I also have had some\ndevelopment help from my friend\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("a");
        dom.setAttribute(el2, "href", "https://keybase.io/augustalso/");
        var el3 = dom.createTextNode("Austin");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode(". And I could get help from\nyou, too, if you're interested! I'm always happy to talk with smart people.\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("h2");
        var el2 = dom.createTextNode("Do you have a privacy policy?");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode("You bet we do. It's right ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode(".");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [22]), 1, 1);
        return morphs;
      },
      statements: [["block", "link-to", ["privacy"], [], 0, null, ["loc", [null, [52, 29], [52, 67]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("web-client/templates/application", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.0",
          "loc": {
            "source": null,
            "start": {
              "line": 4,
              "column": 6
            },
            "end": {
              "line": 7,
              "column": 6
            }
          },
          "moduleName": "web-client/templates/application.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("img");
          dom.setAttribute(el1, "src", "/static/images/logo-header.png");
          dom.setAttribute(el1, "alt", "Ex Libris");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("span");
          dom.setAttribute(el1, "class", "release");
          var el2 = dom.createTextNode("βeta");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.0",
            "loc": {
              "source": null,
              "start": {
                "line": 17,
                "column": 12
              },
              "end": {
                "line": 17,
                "column": 55
              }
            },
            "moduleName": "web-client/templates/application.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("Books");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.8.0",
          "loc": {
            "source": null,
            "start": {
              "line": 15,
              "column": 10
            },
            "end": {
              "line": 19,
              "column": 10
            }
          },
          "moduleName": "web-client/templates/application.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          dom.setAttribute(el1, "class", "nav-item");
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 1, 1);
          return morphs;
        },
        statements: [["block", "link-to", ["index"], ["class", "nav-link"], 0, null, ["loc", [null, [17, 12], [17, 67]]]]],
        locals: [],
        templates: [child0]
      };
    })();
    var child2 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "revision": "Ember@2.8.0",
            "loc": {
              "source": null,
              "start": {
                "line": 25,
                "column": 12
              },
              "end": {
                "line": 25,
                "column": 89
              }
            },
            "moduleName": "web-client/templates/application.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("@");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [["content", "session.user.username", ["loc", [null, [25, 62], [25, 89]]], 0, 0, 0, 0]],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.8.0",
          "loc": {
            "source": null,
            "start": {
              "line": 23,
              "column": 10
            },
            "end": {
              "line": 30,
              "column": 10
            }
          },
          "moduleName": "web-client/templates/application.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          dom.setAttribute(el1, "class", "nav-item");
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          dom.setAttribute(el1, "class", "nav-item");
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("button");
          dom.setAttribute(el2, "class", "btn btn-primary-outline nav-link");
          var el3 = dom.createTextNode("(logout)");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element1 = dom.childAt(fragment, [3, 1]);
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 1, 1);
          morphs[1] = dom.createElementMorph(element1);
          return morphs;
        },
        statements: [["block", "link-to", ["user", ["get", "session.user", ["loc", [null, [25, 30], [25, 42]]], 0, 0, 0, 0]], ["class", "nav-link"], 0, null, ["loc", [null, [25, 12], [25, 101]]]], ["element", "action", ["invalidateSession"], [], ["loc", [null, [28, 61], [28, 91]]], 0, 0]],
        locals: [],
        templates: [child0]
      };
    })();
    var child3 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.0",
          "loc": {
            "source": null,
            "start": {
              "line": 30,
              "column": 10
            },
            "end": {
              "line": 34,
              "column": 10
            }
          },
          "moduleName": "web-client/templates/application.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          dom.setAttribute(el1, "class", "nav-item");
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("button");
          dom.setAttribute(el2, "class", "btn btn-primary-outline nav-link");
          var el3 = dom.createTextNode("dropbox");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1, 1]);
          var morphs = new Array(1);
          morphs[0] = dom.createElementMorph(element0);
          return morphs;
        },
        statements: [["element", "action", ["authenticate", "dropbox-oauth2"], [], ["loc", [null, [32, 61], [32, 103]]], 0, 0]],
        locals: [],
        templates: []
      };
    })();
    var child4 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.0",
          "loc": {
            "source": null,
            "start": {
              "line": 50,
              "column": 11
            },
            "end": {
              "line": 50,
              "column": 36
            }
          },
          "moduleName": "web-client/templates/application.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("About");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child5 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.0",
          "loc": {
            "source": null,
            "start": {
              "line": 51,
              "column": 11
            },
            "end": {
              "line": 51,
              "column": 40
            }
          },
          "moduleName": "web-client/templates/application.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Privacy");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 55,
            "column": 0
          }
        },
        "moduleName": "web-client/templates/application.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "m-b");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("nav");
        dom.setAttribute(el2, "class", "navbar navbar-dark navbar-static-top navbar-full bg-inverse");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "container");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4, "type", "button");
        dom.setAttribute(el4, "class", "navbar-toggler hidden-sm-up pull-xs-right");
        dom.setAttribute(el4, "data-toggle", "collapse");
        dom.setAttribute(el4, "data-target", "#bs-navbar-collapse-1");
        var el5 = dom.createTextNode("\n        ☰\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment(" Collect the nav links, forms, and other content for toggling ");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "collapse navbar-toggleable-xs");
        dom.setAttribute(el4, "id", "bs-navbar-collapse-1");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("ul");
        dom.setAttribute(el5, "class", "nav navbar-nav");
        var el6 = dom.createTextNode("\n");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("ul");
        dom.setAttribute(el5, "class", "nav navbar-nav pull-xs-right");
        var el6 = dom.createTextNode("\n");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "id", "body-container");
        dom.setAttribute(el1, "class", "container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode(" ");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment(" /container ");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("footer");
        dom.setAttribute(el1, "class", "footer");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "container");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        dom.setAttribute(el3, "class", "text-muted small");
        var el4 = dom.createTextNode("\n    © 2016 Transneptune Games\n    • ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    • ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element2 = dom.childAt(fragment, [0, 1, 1]);
        var element3 = dom.childAt(element2, [7]);
        var element4 = dom.childAt(fragment, [2]);
        var element5 = dom.childAt(fragment, [6, 1, 1]);
        var morphs = new Array(7);
        morphs[0] = dom.createMorphAt(element2, 1, 1);
        morphs[1] = dom.createMorphAt(dom.childAt(element3, [1]), 1, 1);
        morphs[2] = dom.createMorphAt(dom.childAt(element3, [3]), 1, 1);
        morphs[3] = dom.createMorphAt(element4, 1, 1);
        morphs[4] = dom.createMorphAt(element4, 3, 3);
        morphs[5] = dom.createMorphAt(element5, 1, 1);
        morphs[6] = dom.createMorphAt(element5, 3, 3);
        return morphs;
      },
      statements: [["block", "link-to", ["index"], ["class", "navbar-brand"], 0, null, ["loc", [null, [4, 6], [7, 18]]]], ["block", "if", [["get", "session.is_authenticated", ["loc", [null, [15, 16], [15, 40]]], 0, 0, 0, 0]], [], 1, null, ["loc", [null, [15, 10], [19, 17]]]], ["block", "if", [["get", "session.isAuthenticated", ["loc", [null, [23, 16], [23, 39]]], 0, 0, 0, 0]], [], 2, 3, ["loc", [null, [23, 10], [34, 17]]]], ["inline", "outlet", ["messages"], [], ["loc", [null, [42, 2], [42, 23]]], 0, 0], ["content", "outlet", ["loc", [null, [43, 2], [43, 12]]], 0, 0, 0, 0], ["block", "link-to", ["about"], [], 4, null, ["loc", [null, [50, 11], [50, 48]]]], ["block", "link-to", ["privacy"], [], 5, null, ["loc", [null, [51, 11], [51, 52]]]]],
      locals: [],
      templates: [child0, child1, child2, child3, child4, child5]
    };
  })());
});
define("web-client/templates/index", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 18,
            "column": 0
          }
        },
        "moduleName": "web-client/templates/index.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "jumbotron text-xs-center");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("img");
        dom.setAttribute(el2, "src", "/static/images/logo-main.png");
        dom.setAttribute(el2, "class", "img-rounded center-block");
        dom.setAttribute(el2, "alt", "Ex Libris logo");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        dom.setAttribute(el2, "class", "lead");
        var el3 = dom.createTextNode("\n  Manage your library, right from your Dropbox.\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("a");
        dom.setAttribute(el3, "class", "btn btn-lg btn-primary");
        dom.setAttribute(el3, "role", "button");
        var el4 = dom.createTextNode("Log in via Dropbox");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "row");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        dom.setAttribute(el3, "class", "col-sm-6 offset-sm-3");
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("small");
        dom.setAttribute(el4, "class", "text-muted");
        var el5 = dom.createTextNode("\n      Right now, we're in beta, and only can deal with PDF files in Dropbox.\n      Sorry! We're working on expanding and improving what we offer, though.\n    ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0, 5, 1]);
        var morphs = new Array(1);
        morphs[0] = dom.createElementMorph(element0);
        return morphs;
      },
      statements: [["element", "action", ["authenticate", "dropbox-oauth2"], [], ["loc", [null, [7, 50], [7, 92]]], 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("web-client/templates/privacy", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.0",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 103,
            "column": 0
          }
        },
        "moduleName": "web-client/templates/privacy.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h1");
        var el2 = dom.createTextNode("\n  Privacy Policy\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("small");
        dom.setAttribute(el2, "class", "text-muted");
        var el3 = dom.createTextNode("Effective from March 19, 2016");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode("\nWe want to respect your privacy as much as we hope others would respect our\nown. There's some information we need from you, though, to provide our\nservices. We're going to be completely explicit about how we balance these\nconcerns here.\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("h2");
        var el2 = dom.createTextNode("\n  What we collect\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode("\nWe collect information about the files in our application folder in your\nDropbox, and just enough information that we can talk with Dropbox on your\nbehalf. We also collect whatever metadata you choose to provide us with about\nthose files in your Dropbox.\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode("\nThat's ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("em");
        var el3 = dom.createTextNode("it");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode(".\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("h2");
        var el2 = dom.createTextNode("\n  Disclosure of your information\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode("\nExcept under the exceptional circumstances outlined below, we will not sell\nor disclose your information to anyone outside the company.\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode("\nThere are some circumstances where we may have to, though. We say the same\nthings ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("a");
        dom.setAttribute(el2, "href", "https://medium.com/policy/medium-privacy-policy-f03bf92035c9#.6iyyyanzx");
        var el3 = dom.createTextNode("Medium");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\nsays about that:\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("blockquote");
        dom.setAttribute(el1, "class", "blockquote");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        var el3 = dom.createTextNode("\n  We may share your personal information with third parties in limited\n  circumstances, including: (1) with your consent; (2) to a vendor or partner\n  who meets our data protection standards; or (3) when we have a good faith\n  belief it is required by law, such as pursuant to a subpoena or other legal\n  process.\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        var el3 = dom.createTextNode("\n  If we’re going to share your information in response to legal process, we’ll\n  give you advance notice so you can challenge it (for example by seeking court\n  intervention), unless we’re prohibited from doing so by law or court order.\n  We will object to requests for information about users of our site that we\n  believe to be improper.\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        var el3 = dom.createTextNode("\n  If we merge with another company such that your information will become\n  subject to a different privacy policy, we’ll notify you before the transfer.\n  You can opt out of the new policy by deleting your account during the notice\n  period.\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("h2");
        var el2 = dom.createTextNode("\n  Cookies\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode("\nWe use cookies to determine whether you're logged in to our site. We don't\ntrack you on other sites. We don't use them for any other purposes, in fact.\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("h2");
        var el2 = dom.createTextNode("\n  Deleting your account\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode("\nThere's currently no automated way to do this, but\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("a");
        dom.setAttribute(el2, "href", "mailto:kit@transneptune.net");
        var el3 = dom.createTextNode("get in touch");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode(" and we will gladly\nremove your account and all your data for you. We'll be sorry to see you go,\nthough!\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("h2");
        var el2 = dom.createTextNode("\n  Changes to this Policy\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode("\nWe may periodically update this Policy. We’ll notify you by email about\nsignificant changes to it. This is all we will email you about, ever.\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("h2");
        var el2 = dom.createTextNode("\n  Questions\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode("\nIf you have any questions, please ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("a");
        dom.setAttribute(el2, "href", "mailto:kit@transneptune.net");
        var el3 = dom.createTextNode("get\n  in touch");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode(".\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() {
        return [];
      },
      statements: [],
      locals: [],
      templates: []
    };
  })());
});
define('web-client/torii-providers/dropbox-oauth2', ['exports', 'web-client/config/environment', 'torii/providers/oauth2-code'], function (exports, _webClientConfigEnvironment, _toriiProvidersOauth2Code) {

  /**
   * This class implements authentication against Dropbox
   * using the client-side OAuth2 authorization flow in a popup window.
   */

  exports['default'] = _toriiProvidersOauth2Code['default'].extend({
    name: 'dropbox-oauth2',
    baseUrl: 'https://www.dropbox.com/1/oauth2/authorize',

    // additional params that this provider requires
    requiredUrlParams: ['client_id', 'redirect_uri', 'response_type'],
    optionalUrlParams: [],

    clientId: _webClientConfigEnvironment['default'].torii.providers['dropbox-oauth2'].apiKey,
    redirectUri: _webClientConfigEnvironment['default'].torii.providers['dropbox-oauth2'].redirectUri,
    responseType: 'code',

    responseParams: ['code', 'state']
  });
});
/* jshint ignore:start */



/* jshint ignore:end */

/* jshint ignore:start */

define('web-client/config/environment', ['ember'], function(Ember) {
  var prefix = 'web-client';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

/* jshint ignore:end */

/* jshint ignore:start */

if (!runningTests) {
  require("web-client/app")["default"].create({"name":"web-client","version":"0.1.0+99b315f5","API_HOST":"http://localhost:8000","API_NAMESPACE":"api","API_ADD_TRAILING_SLASHES":true});
}

/* jshint ignore:end */
//# sourceMappingURL=web-client.map