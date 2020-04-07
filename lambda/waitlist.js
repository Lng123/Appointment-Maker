const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient();
var ses = new AWS.SES({region: 'us-west-2'});


exports.handler = (event, context, callback) => {
    if (!event.requestContext.authorizer) {
      errorResponse('Authorization not configured', context.awsRequestId, callback);
      return;
    }


    const username = event.requestContext.authorizer.claims['cognito:username'];
    const recipient = [];
    recipient.push(username);

    const requestBody = JSON.parse(event.body);

    const Wtime = requestBody.Wtime;

    waitList(username, Wtime);
    sendEmail(recipient, Wtime);
};

function waitList(username, Wtime) {
    return ddb.update({
        TableName: 'Users',
        Key : {
            Username: username
        },
        UpdateExpression: "set Wtime = :w",
        ExpressionAttributeValues:{
            ":w":Wtime
        },
        ReturnValues:"UPDATED_NEW"

    }).promise();
}

function sendEmail(recipient, Wtime) {
    var params = {
        Destination: {
            ToAddresses: recipient
        },
        Message: {
            Body: {
                Text: { Data: "You have been waitlisted for " + Wtime + "."
                    
                }
                
            },
            
            Subject: { Data: "Waitlisted"
                
            }
        },
        Source: //email
    };

    
     ses.sendEmail(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log("success " + data);           // successful response
    });
}

function errorResponse(errorMessage, awsRequestId, callback) {
  callback(null, {
    statusCode: 500,
    body: JSON.stringify({
      Error: errorMessage,
      Reference: awsRequestId,
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
}
