export default class OrderItem {
    private _id: string;
    private _productId: string;
    private _orderId: string;
    private _name: string;
    private _quantity: number = 0;
    private _price: number;

    constructor(id: string, name: string, price: number, productId: string, quantity: number) {
        this._id = id;
        this._name = name;
        this._price = price;
        this._productId = productId;
        this._quantity = quantity;
    }

    get id(): string {
        return this._id;
    }

    get productId(): string {
        return this._productId;
    }

    get orderId(): string {
        return this._orderId;
    }

    get name(): string {
        return this._name;
    }

    get price(): number {
        return this._price;
    }

    get quantity(): number {
        return this._quantity;
    }

    set orderId(orderId:string) {
        this._orderId = orderId;
    }

    set quantity(quantity:number) {
        this._quantity = quantity;
    }

    orderItemTotal(): number {
        return this._price * this._quantity;
    }
}