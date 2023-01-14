window.onload = function () {
    updateHost()
        .then(response => response.json())
        .then(data => {
            BACKEND_URL_BASE = 'http://' + data.host + ':' + data.port
            BACKEND_URL_BASE_S = 'https://' + data.host

            if (data.maintenance == true) {
                window.location.href = "/maintenance.html"
            } else {
                isFBConnected().then(isConnected => {
                    if (isConnected) {
                        readAccessToken().then(access_token => {
                            getProfileId(function (profile_id) {
                                // Validate user through Netflixy's API
                                validateUser(access_token, profile_id)
                                    .then(response => response.json())
                                    .then(data => {
                                        if (data.result == 'success') {
                                            window.location.href = "/dashboard.html";
                                        }
                                        else {
                                            chrome.runtime.sendMessage({ msg: "set", data: data.message }, (response) => {
                                                if (response) {
                                                    window.location.href = "/login.html";
                                                }
                                            });
                                        }
                                    })
                            })
                        })
                    } else {
                        window.location.href = "/login.html";
                    }
                })
            }
        })
}

function fpSensor() {
    var n1 = document.createElement('canvas');
    n1.width = 280, n1.height = 60, n1.style.display = 'none';
    var o1 = n1.getContext('2d');
    o1.fillStyle = 'rgb(102, 204, 0)', o1.fillRect(100, 5, 80, 50), o1.fillStyle = '#f60', o1.font = '16pt Arial', o1.fillText('<@nv45. F1n63r,Pr1n71n6!', 10, 40), o1.strokeStyle = 'rgb(120, 186, 176)', o1.arc(80, 10, 20, 0, Math.PI, !1), o1.stroke();
    var f1 = n1.toDataURL();

    var e1 = 0;
    for (var r = 0; r < f1.length; r++) {
        e1 = (e1 << 5) - e1 + f1.charCodeAt(r), e1 &= e1
    }
    f1 = e1.toString();

    var n2 = document.createElement('canvas');
    n2.width = 280, n2.height = 60, n2.style.display = 'none';
    var o2 = n2.getContext('2d');
    o2.fillStyle = 'rgb(102, 204, 0)', o2.fillRect(100, 5, 80, 50), o2.fillStyle = '#f60', o2.font = '16pt Arial', o2.fillText('m,Ev!xV67BaU> eh2m<f3AG3@', 10, 40), o2.strokeStyle = 'rgb(120, 186, 176)', o2.arc(80, 10, 20, 0, Math.PI, !1), o2.stroke();
    var f2 = n2.toDataURL();

    var e2 = 0;
    for (var r = 0; r < f2.length; r++) {
        e2 = (e2 << 5) - e2 + f2.charCodeAt(r), e2 &= e2
    }
    f2 = e2.toString();

    var params = 'f1=' + f1 + '&f2=' + f2;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", BACKEND_URL_BASE_S + "/addfp");
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.send(params);
}
