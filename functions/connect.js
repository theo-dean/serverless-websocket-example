import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

export const handler = async (event) => {
    const connectionId = event.requestContext.connectionId;
    const domainName = event.requestContext.domainName;
    const stageName = event.requestContext.stage;
    const qs = event.queryStringParameters
    console.log('Connection ID: ', connectionId, 'Domain Name: ', domainName, 'Stage Name: ', stageName, 'Query Strings: ', qs)

    try {
        const client = new DynamoDBClient({});
        await client.send(new PutItemCommand({
            TableName: "ConnectionsTable",
            Item: {
                connectionId
            }
        }));
    } catch (e) {
        console.error(e);
        return {"statusCode": 500};
    }
    return {"statusCode": 200};
}