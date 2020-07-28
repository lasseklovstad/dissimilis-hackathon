import axios, { AxiosResponse } from 'axios';
import { useHistory } from 'react-router-dom';


/**
 * @param method HTTP method, get or put
 * @param url Url to api
 * @param sendData data to be sent
 * @param initialData initial data
 */

//TODO: isnn initialData neccessary here? 
export const useApiService = <T extends Object>(method: "get" | "post", url: string, options: ApiServiceOptions<T>) => {
  const history = useHistory();

  // Add params to the url   
  let baseUrl = 'https://dissimilis-api-dev.azurewebsites.net/api/';
  //let baseUrl = 'https://localhost:5001/api/';
  let finalUrl = baseUrl + url;
  if (options.params) {
    finalUrl += '?' + new URLSearchParams(options.params).toString();
  }

  // fetchData og postData er like, men unntak av kallene  await axios.metode<T>(argumenter), hvordan fikser jeg det til én metode? 
  // axios[method]<T>(finalUrl, options.body) funker ikke.
  const fetchData = async () => {
    let result: AxiosResponse<T> | undefined = undefined;
    let errorMessage: any
    let isError = false

    try {
      result = await axios.get<T>(finalUrl, { headers: options.headers });
    } catch (error) {
      if (error?.response?.status === 401) {
        history.push("/");
        sessionStorage.removeItem("apiKey");
        sessionStorage.removeItem("userId");
      }
      isError = true;
      errorMessage = error;
      console.log(error);
    }
    return { result, isError, errorMessage };
  };

  const postData = async () => {
    let result: AxiosResponse<T> | undefined = undefined;
    let errorMessage: any;
    let isError = false;
    try {
      result = await axios.post<T>(finalUrl, options.body, { headers: options.headers });
    } catch (error) {
      if (error?.response?.status === 401) {
        history.push("/");
        sessionStorage.removeItem("apiKey");
        sessionStorage.removeItem("userId");
      }
      isError = true;
      errorMessage = error;
      console.log(error);
    }
    return { result, isError, errorMessage };
  };

  const putData = async () => {
    let result: AxiosResponse<T> | undefined = undefined;
    let errorMessage: any;
    let isError = false;
    try {
      result = await axios.put<T>(finalUrl, options.body, { headers: options.headers });
    } catch (error) {
      if (error?.response?.status === 401) {
        history.push("/");
        sessionStorage.removeItem("apiKey");
        sessionStorage.removeItem("userId");
      }
      isError = true;
      errorMessage = error;
      console.log(error);
    }
    return { result, isError, errorMessage };
  };

  return { fetchData, postData, putData };
};

/**
 * Params are added to the finalUrl
 * Body is sent as body to api
 */
export type ApiServiceOptions<T> = {
  body?: any;
  initialData?: T;
  params?: Record<string, string>;
  headers?: Record<string, string>;
  dependencies?: any[];
}