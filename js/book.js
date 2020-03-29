
var WildRydes = window.WildRydes || {};
var availabletimes;
function onLoad(){
    availabletimes = ["9-10","10-11","11-12","12-1","1-2","2-3","3-4"]
    var body = document.getElementsByTagName("body")[0];
    var bselect = document.getElementById("booktime")
    var select = document.getElementById("waittime")
    
    $.ajax({
        url: 'https://dqo3x88vw4.execute-api.us-west-2.amazonaws.com/prod/home',
        type: 'GET',
                    error: function ajaxError(errorThrown) {
                console.error('Details: ', errorThrown);
            },
        success: function(data) {
            console.log(data + "fromajax");
            
            for(let i = 0; i<data.Count;i++){
            let node = document.createElement("option")
              node.setAttribute("value", data.Items[i].Wtime);
            let textnode = document.createTextNode(data.Items[i].Btime)
            node.appendChild(textnode)
            select.appendChild(node)
            availabletimes.remove(data.Items[i].Btime)
             for(let i = 0;i <availabletimes.length;i++){
            let node = document.createElement("option")
              node.setAttribute("value",availabletimes[i]);
            let textnode = document.createTextNode(availabletimes[i])
            node.appendChild(textnode)
            bselect.appendChild(node)
        }
            //console.log(availabletimes)
        }
            
        }
    });
    checkBooking(availabletimes);

}

function checkBooking(availtimes){
    var waittimes = [];
        $.ajax({
        url: 'https://dqo3x88vw4.execute-api.us-west-2.amazonaws.com/prod/home',
        type: 'GET',
                    error: function ajaxError(errorThrown) {
                console.error('Details: ', errorThrown);
            },
        success: function(data) {
            //console.log(data + "from checkbookingajax");
            
            for(let i = 0; i<data.Count;i++){
                waittimes.push(data.Items[i])
            }
            //console.log(waittimes + "waittimesarray")
             for(let i = 0;i <availtimes.length;i++){
                 for(let j = 0; j<waittimes.length;j++){
                     //console.log(waittimes[j].Wtime + "wtime")
                     if(availtimes[i] == waittimes[j].Wtime){
                         console.log("MATCHED, EMAIL this person - " + waittimes[j].Username)
                     }
                 }
                 
        }
            //console.log(availabletimes)
        }
            
        
    });
}

Array.prototype.remove = function() {
    var args, a = arguments, L = a.length, ax;
    while (L && this.length) {
        args = a[--L];
        while ((ax = this.indexOf(args)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};



(function rideScopeWrapper($) {
    var authToken;
    WildRydes.authToken.then(function setAuthToken(token) {
        if (token) {
            authToken = token;
        } else {
            window.location.href = '/signin.html';
        }
    }).catch(function handleTokenError(error) {
        alert(error);
        window.location.href = '/signin.html';
    });

    function requestAppointment() {
        let t = document.getElementById("booktime")
        let time = t.options[t.selectedIndex].value
        console.log(time)
        // fetch(" https://9sl3olysae.execute-api.us-west-2.amazonaws.com/prod/ride", {
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //         // "Access-Control-Allow-Origin" : "*",
        //         // "Access-Control-Allow-Credentials" : true,
        //         'Authorization': 'authToken'
        //       },
        //     method: "POST",
        //     body: JSON.stringify({
        //             Btime : time
        //     })
        // })
        $.ajax({
            method: 'POST',
            url: _config.api.invokeUrl + '/book',
            headers: {
                Authorization: authToken
            },
            data: JSON.stringify({
                Btime : time
            }),
            contentType: 'application/json',
            // success: completeRequest,
            error: function ajaxError(errorThrown) {
                console.error('Details: ', errorThrown);
            }
        });
        alert("Booked, an email confirmation should be sent");
        location.reload();
    }

    function requestWaitlist() {
        let t = document.getElementById("waittime")
        let time = t.options[t.selectedIndex].value
        console.log(time)
        $.ajax({
            method: 'POST',
            url: _config.api.invokeUrl + '/waitlist',
            headers: {
                Authorization: authToken
            },
            data: JSON.stringify({
                Wtime : time
            }),
            contentType: 'application/json',
            // success: function(response) {
            //     console.log(resposnse);
            // },
            error: function ajaxError(errorThrown) {
                console.error('Details: ', errorThrown);
            }
        });
        alert("Waitlisted");
        location.reload();
    }

    // Register click handler for #request button
    $(function onDocReady() {
        $('#signOut').click(function() {
            WildRydes.signOut();
            alert("You have been signed out.");
            window.location = "signin.html";
        });

        $("#book").click(requestAppointment);
        $("#waitlist").click(requestWaitlist);
    });

    
}(jQuery));
