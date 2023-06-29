import {
    ApiGatewayManagementApiClient,
    PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";

export async function handler(event) {
    const callbackUrl = process.env.WEBSOCKETS_API_DOMAIN;
    const client = new ApiGatewayManagementApiClient({endpoint: callbackUrl});

    await Promise.all(event.Records
        .map(r =>
            client.send(new PostToConnectionCommand({
                    ConnectionId: r.connectionId,
                    Data: r.data
                }
            )))
    );
}
