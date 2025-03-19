import * as signalR from "@microsoft/signalr";

const bookingConnection = new signalR.HubConnectionBuilder()
    .withUrl("https://backend.csaposapp.hu/hubs/booking", {withCredentials: false})
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Debug)
    .build();

export default bookingConnection;
