import Order from "../../../domain/checkout/entity/order";
import OrderItem from "../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./sequelize/order-item.model";
import OrderModel from "./sequelize/order.model";

export default class OrderRepository implements OrderRepositoryInterface {

    async create(entity: Order): Promise<void> {

        await OrderModel.create({
            id: entity.id,
            customer_id: entity.customerId,
            total: entity.total(),
            items: entity.items.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                product_id: item.productId,
                quantity: item.quantity,
            })),
        },
        {
            include: [{model: OrderItemModel}],
        });

    }

    async update(entity: Order): Promise<void> {
        
        await OrderModel.update({
            id: entity.id,
            customer_id: entity.customerId,
            total: entity.total(),
        }, 
        {
            where: {
                id: entity.id,
            }
        });

        entity.items.map((item) => {
            OrderItemModel.update(
                {
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    product_id: item.productId,
                    order_id: entity.id,
                    quantity: item.quantity,
                },
                {
                    where: { id: item.id }
                }
            ).then(() => {});
        });
    }

    async find(id: String): Promise<Order> {
        const orderModel = await OrderModel.findOne(
            { 
              where: { id: id },
              include: ["items"], 
            });

        let orderItems:OrderItem[] = [];

        orderModel.items.map((itemModel) => {
            orderItems.push(new OrderItem(itemModel.id, itemModel.name, itemModel.price, itemModel.product_id, itemModel.quantity));
        });

        const order = new Order(orderModel.id, orderModel.customer_id, orderItems);

        return order;
    }

    async findAll(): Promise<Order[]> {
        const ordersModels = await OrderModel.findAll({
            include: ["items"],
        });

        const orders:Order[] = [];

        ordersModels.map((orderModel) => {
            let orderItems:OrderItem[] = [];

            orderModel.items.map((itemModel) => {
                orderItems.push(new OrderItem(itemModel.id, itemModel.name, itemModel.price, itemModel.product_id, itemModel.quantity));

                const order = new Order(orderModel.id, orderModel.customer_id, orderItems);

                orders.push(order);
            });
        });

        return orders;
    }
}