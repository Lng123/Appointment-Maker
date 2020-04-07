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

    const Btime = requestBody.Btime;
    bookAppointment(username, Btime);
    sendEmail(recipient, Btime);
};


function bookAppointment(username, Btime) {
    console.log(username);
    console.log(Btime);
    return ddb.update({
        TableName: 'Users',
        Key : {
            Username: username
        },
        UpdateExpression: "set Btime = :t",
        ExpressionAttributeValues:{
            ":t":Btime
        },
        ReturnValues:"UPDATED_NEW"

    }).promise();
}


function sendEmail(recipient, Btime) {
    var params = {
        Destination: {
            ToAddresses: recipient
        },
        Message: {
            Body: {
                Text: { Data: "You have booked an appointment for " + Btime + "."
                    
                }
                
            },
            
            Subject: { Data: "Appointment booking"
                
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
