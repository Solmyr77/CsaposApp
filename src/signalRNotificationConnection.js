import * as signalR from "@microsoft/signalr";

const notificationConnection = new signalR.HubConnectionBuilder()
    .withUrl("https://backend.csaposapp.hu/hubs/notifications", {
        accessTokenFactory: ()=> JSON.parse(localStorage.getItem("accessToken")),
        transport: signalR.HttpTransportType.WebSockets
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Debug)
    .build();

export default notificationConnection;
