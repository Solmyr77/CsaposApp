import * as signalR from "@microsoft/signalr";

const bookingConnection = new signalR.HubConnectionBuilder()
    .withUrl("https://backend.csaposapp.hu/hubs/booking")
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

export default bookingConnection;
