import * as signalR from "@microsoft/signalr";

const bookingConnection = new signalR.HubConnectionBuilder()
    .withUrl("https://csaposapp.hu/backend/hubs/booking")
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build()

export default bookingConnection;
