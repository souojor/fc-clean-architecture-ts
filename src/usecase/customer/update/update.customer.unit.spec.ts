import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-object/address";
import UpdateCustomerUseCase from "./update.customer.usecase";


const customer = CustomerFactory.createWithAddress("John", new Address("Street", 123, "Zip", "City"));

const input = {
    id: customer.id,
    name: "John Updated",
    address: {
        street: "Street Updated",
        city: "City Updated",
        number: 1234,
        zip: "Zip Updated",
    }
};

const MockRepository = () => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(customer)),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn().mockReturnValue(Promise.resolve(input)),
    }
}

describe("Unit test for update customer use case", () => {

    it("should update a customer", async () => {
        const customerRepository = MockRepository();
        const usecase = new UpdateCustomerUseCase(customerRepository);

        const output = await usecase.execute(input);

        expect(output).toEqual(input);

    });
});