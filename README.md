# Gateways API
<p>This repository contains an API that manages IoT gateways and their associated peripherals. It is built using Node.js, 
Express.js, and MongoDB.</p>


# Prerequisites
<p>To run this API, you need to have the following installed on your machine:</p>

Docker
docker-compose

# Setup
1- Clone this repository using git clone https://github.com/wafik111/gateways.git.<br>
2- Navigate into the cloned repository directory.<br>
3- Run docker-compose up --build to start the API and MongoDB in a Docker container.<br>


# Usage
You can access the API using http://localhost:3000/api/gateways. The following endpoints are available:

GET `/api/gateways`: Returns a list of all gateways and their associated peripherals.<br>
POST `/api/gateways`: Creates a new gateway.<br>
GET `/api/gateways/:serialNumber`: Returns the gateway with the specified ID.<br>
POST `/api/gateways/:serialNumber/peripherals`: create a certain peripheral on specific gateway.<br>
DELETE `/api/gateways/:serialNumber/peripherals/:peripheralId` remove a certain peripheral from gateway.<br>

# use postman to test the api
import the postman collection from the root of the project


# Testing
To run the tests, use the following command:

npm test

This will run the unit tests for the API

