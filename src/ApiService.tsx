import React, { Fragment, useState, useEffect } from 'react';
import axios, { Method } from 'axios';
import Axios from 'axios';
import { Song } from './Song';
 

/**
 * 
 * @param method HTTP method, get or put
 * @param url Url to api
 * @param sendData data to be sent
 * @param initialData initial data
 */

//TODO: is initialData neccessary here? 

const useApiService = <T extends Object>(method: "get" | "post", url: string, sendData?: T, initialData?: T) => {
  const [data, setData] = useState<T | undefined>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);
 
      try {
        switch(method){
          case "get" : {
            const result = await axios[method]<T>(url);
            setData(result.data);
            break;
          }
          case "post" : {
            const result = await axios[method]<T>(url, sendData);
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
  }, [url]);
 
  return [{ data, isLoading, isError }, url] as const;
};

export default useApiService