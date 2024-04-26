const dynamodb = require("@aws-sdk/client-dynamodb");

const CONNECTIONS_TABLE_NAME = process.env.CONNECTIONS_TABLE_NAME;

const client = new dynamodb.DynamoDBClient({});

module.exports.handler = async (event) => {
    const connectionId = event.requestContext.connectionId;
    const domainName = event.requestContext.domainName;
    const stageName = event.requestContext.stage;
    const qs = event.queryStringParameters;
    console.log('Connection ID: ', connectionId, 'Domain Name: ', domainName, 'Stage Name: ', stageName, 'Query Strings: ', qs);

    try {
        const requestId = qs["requestId"];
        if (!requestId) throw new Error("Invalid RequestId", requestId);
        
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
    } catch (e) {
        console.error(e);
        return {"statusCode": 500};
    }
    return {"statusCode": 200};
}

const getTtl = (minutes) => {
    return parseInt((Date.now() / 1000) + minutes*60);
}