import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infraestructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infraestructure/product/repository/product.repository";
import UpdateProductUseCase from "./update.product.usecase";
import Product from "../../../domain/product/entity/product";

describe("Test update product use case", () => {
    let sequelize: Sequelize;

    beforeEach(async() => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true }
        });

        sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should update a product", async () => {
        const productRepository = new ProductRepository();
        const usecase = new UpdateProductUseCase(productRepository);

        const product = new Product("123", "Product 1", 10.0);

        const persistedProduct = await productRepository.create(product);

        const input = {
            id: "123",
            name: "Product 1 alt",
            price: 15.0,
        }

        const output = await usecase.execute(input);

        expect(output).toEqual(input);

        const persisted = await productRepository.find(output.id);

        expect(output).toEqual({
            id: persisted.id,
            name: persisted.name,
            price: persisted.price,
        });
    });
});