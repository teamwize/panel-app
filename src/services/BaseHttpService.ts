const BASE_URL: string = getBaseURL();
console.log("BASE_URL", BASE_URL);

function getBaseURL(): string {
  // @ts-ignore
  let env = import.meta.env.MODE;
  console.log("env :", env);
  let customBaseURL: string | null = localStorage.getItem("BASE_URL");
  if (customBaseURL) return customBaseURL;
  switch (env) {
    case "local": {
      return "https://api.teamwize.app";
    }
    case "development": {
      return "https://api.teamwize.app";
    }
    case "staging": {
      return "https://api.teamwize.app";
    }
    case "production": {
      return "https://api.teamwize.app";
    }
    default: {
      return "https://api.teamwize.app";
    }
  }
}

function doFetch(url: string, options?: RequestInit): Promise<any> {
  if (!options) options = {};
  if (!options.headers) options.headers = {};
  const abortController = new AbortController();
  options.signal = abortController.signal;
  const accessToken = getAccessToken();
  if (accessToken) {
    (options.headers as Record<string, string>)["Authorization"] = "Bearer " + accessToken;
  }
  options.mode= "cors";
  const promise = fetch(url, options).then(async response => {
    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : null;
    if (!response.ok) {
      const error = (data) || response.status;
      return Promise.reject(error);
    }
    return data;
  });
  (promise as Promise<any> & { abort: () => void }).abort = () => {
    abortController.abort("locally");
  };

  return promise;
}

function getAccessToken(): string | null {
  return localStorage.getItem("ACCESS_TOKEN");
}

export {
  doFetch,
  BASE_URL as baseURL
}