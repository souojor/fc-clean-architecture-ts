import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../customer/repository/sequelize/customer.model";
import OrderModel from "./sequelize/order.model";
import OrderItemModel from "./sequelize/order-item.model";
import ProductModel from "../../product/repository/sequelize/product.model";
import CustomerRepository from "../../customer/repository/customer.repository";
import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";
import Product from "../../../domain/product/entity/product";
import OrderItem from "../../../domain/checkout/entity/order_item";
import OrderRepository from "./order.repository";
import Order from "../../../domain/checkout/entity/order";
import ProductRepository from "../../product/repository/product.repository";

describe("Order repository test", () => {
    let sequelize: Sequelize;
  
    beforeEach(async () => {
      sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        sync: { force: true },
      });
  
      sequelize.addModels([
        OrderItemModel,
        OrderModel,
        CustomerModel,
        ProductModel,
      ]);
      await sequelize.sync();
    });
  
    afterEach(async () => {
      await sequelize.close();
    });

    it("should create a new order", async () => {
      const customerRepository = new CustomerRepository();
      const customer = new Customer("123", "Customer 1");
      const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
      customer.changeAddress(address);
      await customerRepository.create(customer);
  
      const productRepository = new ProductRepository();
      const product = new Product("123", "Product 1", 10);
      await productRepository.create(product);
  
      const orderItem = new OrderItem(
        "1",
        product.name,
        product.price,
        product.id,
        2
      );
  
      const order = new Order("123", "123", [orderItem]);
  
      const orderRepository = new OrderRepository();
      await orderRepository.create(order);

      const orderModel = await OrderModel.findOne({
        where: { id: order.id },
        include: ["items"],
      });
  
      expect(orderModel.toJSON()).toStrictEqual({
        id: "123",
        customer_id: "123",
        total: order.total(),
        items: [
          {
            id: orderItem.id,
            name: orderItem.name,
            price: orderItem.price,
            quantity: orderItem.quantity,
            order_id: "123",
            product_id: "123",
          },
        ],
      });
    });

    it("should update an order", async () => {
      const customerRepository = new CustomerRepository();
      const customer = new Customer("123", "Customer 1");
      const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
      customer.changeAddress(address);
      await customerRepository.create(customer);
  
      const productRepository = new ProductRepository();
      const product = new Product("123", "Product 1", 10);
      await productRepository.create(product);
  
      const orderItem = new OrderItem(
        "1",
        product.name,
        product.price,
        product.id,
        2
      );
  
      const order = new Order("123", "123", [orderItem]);
  
      const orderRepository = new OrderRepository();
      await orderRepository.create(order);

      const customer2 = new Customer("321", "Customer 2");
      const address2 = new Address("Street 2", 2, "Zipcode 2", "City 2");
      customer2.changeAddress(address2);
      await customerRepository.create(customer2);

      order.changeCustomer("321");
      orderItem.quantity = 3;

      await orderRepository.update(order);

      const orderModel = await OrderModel.findOne({
        where: { id: order.id },
        include: ["items"],
      });
  
      expect(orderModel.toJSON()).toStrictEqual({
        id: "123",
        customer_id: customer2.id,
        total: order.total(),
        items: [
          {
            id: orderItem.id,
            name: orderItem.name,
            price: orderItem.price,
            quantity: 3,
            order_id: "123",
            product_id: "123",
          },
        ],
      });
    });

    it("should find an order", async () => {
      const customerRepository = new CustomerRepository();
      const customer = new Customer("123", "Customer 1");
      const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
      customer.changeAddress(address);
      await customerRepository.create(customer);
  
      const productRepository = new ProductRepository();
      const product = new Product("123", "Product 1", 10);
      await productRepository.create(product);
  
      const orderItem = new OrderItem(
        "1",
        product.name,
        product.price,
        product.id,
        2
      );
  
      const order = new Order("123", "123", [orderItem]);
  
      const orderRepository = new OrderRepository();
      await orderRepository.create(order);

      const orderModel = await OrderModel.findOne(
        { 
          where: { id: "123" },
          include: ["items"], 
        });

      const foundOrder = await orderRepository.find("123");

      expect(orderModel.toJSON()).toStrictEqual({
        id: foundOrder.id,
        customer_id: foundOrder.customerId,
        total: foundOrder.total(),
        items: [
          {
            id: foundOrder.items[0].id,
            name: foundOrder.items[0].name,
            price: foundOrder.items[0].price,
            quantity: foundOrder.items[0].quantity,
            product_id: foundOrder.items[0].productId,
            order_id: foundOrder.items[0].orderId,
          },
        ],
      });
    });

    it("should find all orders", async () => {
      const customerRepository = new CustomerRepository();
      const customer = new Customer("123", "Customer 1");
      const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
      customer.changeAddress(address);
      await customerRepository.create(customer);
  
      const productRepository = new ProductRepository();
      const product = new Product("123", "Product 1", 10);
      await productRepository.create(product);
  
      const orderItem = new OrderItem(
        "1",
        product.name,
        product.price,
        product.id,
        2
      );
  
      const order = new Order("123", "123", [orderItem]);
  
      const orderRepository = new OrderRepository();
      await orderRepository.create(order);

      const customer2 = new Customer("321", "Customer 2");
      const address2 = new Address("Street 2", 2, "Zipcode 2", "City 2");
      customer2.changeAddress(address2);
      await customerRepository.create(customer2);
  
      const product2 = new Product("321", "Product 2", 20);
      await productRepository.create(product2);
  
      const orderItem2 = new OrderItem(
        "2",
        product2.name,
        product2.price,
        product2.id,
        4
      );
  
      const order2 = new Order("321", "321", [orderItem2]);
  
      await orderRepository.create(order2);

      const orderModel = await OrderModel.findOne(
        { 
          where: { id: "123" },
          include: ["items"], 
        });

      const foundOrders = await orderRepository.findAll();
      const orders = [order, order2];

      expect(foundOrders).toEqual(orders);
    });
  });