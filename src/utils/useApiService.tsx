import { useState, useEffect } from 'react';
import axios from 'axios';


/**
 * 
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

  // Legg til parametere i urlen    
  let baseUrl = 'https://localhost:5001/api/';
  let finalUrl = baseUrl + url;
  if (options.params) {
    finalUrl += '?' + new URLSearchParams(options.params).toString();
  }
  console.log("Api-kall")

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        switch (method) {
          case "get": {
            const result = await axios.get<T>(finalUrl);
            setData(result.data);
            break;
          }
          case "post": {
            const result = await axios.post<T>(finalUrl, options.body);
            setData(result.data);
            break;
          }

        }

      } catch (error) {
        setIsError(true);
        console.log(error);
      }

      setIsLoading(false);
    };

    fetchData();
  }, options.dependencies);

  return [data, isLoading, isError] as const;
};

/**
 * Params are added to the finalUrl
 * Body is sent as body to api
 */
export type ApiServiceOptions<T> = {
  body?: any;
  initialData?: T;
  dependencies?: [any]
  params?: Record<string, string>
}