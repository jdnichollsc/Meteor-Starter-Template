# Meteor Starter Template
A template to start with Meteor. It includes a summary to understand the most important features and how to work with Meteor in the correct way.

![Meteor.js](images/meteor.jpeg)

## Distributed Data Protocol - DDP
A protocol for communication between clients and the server. Sends the data via EJSON (a JSON implementation) that supports more types.
 - Publish and subscribe
 - Remote procedure calls

# App Structure
Path         | Explanation
----------   | -------------
`./client/`  | Runs on client only.
`./server/`  | Runs on server only.
`./private/` | Assets for server code only.
`./public/`  | Static assets, fonts, images, etc.
`./lib/`     | Runs before everything else.
`./test/`    | Doesn't run anywhere.
`./**/**`    | Runs on client and server.
`main.*`     | Runs after everything else.

# Publications and Subscriptions
To control the publications we need to remove the default auto-publishing package:
```cmd
meteor remove autopublish
```
In the **server** we configure that we will publish to our clients
```javascript
Meteor.publish('posts', function(currentAuthor) {
  return Posts.find({ author: currentAuthor });
});
```
And in the **client** we subscribe to the publications
```javascript
Meteor.subscribe('posts', 'jdnichollsc');
```

# Helpers
We can use the helpers to get data on the client
```javascript
Template.posts.helpers({
  recentPosts: function(){
    return Posts.find({ createdAt: { $gte : moment().subtract(1, 'days').startOf('day') } });
  }
});
```
We can exclude certain properties to get only what is needed from the server
```javascript
Meteor.publish('allPosts', function(currentAuthor){
  return Posts.find({ author: currentAuthor }, {fields: {
    date: false
  }});
});
```

# Routes
The **Iron Router** package allows us to configure routing in the application, to use filters and manage subscriptions.
```cmd
meteor add iron:router
```
We can create a dynamic zone to show the current route using **layouts** and the **yield** helper.

> **./client/views/layout.html**
********************************

```html
<template name="layout">
  <div class="container">
    {{> yield}}
  </div>
</template>
```

And we can configure the routes of our application
> **./lib/router.js**
*********************

```javascript
Router.configure({
  layoutTemplate: 'layout'
});
Router.route('/', {name: 'authors'});
```

The **Iron Router** has a helper to generate links dynamically
```html
<a href="{{pathFor 'authors'}}">Authors</a>
```
Pre-loading data and showing templates
```javascript
Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() { return Meteor.subscribe('posts'); }
});
```
We can use parameters in the routes to load data
```javascript
Router.route('/posts/:_id', {
  name: 'postPage',
  data: function() { return Posts.findOne(this.params._id); }
});
```

# Session
It is a global store of reactive data, a central communication bus for different parts of the application.
* Set a value
```javascript
Session.set('pageTitle', 'A different title');
```
* Get a value
```javascript
Session.get('pageTitle');
```

# Reactive blocks
It is a block of code that is executed when the data changes.
```javascript
Tracker.autorun(function() {
 alert(Session.get('message'));
});
//Or when Meteor has loaded the collections
Meteor.startup(function() {
 Tracker.autorun(function() {
  console.log('There are ' + Posts.find().count() + ' posts');
 });
});
```

And in the client side we can use the **observe** function to execute callbacks.
```javascript
Posts.find().observe({
  added: function(post) { },
  changed: function(post) { },
  removed: function(post) { }
});
```

# User authentication
We can add some packages to handle an account system
```cmd
//meteor add accounts-ui
meteor add ian:accounts-ui-bootstrap-3
meteor add accounts-password
```
And include the **loginButtons** helper in the template that you want
> **./client/views/layout.html**
********************************
```html
<template name="header">
  <nav class="navbar navbar-default" role="navigation">
    <div class="collapse navbar-collapse" id="navigation">
      <ul class="nav navbar-nav navbar-right">
        {{> loginButtons}}
      </ul>
    </div>
  </nav>
</template>
```

To see our users we can use the **users** collection
```javascript
Meteor.users.find().count();
```

# Security
We need to remove the **insecure** package to handle the security **(Prevent the anonymous actions)**
```cmd
meteor remove insecure
```
If we want to allow actions only from **authenticated users**, we can modify the rules of the collections using **allow** and **deny** functions.
```javascript
Posts.allow({
  insert: function(userId, doc) {
    // only allow posting if you are logged in
    return !! userId;
  }
});
```
Also we can modify the rules to update and remove documents created only by the owner user
> **./lib/permissions.js**
**************************
```javascript
// check that the userId specified owns the documents
ownsDocument = function(userId, doc) {
  return doc && doc.userId === userId;
}
```
> **./collections/posts.js**
****************************
```javascript
Posts.allow({
  update: ownsDocument,
  remove: ownsDocument
});
```

We can indicate only the fields that the user can modify
```javascript
Posts.deny({
  update: function(userId, post, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'url', 'title').length > 0);
  }
});
```

# Events (Client side)
We can create events listeners to save data, redirect the users, etc from the **client** side.
```javascript
Template.postSubmit.events({
  'submit form': function(e) {
    e.preventDefault();
    var $target = $(e.target);
    var post = {
      url: $target.find('[name=url]').val(),
      title: $target.find('[name=title]').val()
    };

    post._id = Posts.insert(post);
    Router.go('postPage', post);
  },
  'click #myButton': function(e){
    //We can execute server methods
    Meteor.call('addAuthors', { name: 'Nicholls' }, function(error, result) {
      if (error){
        console.log(error.reason);
      }
      else{
        console.log("Redirect user...");
      }
    });
    return false;
  }
});
```

## Local Collections
We can create collections only in the client, for example to show a list of errors
> **./client/helpers/errors.js**
********************************
```javascript
Errors = new Mongo.Collection(null);
throwError = function(message) {
  Errors.insert({message: message});
};
```

And we can remove the error after some time of having been rendered in the browser
> **./client/views/errors.js**
******************************
```javascript
Template.error.onRendered(function() {
  var error = this.data;
  Meteor.setTimeout(function () {
    Errors.remove(error._id);
  }, 3000);
});
//OR ONLY CREATED
Template.error.onCreated(function() {
  //...
});
```

# Methods (Server side)
Are functions executed from the **server** side to prevent user attacks.
```javascript
Meteor.methods({
  'addAuthors'({ name, birthdate }) {
    new SimpleSchema({
      name: { type: String },
      birthdate: { type: Date }
    }).validate({ name, birthdate });

    if (name === 'admin') {
      throw new Meteor.Error("You can't create an author with the name admin");
    }
    //...
  }
});
```

# Template helpers
* For each:
```html
{{#each widgets}}
  {{> widgetItem}}
{{/each}}
```

* Use an object property to load templates:
```html
{{#with myWidget}}
  {{> widgetPage}}
{{/with}}
//OR MORE EASY...
{{> widgetPage myWidget}}
```

* Show only if the user is authenticated (**currentUser** is a helper from the **accounts** package):
```html
{{#if currentUser}}
 <a href="{{pathFor 'postSubmit'}}">Submit Post</a>
{{/if}}
```

# Hooks
* Show a template when the route is invalid:
```javascript
Router.onBeforeAction('dataNotFound', {only: 'postPage'});
```
* Prevent the access to the routes from anonymous users:
```javascript
Router.route('/submit', {name: 'postSubmit'});
var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
};
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});
```
> **./client/views/accessDenied.html**
**************************************
```javascript
<template name="accessDenied">
  <div class="access-denied page">
    <h2>Access Denied</h2>
    <p>Please log in.</p>
  </div>
</template>
```

# Packages

### Spinner
We can add a package to create a loading template
```cmd
meteor add sacha:spin
```
And using the **spinner** helper

> **./client/views/loading.html**
*********************************
```html
<template name="loading">
  {{>spinner}}
</template>
```

### Check
A package to validate types and structure of variables.
```cmd
meteor add check
```
And we can check objects to validate
```javascript
Meteor.methods({
  postInsert: function(postAttributes) {
    check(Meteor.userId(), String);
    check(postAttributes, {
      title: String,
      url: String
    });
    
    var user = Meteor.user();
    //...
  }
});
```

# Meteor utilities

Utility                      | Action
---------------------------  | -------------
`Meteor.isClient`            | Check if the current code is executed from the client side
`Meteor.isServer`            | Check if the current code is executed from the server side
`Meteor._sleepForMs(5000)`   | Wait for 5 seconds


# Packages commands

Command                                       | Action
--------------------------------------------  | -------------
`meteor`                                      | Runs meteor app
`meteor list`                                 | Show packages
`meteor shell`                                | Access to server code
`meteor mongo`                                | Access to the database
`meteor create app_name`                      | Create meteor app
`meteor create --package jdnichollsc:errors`  | Create meteor package
`meteor add package_name`                     | Add meteor packages
`meteor remove package_name`                  | Remove meteor packages
`meteor reset`                                | Delete the database and reset the project
