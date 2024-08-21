import Notification from "../notification/notification";

export default abstract class Entity {
    public id: string;
    public notification: Notification;

    constructor() {
        this.notification = new Notification();
    }
    
}