import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/auth';

/**
 * @param method HTTP method, get or put
 * @param url Url to api
 * @param sendData data to be sent
 * @param initialData initial data
 */

//TODO: is initialData neccessary here? 

export const useApiService = <T extends Object>(method: "get" | "post", url: string, options: ApiServiceOptions<T>) => {
  const [data, setData] = useState<T | undefined>(options.initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [header, setHeader] = useState()
  const [status, setStatus] = useState(0)


  // Add params to the url   
  let baseUrl = 'https://localhost:5001/api/';
  let finalUrl = baseUrl + url;
  if (options.params) {
    finalUrl += '?' + new URLSearchParams(options.params).toString();
  }

  // fetchData og postData er like, men unntak av kallene  await axios.metode<T>(argumenter), hvordan fikser jeg det til én metode? 
  // axios[method]<T>(finalUrl, options.body) funker ikke.
  const fetchData = async () => {
    setIsError(false);
    setIsLoading(true);

    try {
      const result = await axios.get<T>(finalUrl);
      setData(result.data);
      setHeader(result.headers)
      setStatus(result.status)
    } catch (error) {
      setIsError(true);
      setErrorMessage(error);
      console.log(error);
    }
    setIsLoading(false);
  };

  const postData = async () => {
    setIsError(false);
    setIsLoading(true);

    try {
      const result = await axios.post<T>(finalUrl, options.body)
      setData(result.data)
      setHeader(result.headers)
      setStatus(result.status)
    } catch (error) {
      setIsError(true);
      setErrorMessage(error);
      console.log(error);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    method === "get" && fetchData();
  }, [method, finalUrl]);

  useEffect(() => {
    method === "post" && postData();
  }, [method, finalUrl]);


  return { data, isLoading, isError, errorMessage, fetchData, status, header } as ApiServiceReturn<T>;
};

/**
 * Params are added to the finalUrl
 * Body is sent as body to api
 */
export type ApiServiceOptions<T> = {
  body?: any;
  initialData?: T;
  params?: Record<string, string>;
  dependencies?: any[];
}

export type ApiServiceReturn<T> = {
  data: T;
  isLoading: boolean
  isError: boolean
  errorMessage: string
  fetchData: Function
  status: number
  header: any
}