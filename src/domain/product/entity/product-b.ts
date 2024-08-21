import Entity from "../../@shared/entity/entity.abstract";
import NotificationError from "../../@shared/notification/notification.error";
import ProductValidatorFactory from "../factory/product.validator.factory";
import ProductInterface from "./product.interface";

export default class ProductB extends Entity implements ProductInterface {

    private _name: string;
    private _price: number;

    constructor(id: string, name: string, price: number) {
        super();
        this.id = id;
        this._name = name;
        this._price = price;

        this.validate();

        if (this.notification.hasErrors()) {
            throw new NotificationError(this.notification.getErrors());
        }
    }

    validate() {
        ProductValidatorFactory.create().validate(this);
    }

    changeName(name: string) {
        this._name = name;
        this.validate();
    }

    get name(): string {
        return this._name;
    }

    changePrice(price: number) {
        this._price = price;
        this.validate();
    }

    get price(): number {
        return this._price * 2;
    }
}