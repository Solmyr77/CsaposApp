import * as signalR from "@microsoft/signalr";

const managerConnection = new signalR.HubConnectionBuilder()
    .withUrl("https://backend.csaposapp.hu/hubs/manager", {withCredentials: false})
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Debug)
    .build();

export default managerConnection;
