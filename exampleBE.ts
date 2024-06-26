const cry = require("crypto");
const dynamodb = require("@aws-sdk/client-dynamodb");
var WebSocketClient = require('websocket').client;

var wsc = new WebSocketClient();
const dynamoClient = new dynamodb.DynamoDBClient({});

const requestId = process.argv[2];
if (!requestId) throw Error("Invalid Request ID: "+requestId);

const main = async (requestId) => {
    for (var i = 0; i <= 10; i++){
        const randomInt = cry.randomInt(200);
        const product = {productCode: randomInt, blah:"blah"}
        await sleep(cry.randomInt(1000, 3000));
        const input = {
            TableName: "serverless-websockets-example-connections-table-test",
            Key: {
                requestId: {S: requestId}
            },
            UpdateExpression: `SET products.#productCode = :product`,
            ExpressionAttributeNames: {
                "#productCode": randomInt.toString()
            },
            ExpressionAttributeValues: {
                ":product": {S: JSON.stringify(product)}
            }
        };
        try {
            //console.log("DynamoDB Update Input", input);
            await dynamoClient.send(new dynamodb.UpdateItemCommand(input))
            console.log(`Added Product ${product.productCode} to the Results Table`);
        } catch (err){
            console.error("DynamoDB Error", err);
            break;
        }
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

main(requestId).then(() => console.info("Finished"));