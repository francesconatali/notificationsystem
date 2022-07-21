// Defining the message type
type messageType = "info" | "warning" | "error";

// Notification structure
interface Notification {
    id: number;
    type: messageType;
    text: string;
    read: boolean;
 }

let n_type:string = "info";
let n_text:string = "";

function updateType(value:string): void {
    n_type = value;
    // return focus on the input text,
    // avoiding a click to refocus on the message
    document.getElementById("n_text").focus()
}
function updateText(value:string): void {
    n_text = value;

    // update the submit button
    let submit_button = <HTMLInputElement> document.getElementById("submit_button");
    submit_button.disabled = n_text.length > 2 ? false : true;
}

async function getNotifications() {

    try {
        // calling the API
        const res = await fetch('http://localhost:3001/api/notifications', {
            method: "GET",
            cache: "no-cache"
        });
        const res_json = await res.json();
        // has it been successful?
        if (res_json["success"]) {
            const list_notifications:HTMLElement = document.getElementById('list_notifications');
            const bell:HTMLElement = document.getElementById('bell');
            // reset
            list_notifications.innerHTML = "";
            let tot_notification: number = 0;
            // for each notification received
            for (let i of res_json["message"]) {
                // count
                tot_notification += 1;
                // new <li> element
                const new_notification: HTMLLIElement = document.createElement("li");
                new_notification.className = "notification type-" + i["type"];
                new_notification.innerHTML = i["text"] +
                    "<button class='markread-button' onclick='markreadNotification(" + i["id"] + ")'>X</button>";
                // adding to the list
                list_notifications.appendChild(new_notification);
            }
            // updating the bell
            bell.setAttribute("data-badge", tot_notification.toString());
            // if there are notifications, the badge is hidden
            bell.className = tot_notification > 0 ? "" : "hiddenbadge";
        } else {
            console.log("getNotifications was not successful. " + res_json["message"])
        }
    }
    catch (e) {
        console.log("InternalError: " + e)
    }
}

async function addNotification() {

    try {
        // preparing the JSON to be sent
        const data = {id:0, type: n_type, text: n_text, read: false};
        // calling the API
        const res = await fetch('http://localhost:3001/api/notifications', {
            method: "POST",
            headers: {
                "Content-Type": "text/plain"
            },
            body: JSON.stringify(data)
        });
        const res_json = await res.json();
        // has it been successful?
        if (res_json["success"] === true) {
            // update the list
            getNotifications();
            if (n_type === "error") {
                // to fulfill the requirement
                // "interrupt the processing that generated them"
                // to make sure this notification is acknowledged 
                alert(n_text);
            }
        } else {
            console.log("addNotification was not successful. " + res_json["message"])
        }
    }
    catch (e) {
        console.log("InternalError: " + e)
    }
}

async function markreadNotification(n_id:number) {

    try {
        // preparing the JSON to be sent
        const data = {id: n_id};
        // calling the API
        const res = await fetch('http://localhost:3001/api/notifications', {
            method: "PUT",
            headers: {
                "Content-Type": "text/plain"
            },
            body: JSON.stringify(data)
        });
        const res_json = await res.json();
        // has it been successful?
        if (res_json["success"] === true) {
            // update the list
            getNotifications();
        } else {
            console.log("markreadNotification was not successful. " + res_json["message"])
        }
    }
    catch (e) {
        console.log("InternalError: " + e)
    }
}
