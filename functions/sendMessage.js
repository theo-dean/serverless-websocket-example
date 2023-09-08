const apiGatewayClient = require("@aws-sdk/client-apigatewaymanagementapi");
const dynamodb = require("@aws-sdk/client-dynamodb");

const dynamoClient = new dynamodb.DynamoDBClient({ region: "eu-west-1"});

module.exports.handler = async (event) => {
    const requestId = event.Records[0].dynamodb.Keys.requestId.S;

    const client = new apiGatewayClient.ApiGatewayManagementApiClient({endpoint: "https://2izayxe4sh.execute-api.eu-west-1.amazonaws.com/test"});
    const dynamoGetInput = {
        TableName: "tdean-serverless-websockets-example-ConnectionsTable",
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