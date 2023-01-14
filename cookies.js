let NETFLIX_DOMAIN = "https://www.netflix.com/";
let FACEBOOK_DOMAIN = "https://www.facebook.com/";

function clearAllCookies() {
  chrome.cookies.getAll({}, function (cookies) {
    for (var i in cookies) {
      removeCookie(cookies[i]);
    }
  });
}

function setNetflixCookies(NetflixId, SecureNetflixId) {
  var cookie1 = {
    name: "NetflixId",
    value: NetflixId,
    domain: ".netflix.com",
    url: NETFLIX_DOMAIN
  };

  var cookie2 = {
    name: "SecureNetflixId",
    value: SecureNetflixId,
    domain: ".netflix.com",
    url: NETFLIX_DOMAIN
  };

  return new Promise(resolve => {
    chrome.cookies.set(cookie1, function (_cookie) {
      chrome.cookies.set(cookie2, function (_cookie) {
        resolve(true)
      })
    })
  })
}

function removeCookie(cookie) {
  chrome.cookies.remove({ url: NETFLIX_DOMAIN, name: cookie.name })
}

function getProfileId(callback) {
  chrome.cookies.get({ url: FACEBOOK_DOMAIN, name: 'c_user' }, function (cookie) {
    if (cookie != undefined)
      callback(cookie.value)
    else (callback(''))
  });
}