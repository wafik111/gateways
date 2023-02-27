const request = require('supertest');
const router = require('../src/server');
const gatewayServices = require('../src/api/Gateway/services/GatewayService');
const peripheralServices = require('../src/api/Peripheral/services/PeripheralService');

const connectDb = require('../src/database');
const { httpServer } = require('../src/server');
const { beforeAll, describe } = require("@jest/globals");
const Gateway = require('../src/api/Gateway/models/Gateway')

jest.mock('../src/api/Gateway/services/GatewayService');
jest.mock('../src/api/Peripheral/services/PeripheralService');

jest.mock('../src/api/Gateway/models/Gateway');
jest.mock('../src/database');

beforeAll(() => {
	connectDb.mockImplementation(() => Promise.resolve())
});

describe('GET /api/gateways', () => {
	beforeEach(() => {
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
		expect(res.body.data).toEqual(mockGateways);
	});

	it('should return an error if gatewayServices.getGateways() throws an error', async () => {
		const mockError = new Error('Failed to get gateways');
		gatewayServices.getGateways.mockRejectedValue(mockError);

		const res = await request(router).get('/');

		expect(res.status).toBe(404);
		expect(res.body.error).toEqual({ "message": "Not Found" }
		);
	});
});


describe('POST /api/gateways', () => {
	beforeEach(() => {
		gatewayServices.createGateway.mockReset();
	});

	it('should not create a new gateway with wrong IPv4', async () => {
		const mockGateway = {
			"name": "Gateway 5",
			"serialNumber": "123445",
			"ipv4": "192.168.1"
		};

		gatewayServices.createGateway.mockResolvedValue(true);

		const res = await request(router)
			.post('/api/gateways')
			.send(mockGateway);

		expect(res.status).toBe(422);
	});

	it('should create a new gateway with valid data', async () => {
		const mockGateway = {
			"name": "Gateway 5",
			"serialNumber": "123445",
			"ipv4": "192.168.1.1"
		};

		gatewayServices.createGateway.mockResolvedValue(true);

		const res = await request(router)
			.post('/api/gateways')
			.send(mockGateway);

		expect(res.status).toBe(201);
	});
});


describe('POST /api/gateways/:serialNumber/peripherals', () => {
	beforeEach(() => {
		peripheralServices.createPeripheral.mockReset();
	});

	it('should create a peripheral device on an existing gateway', async () => {
		const mockPerph = {
			"uid": 1010,
			"vendor": "Samsung",
			"status": "online"
		}

		peripheralServices.createPeripheral.mockResolvedValue(true);

		const res = await request(router)
			.post('/api/gateways/123456/peripherals')
			.send(mockPerph);

		expect(res.status).toBe(201);
	})

	it('should not create a peripheral with wrong data', async () => {
		const mockPerph = {
			"uid": '1010',
			"vendor": "Samsung",
			"status": "online"
		}

		peripheralServices.createPeripheral.mockResolvedValue(true);

		const res = await request(router)
			.post('/api/gateways/123456/peripherals')
			.send(mockPerph);

		expect(res.status).toBe(201);
	})
})



afterAll(() => {
	httpServer.close();
});