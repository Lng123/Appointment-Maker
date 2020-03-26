/*global WildRydes _config*/

var WildRydes = window.WildRydes || {};
// WildRydes.map = WildRydes.map || {};
function onLoad(){
    var body = document.getElementsByTagName("body")[0];
    var select = document.getElementById("booktime")
    var wselect = document.getElementById("waittime")
    fetch("https://4qgn3wc3d2.execute-api.us-west-2.amazonaws.com/test/users").then((response=>response.json())).then((data) =>{
        console.log(data)
                for(let i = 0;i <data.Count;i++){
            let node = document.createElement("option")
              node.setAttribute("value", data.Items[i].btime);
            let textnode = document.createTextNode(data.Items[i].btime)
            node.appendChild(textnode)
            select.appendChild(node)
                        let node2 = document.createElement("option")
              node2.setAttribute("value", data.Items[i].wtime);
            let textnode2 = document.createTextNode(data.Items[i].wtime)
            node2.appendChild(textnode2)
            wselect.appendChild(node2)
        }
    })
}



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

    function email() {
        $.ajax({
            method: 'POST',
            url: _config.api.invokeUrl + '/ses',
            data: JSON.stringify({
            }),
            crossDomain: true,
            contentType: 'application/json',
            // success: function() { alert('Success')},
            error: function ajaxError(errorThrown) {
                console.error('Details: ', errorThrown);
            }
        });
    }

    // function requestUnicorn(pickupLocation) {
    //     $.ajax({
    //         method: 'POST',
    //         url: _config.api.invokeUrl + '/ride',
    //         headers: {
    //             Authorization: authToken
    //         },
    //         data: JSON.stringify({
    //             PickupLocation: {
    //                 Latitude: pickupLocation.latitude,
    //                 Longitude: pickupLocation.longitude
    //             }
    //         }),
    //         contentType: 'application/json',
    //         success: completeRequest,
    //         error: function ajaxError(jqXHR, textStatus, errorThrown) {
    //             console.error('Error requesting ride: ', textStatus, ', Details: ', errorThrown);
    //             console.error('Response: ', jqXHR.responseText);
    //             alert('An error occured when requesting your unicorn:\n' + jqXHR.responseText);
    //         }
    //     });
    // }

    function completeRequest(result) {
        var unicorn;
        var pronoun;
        console.log('Response received from API: ', result);
        unicorn = result.Unicorn;
        pronoun = unicorn.Gender === 'Male' ? 'his' : 'her';
        displayUpdate(unicorn.Name + ', your ' + unicorn.Color + ' unicorn, is on ' + pronoun + ' way.');
        animateArrival(function animateCallback() {
            displayUpdate(unicorn.Name + ' has arrived. Giddy up!');
            WildRydes.map.unsetLocation();
            $('#request').prop('disabled', 'disabled');
            $('#request').text('Set Pickup');
        });
    }

    // Register click handler for #request button
    $(function onDocReady() {
        // $('#request').click(handleRequestClick);
        $('#signOut').click(function() {
            WildRydes.signOut();
            alert("You have been signed out.");
            window.location = "signin.html";
        });

        // if (!_config.api.invokeUrl) {
        //     $('#noApiMessage').show();
        // }
        $("#book").click(requestAppointment);
        $("#waitlist").click(requestWaitlist);
        $("#email").click(email);
    });

    // function handlePickupChanged() {
    //     var requestButton = $('#request');
    //     requestButton.text('Request Unicorn');
    //     requestButton.prop('disabled', false);
    // }

    // function handleRequestClick(event) {
    //     var pickupLocation = WildRydes.map.selectedPoint;
    //     event.preventDefault();
    //     requestUnicorn(pickupLocation);
    // }

    // function animateArrival(callback) {
    //     var dest = WildRydes.map.selectedPoint;
    //     var origin = {};

    //     if (dest.latitude > WildRydes.map.center.latitude) {
    //         origin.latitude = WildRydes.map.extent.minLat;
    //     } else {
    //         origin.latitude = WildRydes.map.extent.maxLat;
    //     }

    //     if (dest.longitude > WildRydes.map.center.longitude) {
    //         origin.longitude = WildRydes.map.extent.minLng;
    //     } else {
    //         origin.longitude = WildRydes.map.extent.maxLng;
    //     }

    //     WildRydes.map.animate(origin, dest, callback);
    // }

    // function displayUpdate(text) {
    //     $('#updates').append($('<li>' + text + '</li>'));
    // }
}(jQuery));
