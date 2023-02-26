# Gateways API
This repository contains an API that manages IoT gateways and their associated peripherals. It is built using Node.js, Express.js, and MongoDB.


# Prerequisites
To run this API, you need to have the following installed on your machine:

Node.js v14 or later
Docker
docker-compose

# Setup
1- Clone this repository using git clone https://github.com/wafik111/gateways.git.
2- Navigate into the cloned repository directory.
3- Run docker-compose up --build to start the API and MongoDB in a Docker container.


# Usage
You can access the API using http://localhost:3000/api/gateways. The following endpoints are available:

GET /api/gateways: Returns a list of all gateways and their associated peripherals.
POST /api/gateways: Creates a new gateway.
GET /api/gateways/:id: Returns the gateway with the specified ID.
DELETE /api/gateways/:id: Deletes the gateway with the specified ID.
POST /api/gateways/:serialNumber/peripherals: create a certain peripheral on specific gateway.
DELETE /api/gateways/:serialNumber/peripherals/:peripheralId remove a certain peripheral from gateway.


# Testing
To run the tests, use the following command:

npm test

This will run the unit tests for the API

