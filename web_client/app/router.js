import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
    this.route('index', {path: '/'});
    this.route('about', {path: '/about'});
    this.route('privacy', {path: '/privacy'});
    this.route('users', {path: '/users'});
    this.route('user', {path: '/users/:user_id'});
    this.route('books', {path: '/books'});
    this.route('book', {path: '/books/:book_id'});
});

export default Router;
