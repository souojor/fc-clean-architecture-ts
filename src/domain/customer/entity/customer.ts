/*
Complexidade de negócio
Domain
- Entity
    - customer.ts //(regra de negócio)

Complexidade acidental
infra - mundo externo
- Entity / Model
    - customer.ts //(regra de negócio)
*/

import Entity from "../../@shared/entity/entity.abstract";
import EventDispatcher from "../../@shared/event/event-dispatcher";
import EventDispatcherInterface from "../../@shared/event/event-dispatcher.interface";
import CustomerAddressChangedEvent from "../event/customer-address-changed.event";
import CustomerCreatedEvent from "../event/customer-created.event";
import Address from "../value-object/address";

export default class Customer extends Entity{
    private _name: string = "";
    private _address!: Address;
    private _active: boolean = true;
    private _rewardPoints: number = 0;
    private _eventDispatcher: EventDispatcherInterface;

    constructor(id: string, name: string, eventDispatcher?: EventDispatcherInterface) {
        super();
        this.id = id;
        this._name = name;

        this.validate();

        if (this.notification.hasErrors()) {
            throw new Error(this.notification.messages());
        }

        this._eventDispatcher = eventDispatcher;

        if (eventDispatcher !== undefined) {
            const customerCreatedEvent = new CustomerCreatedEvent({
                id: id,
                name: name,
            });
            
            eventDispatcher.notify(customerCreatedEvent);
        }
    }

    validate() {
        if (this._name.length === 0) {
            this.notification.addError({
                context: "customer",
                message: "Name is required",
            });
        }
        if (this.id.length === 0) {
            this.notification.addError({
                context: "customer",
                message: "Id is required",
            });
        }
    }

    changeName(name: string) {
        this._name = name;
        this.validate();
    }

    changeAddress(address: Address) {
        this._address = address;
        this._address.validate();

        if (this._eventDispatcher !== undefined) {
            const customerCreatedEvent = new CustomerAddressChangedEvent({
                id: this.id,
                name: this._name,
                address: this._address,
            });
            
            this._eventDispatcher.notify(customerCreatedEvent);
        }
    }

    activate() {
        if (this._address == null) {
            throw new Error("Address is mandatory to activate a customer.");
        }
        this._active = true;
    }

    deactivate() {
        this._active = false;
    }

    isActive(): boolean {
        return this._active;
    }

    get name(): string {
        return this._name;
    }

    get address(): Address {
        return this._address;
    }

    set name(name: string) {
        this._name = name;
    }

    addRewardPoints(points: number) {
        this._rewardPoints += points;
    }

    get rewardPoints(): number {
        return this._rewardPoints;
    }
}