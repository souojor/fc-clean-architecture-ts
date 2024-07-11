import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infraestructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infraestructure/product/repository/product.repository";
import Product from "../../../domain/product/entity/product";
import ListProductUseCase from "./list.product.usecase";

describe("Test list products use case", () => {
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

    it("should list products", async () => {
        const productRepository = new ProductRepository();
        const usecase = new ListProductUseCase(productRepository);

        const product1 = new Product("123", "Product 1", 10.0);
        const product2 = new Product("456", "Product 2", 20.0);

        const persistedProduct1 = await productRepository.create(product1);
        const persistedProduct2 = await productRepository.create(product2);

        const input = {
        }

        const output = await usecase.execute(input);

        expect(output.products.length).toBe(2);
        expect(output.products[0].id).toBe(product1.id);
        expect(output.products[0].name).toBe(product1.name);
        expect(output.products[0].price).toBe(product1.price);
        expect(output.products[1].id).toBe(product2.id);
        expect(output.products[1].name).toBe(product2.name);
        expect(output.products[1].price).toBe(product2.price);

        const persistedProdutos = await productRepository.findAll();
 
        expect(output.products.length).toBe(2);
        expect(output.products[0].id).toBe(persistedProdutos[0].id);
        expect(output.products[0].name).toBe(persistedProdutos[0].name);
        expect(output.products[0].price).toBe(persistedProdutos[0].price);
        expect(output.products[1].id).toBe(persistedProdutos[1].id);
        expect(output.products[1].name).toBe(persistedProdutos[1].name);
        expect(output.products[1].price).toBe(persistedProdutos[1].price);
    });
});