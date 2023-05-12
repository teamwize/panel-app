function doFetch(url, options) {
    if(!options) options = {};
    if(!options.headers) options.headers = {};
    const abortController = new AbortController();
    options.signal = abortController.signal;
    const accessToken = getAccessToken();
    if(accessToken) {
        options.headers["Authorization"]  = "Bearer " + accessToken;
    }
    const promise = fetch(url, options).then(async response => {
        const isJson = response.headers.get('content-type')?.includes('application/json');
        const data = isJson ? await response.json() : null;
        if (!response.ok) {
            const error = (data) || response.status;
            return Promise.reject(error);
        }
        return data;
    });
    promise.abort = () => {
        abortController.abort("locally");
    };

    return promise;
}

function getAccessToken() {
    return localStorage.getItem("ACCESS_TOKEN")
}

export default doFetch