import axios, { AxiosResponse } from "axios"
import { useHistory } from "react-router-dom"
import { DependencyList, useCallback, useEffect, useRef, useState } from "react"

type HTTPMethod = "get" | "put" | "delete" | "post"
type FetchReturn<T> = {
    result: AxiosResponse<T> | undefined
    isError: boolean
    errorMessage: any
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

export const useApiService = <T extends unknown>(
    url: string,
    options: ApiServiceOptions<T>
) => {
    const { body, headers, initialData, params } = options
    const { push } = useHistory()
    const source = axios.CancelToken.source()
    const [error, setError] = useState<string | undefined>(undefined)
    const [data, setData] = useState<T | undefined>(initialData)
    const [isError, setIsError] = useState(false)
    const [loading, setLoading] = useState(false)

    const updateStates = (
        result: AxiosResponse<T> | undefined,
        isError: boolean,
        errorMessage: string | undefined
    ) => {
        setError(errorMessage)
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
            let errorMessage
            let isError = false

            setLoading(true)

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
                errorMessage = error
            } finally {
                setLoading(false)
                updateStates(result, isError, errorMessage)
            }
            return { result, isError, errorMessage }
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
        state: {
            isError,
            error,
            loading,
        },
    }
}
