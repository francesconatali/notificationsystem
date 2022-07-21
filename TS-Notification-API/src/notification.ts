// Defining the message type
type messageType = "info" | "warning" | "error";

// Notification structure
interface Notification {
    id: number;
    type: messageType;
    text: string;
    read: boolean;
 }
 
 export { Notification }
