import { useState, useEffect, useContext } from 'react';
import axios, { AxiosResponse } from 'axios';
import { AuthContext } from '../contexts/auth';
import { Token } from './useLoginPost';

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
    let result: AxiosResponse<T> | undefined = undefined;
    let error: any

    try {
      console.log("Options.headers:" + options.headers)
      result = await axios.get<T>(finalUrl, { headers: options.headers });
      setData(result.data);
      console.log("Her: " + result.headers.location)
      setHeader(result.headers)
      setStatus(result.status)
    } catch (err) {
      error = err
      setIsError(true);
      setErrorMessage(err);
      console.log(err);
    }
    setIsLoading(false);
    console.log(header);
    return { result, error }
  };

  const postData = async () => {
    setIsError(false);
    setIsLoading(true);
    let result: AxiosResponse<T> | undefined = undefined;
    let error: any

    try {
      console.log("Options.headers:" + options.headers)
      result = await axios.post<T>(finalUrl, options.body, { headers: options.headers });
      setData(result.data)
      setHeader(result.headers)
      setStatus(result.status)
    } catch (error) {
      setIsError(true);
      setErrorMessage(error);
      console.log(error);
    }
    setIsLoading(false);
    return { result, error }
  }
  return { fetchData, postData }
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

export type ApiServiceReturn<T> = {
  data: T;
  isLoading: boolean
  isError: boolean
  errorMessage: string
  fetchData: Function
  status: number
  header: any
}