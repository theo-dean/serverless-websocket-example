const apiGatewayClient = require("@aws-sdk/client-apigatewaymanagementapi");
const dynamodb = require("@aws-sdk/client-dynamodb");

const CONNECTIONS_TABLE_NAME = process.env.CONNECTIONS_TABLE_NAME;
const WEBSOCKET_API_ENDPOINT = process.env.WEBSOCKET_ENDPOINT;

const dynamoClient = new dynamodb.DynamoDBClient({});

module.exports.handler = async (event) => {
    const requestId = event.Records[0].dynamodb.Keys.requestId.S;
    const client = new apiGatewayClient.ApiGatewayManagementApiClient({endpoint: WEBSOCKET_API_ENDPOINT});
    const dynamoGetInput = {
        TableName: CONNECTIONS_TABLE_NAME,
        Key: {
            "requestId": {S: requestId}
        }
    };
    const data = (await dynamoClient.send(new dynamodb.GetItemCommand(dynamoGetInput))).Item;
    await client.send(new apiGatewayClient.PostToConnectionCommand({
        ConnectionId: data.connectionId.S,
        Data: JSON.stringify(data)
    }));
}