# Meteor Starter Template
A template to start with Meteor. It includes a summary to understand the most important characteristics and how to work with Meteor in the correct way.

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
