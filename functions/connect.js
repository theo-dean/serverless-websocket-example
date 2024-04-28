const dynamodb = require("@aws-sdk/client-dynamodb");

const CONNECTIONS_TABLE_NAME = process.env.CONNECTIONS_TABLE_NAME;

const client = new dynamodb.DynamoDBClient({});

module.exports.handler = async (event) => {
    const connectionId = event.requestContext.connectionId;
    const qs = event.queryStringParameters;
    const requestId = qs["requestId"];

    await client.send(new dynamodb.PutItemCommand({
        TableName: CONNECTIONS_TABLE_NAME,
        Item: {
            "requestId": {
                "S": requestId
            },
            "connectionId": {
                "S": connectionId
            },
            "products": {
                "M": {}
            },
            "ttl": {
                "N": getTtl(30).valueOf().toString()
            }
        }
    }));
    return {"statusCode": 200};
}

const getTtl = (minutes) => {
    return parseInt((Date.now() / 1000) + minutes*60);
}