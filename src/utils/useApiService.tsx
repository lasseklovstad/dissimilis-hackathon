import axios, { AxiosError, AxiosResponse } from "axios"
import { useHistory } from "react-router-dom"
import { DependencyList, useCallback, useEffect, useRef, useState } from "react"
import { IServerError } from "../models/IServerError"

type HTTPMethod = "get" | "put" | "delete" | "post"
type FetchReturn<T> = {
    result: AxiosResponse<T> | undefined
    isError: boolean
    error: AxiosError<IServerError> | undefined
}
const useDeepCompareMemoize = (value: DependencyList) => {
    const ref = useRef<DependencyList>()
    if (JSON.stringify(value) !== JSON.stringify(ref.current))
        ref.current = value
    return ref.current as DependencyList
}

const useDeepCallback = <T extends unknown>(
    cb: (method: HTTPMethod) => Promise<FetchReturn<T>>,
    deps: DependencyList
) => useCallback(cb, useDeepCompareMemoize(deps))

/**
 * Params are added to the finalUrl
 * Body is sent as body to api
 */
export type ApiServiceOptions<T> = {
    body?: any
    initialData?: T
    params?: Record<string, string>
    headers?: Record<string, string>
}

/**
 * @param method HTTP method, get or put
 * @param url Url to api
 * @param sendData data to be sent
 * @param initialData initial data
 */

export const useApiService = <T extends unknown>(
    url: string,
    options: ApiServiceOptions<T>
) => {
    const { body, headers, initialData, params } = options
    const { push } = useHistory()
    const source = axios.CancelToken.source()
    const [error, setError] = useState<AxiosError<IServerError> | undefined>(
        undefined
    )
    const [data, setData] = useState<T | undefined>(initialData)
    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const updateStates = (
        result: AxiosResponse<T> | undefined,
        isError: boolean,
        error: AxiosError<IServerError> | undefined
    ) => {
        setError(error)
        if (result?.data) {
            setData(result?.data)
        } else {
            setData(undefined)
        }
        setIsError(isError)
    }

    const fetchData = useDeepCallback<T>(
        async (method) => {
            // Add params to the url
            const baseUrl = process.env.REACT_APP_API_URL as string
            let finalUrl = baseUrl + url
            if (params) {
                finalUrl += `?${new URLSearchParams(params).toString()}`
            }

            let result: AxiosResponse<T> | undefined
            let axiosError: AxiosError<IServerError> | undefined
            let isError = false

            setIsLoading(true)

            try {
                switch (method) {
                    case "get":
                        result = await axios.get<T>(finalUrl, {
                            headers,
                            cancelToken: source.token,
                        })
                        break
                    case "put":
                        result = await axios.put<T>(finalUrl, body, {
                            headers,
                            cancelToken: source.token,
                        })
                        break
                    case "delete":
                        result = await axios.delete<T>(finalUrl, {
                            headers,
                            cancelToken: source.token,
                        })
                        break
                    case "post":
                        result = await axios.post<T>(finalUrl, body, {
                            headers,
                            cancelToken: source.token,
                        })
                        break
                    default:
                        break
                }
            } catch (error) {
                if (error?.response?.status === 401) {
                    push("/")
                    sessionStorage.removeItem("apiKey")
                    sessionStorage.removeItem("userId")
                }
                isError = true
                axiosError = error
            } finally {
                setIsLoading(false)
                updateStates(result, isError, axiosError)
            }
            return { result, isError, error: axiosError }
        },
        [url, body, params, source, headers]
    )

    const getData = useCallback(async () => {
        return fetchData("get")
    }, [fetchData])

    const postData = useCallback(async () => {
        return fetchData("post")
    }, [fetchData])

    const putData = useCallback(async () => {
        return fetchData("put")
    }, [fetchData])

    const deleteData = useCallback(async () => {
        return fetchData("delete")
    }, [fetchData])

    useEffect(() => {
        return () => {
            source.cancel()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return {
        getData,
        postData,
        putData,
        deleteData,
        data,
        isError,
        error,
        isLoading,
    }
}
