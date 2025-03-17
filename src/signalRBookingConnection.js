import * as signalR from "@microsoft/signalr";

const notificationConnection = new signalR.HubConnectionBuilder()
    .withUrl("https://backend.csaposapp.hu/hubs/notifications", {withCredentials: false})
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Debug)
    .build();

export default notificationConnection;
