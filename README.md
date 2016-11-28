# Meteor Starter Template
A template to start with Meteor. It includes a summary to understand the most important characteristics and how to work with Meteor in the correct way.

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

## Spinner
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

##Reactive blocks
It is a block of code that is executed when the data changes.
```javascript
Tracker.autorun(function() {
  alert(Session.get('message'));
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

# Hooks
* Show a template when the route is invalid:
```javascript
Router.onBeforeAction('dataNotFound', {only: 'postPage'});
```

# Packages commands

Command                      | Action
---------------------------  | -------------
`meteor`                     | Runs meteor app
`meteor list`                | Show packages
`meteor shell`               | Access to server code
`meteor mongo`               | Access to the database
`meteor create app_name`     | Create meteor app
`meteor add package_name`    | Add meteor packages
`meteor remove package_name` | Remove meteor packages
`meteor reset`               | Delete the database and reset the project
