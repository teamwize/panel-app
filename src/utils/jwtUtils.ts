function parseJwt(token: string): any {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

function isTokenExpired(token: string | null): boolean {
  const decoded = parseJwt(token);
  return Date.now() > decoded.exp * 1000;
}

export { parseJwt, isTokenExpired }