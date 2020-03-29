
var WildRydes = window.WildRydes || {};
function onLoad(){
    var availabletimes = ["9-10","10-11","11-12","12-1","1-2","2-3","3-4"]
    var body = document.getElementsByTagName("body")[0];
    var bselect = document.getElementById("booktime")
    var select = document.getElementById("waittime")
    fetch("https://9sl3olysae.execute-api.us-west-2.amazonaws.com/prod/home").then((response=>response.json())).then((data) =>{
        console.log(data);
        console.log(data.Count);
        for(let i = 0;i <data.Count;i++){
            console.log("test");
            let node = document.createElement("option")
              node.setAttribute("value", data.Items[i].btime);
            let textnode = document.createTextNode(data.Items[i].btime)
            node.appendChild(textnode)
            select.appendChild(node)
            availabletimes.remove(data.Items[i].btime)
            //console.log(availabletimes)
        }
    }).then((data) => {
        for(let i = 0;i <availabletimes.length;i++){
            let node = document.createElement("option")
              node.setAttribute("value",availabletimes[i]);
            let textnode = document.createTextNode(availabletimes[i])
            node.appendChild(textnode)
            bselect.appendChild(node)
        }
})
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
        $.ajax({
            method: 'POST',
            url: _config.api.invokeUrl + '/ride',
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
        $("#email").click(email);
    });

    
}(jQuery));
