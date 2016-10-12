import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service(),

  actions: {
    invalidateSession() {
      this.get('session').invalidate();
    },

    authenticate(provider) {
      this.get('session').authenticate(
        'authenticator:torii',
        provider
      ).then(
        () => {
          const authenticated = this.get('session.data.authenticated');
          // pass authCode to backend endpoint
          // which will exchange it for a bearer token from dropbox
          // and return an Ex Libris bearer token
          const data = {
            redirect_uri: authenticated.redirectUri,
            code: authenticated.authorizationCode
          };
          return Ember.$.ajax('/api-token-auth/', {
            method: 'POST',
            data
          });
        },
        (error) => {
          console.error(error);
        }
      ).then(
        (data) => {
          this.set('currentUser.token', data.token);
        },
        (error) => {
          this.get('session').invalidate();
        }
      );
    }
  }
});
