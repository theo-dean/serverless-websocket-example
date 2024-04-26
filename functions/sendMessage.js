const apiGatewayClient = require("@aws-sdk/client-apigatewaymanagementapi");
const dynamodb = require("@aws-sdk/client-dynamodb");

const CONNECTIONS_TABLE_NAME = process.env.CONNECTIONS_TABLE_NAME;
const WEBSOCKET_API_ENDPOINT = process.env.WEBSOCKET_ENDPOINT;

const dynamoClient = new dynamodb.DynamoDBClient({});

module.exports.handler = async (event) => {
    console.log(JSON.stringify(event))
    const requestId = event.Records[0].dynamodb.Keys.requestId.S;
    const domainName = event.requestContext.domainName;
    const stage = event.requestContext.stage;
    console.log(JSON.stringify({requestId, domainName, stage}))

    const client = new apiGatewayClient.ApiGatewayManagementApiClient({endpoint: WEBSOCKET_API_ENDPOINT});
    const dynamoGetInput = {
        TableName: CONNECTIONS_TABLE_NAME,
        Key: {
            "requestId": {S: requestId}
        }
    }
    let data = null;
    try {
        data = (await dynamoClient.send(new dynamodb.GetItemCommand(dynamoGetInput))).Item;
        console.log("Dynamo Get Success", data);
    } catch (err) {
        console.error("Dynamo Get Error", err)
    }

    try {
    await client.send(new apiGatewayClient.PostToConnectionCommand({
        ConnectionId: data.connectionId.S,
        Data: JSON.stringify(data)
    })); 
    } catch (err) {
        console.error("API Gateway Error", err)
    }
}