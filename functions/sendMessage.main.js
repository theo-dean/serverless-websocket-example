const apiGatewayClient = require("@aws-sdk/client-apigatewaymanagementapi");

module.exports.handler = async (event) => {
    const callbackUrl = process.env.WEBSOCKETS_API_DOMAIN;
    const client = new apiGatewayClient.ApiGatewayManagementApiClient({endpoint: callbackUrl});

    await Promise.all(event.Records
        .map(r =>
            client.send(new apiGatewayClient.PostToConnectionCommand({
                    ConnectionId: r.connectionId,
                    Data: r.data
                }
            )))
    );
}
