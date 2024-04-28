const dynamodb = require("@aws-sdk/client-dynamodb");

const CONNECTIONS_TABLE_NAME = process.env.CONNECTIONS_TABLE_NAME;

const client = new dynamodb.DynamoDBClient({});

module.exports.handler = async (event) => {
    const connectionId = event.requestContext.connectionId;
    await client.send(new dynamodb.DeleteItemCommand({
        TableName: CONNECTIONS_TABLE_NAME,
        Key: {
            connectionId
        }
    }));
    return {"statusCode": 200};
}