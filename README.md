## How to Use

This repo contains a deployable stack, and a locally run BE and FE example.

The stack can be deployed using Serverless. Adjust the `serverless.yml` file as necessary.

The FE and BE example work as follow:
 - In `exampleFE.html` replace the value for `apiGatewayWebsocketAddress` with the address of your Api Gateway, deployed above. 
 - Run `npm run fe` to run the example FE.
 - Click connect.
 - Once the Websocket connection has successfully connected, copy the RequestId.
 - Run the following command (with the RequestId from above replacing the prop) to simulate the BE response: `npm run start -- REQUEST_ID`
