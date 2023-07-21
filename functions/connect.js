const dynamodb = require("@aws-sdk/client-dynamodb");

const client = new dynamodb.DynamoDBClient({region: "eu-west-1"});

module.exports.handler = async (event) => {
    const connectionId = event.requestContext.connectionId;
    const domainName = event.requestContext.domainName;
    const stageName = event.requestContext.stage;
    const qs = event.queryStringParameters;
    console.log('Connection ID: ', connectionId, 'Domain Name: ', domainName, 'Stage Name: ', stageName, 'Query Strings: ', qs);

    try {
        //if (!requestId) throw new Error("Invalid RequestId", requestId);
        const requestId = qs["requestId"];
        console.log("ReqId?", requestId);       
        await client.send(new dynamodb.PutItemCommand({
            TableName: "ConnectionsTable",
            Item: {
                "connectionId": {
                    "S": requestId
                },
                "products": {
                    "M": {}
                },
                "ttl": {
                    "N": getTtl(30)
                }
            }
        }));
    } catch (e) {
        console.error(e);
        return {"statusCode": 500};
    }
    return {"statusCode": 200, body: JSON.stringify({
        connectionId
    })}; // Can the client access this data?
}

const getTtl = (minutes) => {
    return parseInt((Date.now() / 1000) + minutes*60);
}