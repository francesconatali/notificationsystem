import { createServer, IncomingMessage, ServerResponse } from 'http';

// import controller
import { getNotifications, addNotification, updateNotificationAsRead } from "./controller";
import { Settings } from './settings';

// Set up a server and define 3 endpoints
// GET http://localhost:<port>/api/notifications
// POST http://localhost:<port>/api/notifications
// PUT http://localhost:<port>/api/notifications
const server = createServer((req:IncomingMessage, res:ServerResponse) => {
    // check the correct url has been called
    if (req.url != "/api/notifications") {
        res.statusCode = 404;
        res.end();
    } else {
        switch (req.method) {
            // get unread notifications
            case 'GET': {
                getNotifications(res);
                return;
            }
            // create a notification
            case 'POST': {
                addNotification(req, res);
                return;
            }
            // update a notification as read
            case 'PUT': {
                updateNotificationAsRead(req, res);
                return;
            }
            case 'OPTIONS': {
                // This is necessary to handle Preflight Requests
                // avoiding CORS issue, espacially on method PUT
                const headers = {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "OPTIONS, GET, POST, PUT",
                    "Access-Control-Request-Headers": "*"
                  };
                // HTTP 204 No Content success status response code
                // Basically it says "it's all good"
                res.writeHead(204, headers);
                res.end();
                return;
            }
            default: {
                res.statusCode = 404;
                res.end();
            }
        }
    }
 });

 // catch any error
 server.on('error', function (e) {
    console.log('Server error: ' + e.message);
  });

 // Start the server and listen for connections
 server.listen(Settings.port, () => {
    console.log('Server is running, port ' + Settings.port + ' -> http://localhost:' + Settings.port + '/')
 });
