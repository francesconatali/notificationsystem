# Notification System ✨

A project entirely implemented in TypeScript without using any framework or extra library.

The API can send a new notification, list all unread notifications, and mark a notification as read.<br>
Data are retrieved and stored using a JSON file.

## Requirements

This project runs on Node, so you need a [Node runtime](https://nodejs.org/en/) on your computer.

## Installation

Once you have Node installed and extracted the project, open a terminal in that folder and run `npm install` to automatically install the modules needed.

## Run the server

To run the server:

```bash
npm start

# All being good you'll see
# "Server is running, port 3001 -> http://localhost:3001/"
```

## Manual environment set-up

If needed, to manually set up all the environment follow these steps (after you have installed Node):

```bash
# install the TypeScript Node package
npm install -D typescript

# install ts-node
npm install -D ts-node

# install @types/node definition
npm install @types/node
```

To set up Jest to run the tests (inside `tests/notifications.spec.js`) follow this steps:

```bash
# install Jest
npm install -D jest

# install ts-jest
# so Jest can understand TypeScript
npm install -D ts-jest

# install type definitions for Jest
npm install @types/jest

# generate Jest config file
npx ts-jest config:init
```

## Usage

There are 3 endpoints:

```bash
# get all the unread notifications (method GET)
http://localhost:<port>/api/notifications

# add a notification (method POST)
http://localhost:<port>/api/notifications

# mark a notification as read (method PUT)
http://localhost:<port>/api/notifications
```

## Settings

The following parameters can be changed in the file `settings.ts`

- port (default: 3001)
- db_file (default: "db.json")

## Author
[Francesco Natali](https://francesconatali.com)
