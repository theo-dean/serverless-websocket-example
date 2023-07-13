const dynamodb = require("@aws-sdk/client-dynamodb");

module.exports.handler = async (event) => {
    const connectionId = event.requestContext.connectionId;
    const domainName = event.requestContext.domainName;
    const stageName = event.requestContext.stage;
    const qs = event.queryStringParameters
    console.log('Connection ID: ', connectionId, 'Domain Name: ', domainName, 'Stage Name: ', stageName, 'Query Strings: ', qs)

    const client = new dynamodb.DynamoDBClient({});
    try {
        await client.send(new dynamodb.DeleteItemCommand({
            TableName: "ConnectionsTable",
            Key: {
                connectionId
            }
        }));
    } catch (e){
        console.error(e);
        return {"statusCode": 500};
    }
    return {"statusCode": 200};
}