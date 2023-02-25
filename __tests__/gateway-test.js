const request = require('supertest');
const router = require('../app');
const gatewayServices = require('../sdk/services/GatewayService');
const connectDb = require('../sdk/repositories/db/index');
const { server } = require('../app');
const {beforeAll} = require("@jest/globals");


jest.setTimeout(10000); // set timeout to 10 seconds

jest.mock('../sdk/services/GatewayService');
jest.mock('../sdk/repositories/db/index');

beforeAll(() => {
    connectDb.mockImplementation(() => Promise.resolve())
    // gatewayServices.getGateways.mockReset();
});

describe('GET /api/gateways', () => {
    beforeEach(() => {
        // connectDb.mockImplementation(() => Promise.resolve())
        gatewayServices.getGateways.mockReset();
    });

    it('should return a list of gateways', async () => {
        const mockGateways = [
            {
                "peripherals": [],
                "serialNumber": "6164f4b4cbff01dc6fd57f6a",
                "name": "Gateway 1",
                "ipv4": "192.168.1.1",
                "id": "63f7cfc6029f5688918be567"
            },
            {
                "serialNumber": "6164f4b4cbff01dc6fd57f6b",
                "name": "Gateway 1",
                "ipv4": "192.168.1.1",
                "peripherals": [],
                "id": "63f7dd66123667532cd0acf1"
            },
            {
                "serialNumber": "6164f4b4cbff01dc6fd57f60",
                "name": "Gateway 4",
                "ipv4": "192.168.1.1",
                "peripherals": [],
                "id": "63f936d7b8477ccc263d5f4f"
            }
        ];
        gatewayServices.getGateways.mockResolvedValue(mockGateways);

        const res = await request(router).get('/api/gateways');

        expect(res.status).toBe(200);
        expect(res.body.message.gateways).toEqual(mockGateways);
    });

    it('should return an error if gatewayServices.getGateways() throws an error', async () => {
        const mockError = new Error('Failed to get gateways');
        gatewayServices.getGateways.mockRejectedValue(mockError);

        const res = await request(router).get('/');

        expect(res.status).toBe(404);
        expect(res.body.error).toEqual({"message": "Not Found"}
        );
    });
});


describe('POST /api/gateways', () => {
    beforeEach(() => {
        // connectDb.mockImplementation(() => Promise.resolve())
        gatewayServices.createGateway.mockReset();
    });

    it('should not  create a new gateway with wrong serial  number', async () => {
        const mockGateway = {
            "name": "Gateway 5",
            "serialNumber": "123445",
            "ipv4": "192.168.1.5"
        };

        gatewayServices.createGateway.mockResolvedValue(true);

        const res = await request(router)
            .post('/api/gateways')
            .send(mockGateway);

        expect(res.status).toBe(422);
    });


});


afterAll(() => {
    server.close();
});
