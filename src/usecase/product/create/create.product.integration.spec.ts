import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infraestructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infraestructure/product/repository/product.repository";
import CreateProductUseCase from "./create.product.usecase";

describe("Test create product use case", () => {
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

    it("should create a product", async () => {
        const productRepository = new ProductRepository();
        const usecase = new CreateProductUseCase(productRepository);

        const input = {
            name: "Product 1",
            price: 10.0,
        }

        const output = await usecase.execute(input);

        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            price: input.price,
        });

        const persisted = await productRepository.find(output.id);

        expect(output).toEqual({
            id: persisted.id,
            name: persisted.name,
            price: persisted.price,
        });
    });
});