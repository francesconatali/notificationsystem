// to access the JSON db
import fs from "fs";
import path from "path";

// handle requests and reponses
import { ServerResponse, IncomingMessage } from "http";

// notification structure
import { Notification } from "./notification";
import { Settings } from "./settings";

// validation of data received
// Note: validation ca ben done
// - manually
// - using a validation library (e.g. AJV)
// - dynamically, using TypeScript JSON Validator to automatically generate schema and validation function (using AJV under the hood).
// as in this project I'm not using any external library, I'm going to validate manually.
const validate = (data:Notification) => {
    if (typeof data.type != "string") return false;
    if (typeof data.text != "string") return false;
    if (typeof data.read != "boolean") return false;
    // everyhting is present and of the correct type
    // now I check data.type is one of the valid options
    if (!((data.type == "info") || (data.type == "warning") || (data.type == "error"))) return false;
    // check data.text is not empty
    if (data.text === "") return false;
    // further conditions can be added...

    // all good
    return true;
};

// validation of id received
// used when a notification is to be marked read
const validateId = (data:Notification) => {
    if (typeof data.id != "number") return false;
    // id present and of the correct type
    // check data.id is not a negative number
    if (data.id < 0) return false;
    // further conditions can be added...

    // all good
    return true;
};

// sending out the response from the server
// used by getNotifications, addNotification, updateNotification
const outputJSON = (res:ServerResponse, status:number, success:boolean, data:string | Notification | Notification[]) => {
    // header
    res.writeHead(status, { 
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*" // to avoid CORS issue
    });
    // sending data out
    res.end(
        JSON.stringify({
            success: success,
            message: data,
        })
    );
}

// used by addNotification, updateNotification to update the JSON db
const writeJSON = (res:ServerResponse, notification:Notification, notifications:Notification[]) => {
    try {
        // write the new notifications array to the db.json file
        fs.writeFile(
            path.join(__dirname, Settings.db_file),
            JSON.stringify(notifications),
            (err) => {
                // Check if any errors
                if (err) {
                    // error!
                    outputJSON(res, 500, false, err.message);
                } else {
                    // send the new | updated notification as confirmation
                    outputJSON(res, 200, true, notification);
                }
            }
        );
    } catch(e){
        // catch any error so the server doesn't break
        outputJSON(res, 500, false, String(e));
    } 
}

// get the unread notifications
const getNotifications = (res:ServerResponse) => {
    fs.readFile(
      path.join(__dirname, Settings.db_file),
      "utf8",
      (err, data) => {
        // Check out any errors
        if (err) {
          // error!
          outputJSON(res, 500, false, err.message);
        } else {
          try {
            // get all the current notifications (read and unread)
            const notifications:Notification[] = JSON.parse(data);
            // this will contain the unread ones only
            let unread_notifications:Notification[] = [];
            // find the unread ones
            notifications.forEach((element:Notification) => {
                if (element.read == false){
                    unread_notifications.push(element);
                }
            });
            // send data
            outputJSON(res, 200, true, unread_notifications);
          } catch(e){
            // catch any error so the server doesn't break
            outputJSON(res, 500, false, String(e));
          } 
        }
      }
    );
 };

 // add a notification
 const addNotification = (req:IncomingMessage, res:ServerResponse) => {
    // Read the data from the request
    let data:string = "";
    req.on("data", (chunk) => {
      data += chunk.toString();
    });
 
    // When the request is completed
    req.on("end", () => {
      try {
        // Parse the data
        let notification:Notification = JSON.parse(data);
        // validation of data received
        if (!validate(notification)) {
            // error
            outputJSON(res, 500, false, "Error: Notification not valid");
        } else {
            // Read the JSON db
            fs.readFile(path.join(__dirname, Settings.db_file), "utf8", (err, data) => {
                // Check out any errors
                if (err) {
                    // error!
                    outputJSON(res, 500, false, err.message);
                } else {
                    // get the current notifications
                    let notifications:Notification[] = JSON.parse(data);
                    // find the highest/latest id
                    let latest_id:number = notifications.reduce(
                        (max = 0, notification:Notification) => (notification.id > max ? notification.id : max),
                        0
                    );
                    // create the new notification (and increment the id by 1)
                    const new_notification:Notification = {id: latest_id + 1, type: notification.type, text: notification.text, read: notification.read};
                    // add the new notification to the array
                    notifications.push(new_notification);
                    // write the new notifications array
                    writeJSON(res, new_notification, notifications);
                }
            });
        }
      } catch(e){
        // catch any error so the server doesn't break
        // (e.g. badly formatted JSON received)
        outputJSON(res, 500, false, String(e));
      } 
    });
 };

 // mark a notification as read
 const updateNotificationAsRead = (req:IncomingMessage, res:ServerResponse) => {
    // Read the data from the request
    let data:string = "";
    req.on("data", (chunk) => {
      data += chunk.toString();
    });

    // When the request is completed
    req.on("end", () => {
      try {
        // Parse the data
        let notification:Notification = JSON.parse(data);
        // validation of data received (just the id)
        if (!validateId(notification)) {
            // error
            outputJSON(res, 500, false, "Error: Id not valid");
        } else {
            // Read the JSON db
            fs.readFile(path.join(__dirname, Settings.db_file), "utf8", (err, data) => {
                // Check out any errors
                if (err) {
                    // error!
                    outputJSON(res, 500, false, err.message);
                } else {
                    // get all the current notifications
                    let notifications: Notification[] = JSON.parse(data);
                    // find the notification with the correct id
                    let index = notifications.findIndex((n) => n.id == notification.id);
                    // has the notification been found?
                    if (index == -1) {
                        // error
                        outputJSON(res, 404, false, "Error: no notification found with index " + notification.id);
                    } else {
                        // mark the notification as read
                        notifications[index].read = true;
                        // write the updated notifications array to the JSON db
                        writeJSON(res, notification, notifications);
                    }
                }
            });
        }
      } catch(e){
        // catch any error so the server doesn't break
        // (e.g. badly formatted JSON received)
        outputJSON(res, 500, false, String(e));
      } 
    });
 };

 export { getNotifications, addNotification, updateNotificationAsRead, validate, validateId };
 