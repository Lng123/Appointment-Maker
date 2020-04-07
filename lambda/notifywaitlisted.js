const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
var ses = new AWS.SES({region: 'us-west-2'});


exports.handler = (event) => {


    const requestBody = JSON.parse(event.body);
    
    const username = requestBody.recipient;
    const Wtime = requestBody.Wtime;

    sendEmail(username, Wtime);
    const response = {
        statusCode: 200,
        body: JSON.stringify({recipient:username, Wtime,Wtime}),
    };
    return response;
};

function sendEmail(recipient, Wtime) {
    var params = {
        Destination: {
            ToAddresses: recipient
        },
        Message: {
            Body: {
                Text: { Data: "The time slot " + Wtime + " is now available."
                    
                }
                
            },
            
            Subject: { Data: "Waitlist time available."
                
            }
        },
        Source: //email
    };

    
     ses.sendEmail(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log("success " + data);           // successful response
    });
}

