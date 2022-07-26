var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var n_type = "info";
var n_text = "";
function updateType(value) {
    n_type = value;
    // return focus on the input text,
    // avoiding a click to refocus on the message
    document.getElementById("n_text").focus();
}
function updateText(value) {
    n_text = value;
    // update the submit button
    var submit_button = document.getElementById("submit_button");
    submit_button.disabled = n_text.length > 2 ? false : true;
}
function getNotifications() {
    return __awaiter(this, void 0, void 0, function () {
        var res, res_json, list_notifications, bell, tot_notification, _i, _a, i, new_notification, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch('http://localhost:3001/api/notifications', {
                            method: "GET",
                            cache: "no-cache"
                        })];
                case 1:
                    res = _b.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    res_json = _b.sent();
                    // has it been successful?
                    if (res_json["success"]) {
                        list_notifications = document.getElementById('list_notifications');
                        bell = document.getElementById('bell');
                        // reset
                        list_notifications.innerHTML = "";
                        tot_notification = 0;
                        // for each notification received
                        for (_i = 0, _a = res_json["message"]; _i < _a.length; _i++) {
                            i = _a[_i];
                            // count
                            tot_notification += 1;
                            new_notification = document.createElement("li");
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
                    }
                    else {
                        console.log("getNotifications was not successful. " + res_json["message"]);
                    }
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _b.sent();
                    console.log("InternalError: " + e_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function addNotification() {
    return __awaiter(this, void 0, void 0, function () {
        var data, res, res_json, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    data = { id: 0, type: n_type, text: n_text, read: false };
                    return [4 /*yield*/, fetch('http://localhost:3001/api/notifications', {
                            method: "POST",
                            headers: {
                                "Content-Type": "text/plain"
                            },
                            body: JSON.stringify(data)
                        })];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    res_json = _a.sent();
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
                    }
                    else {
                        console.log("addNotification was not successful. " + res_json["message"]);
                    }
                    return [3 /*break*/, 4];
                case 3:
                    e_2 = _a.sent();
                    console.log("InternalError: " + e_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function markreadNotification(n_id) {
    return __awaiter(this, void 0, void 0, function () {
        var data, res, res_json, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    data = { id: n_id };
                    return [4 /*yield*/, fetch('http://localhost:3001/api/notifications', {
                            method: "PUT",
                            headers: {
                                "Content-Type": "text/plain"
                            },
                            body: JSON.stringify(data)
                        })];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    res_json = _a.sent();
                    // has it been successful?
                    if (res_json["success"] === true) {
                        // update the list
                        getNotifications();
                    }
                    else {
                        console.log("markreadNotification was not successful. " + res_json["message"]);
                    }
                    return [3 /*break*/, 4];
                case 3:
                    e_3 = _a.sent();
                    console.log("InternalError: " + e_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
