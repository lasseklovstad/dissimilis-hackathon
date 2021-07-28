import axios, { AxiosError, AxiosResponse } from "axios"
import { useHistory } from "react-router"
import { DependencyList, useCallback, useEffect, useRef, useState } from "react"
import { IServerError } from "../models/IServerError"

type HTTPMethod = "get" | "patch" | "delete" | "post"
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
    cb: (
        method: HTTPMethod,
        body?: unknown,
        appendUrl?: string
    ) => Promise<FetchReturn<T>>,
    deps: DependencyList
    // eslint-disable-next-line react-hooks/exhaustive-deps
) => useCallback(cb, useDeepCompareMemoize(deps))

/**
 * Params are added to the finalUrl
 * Body is sent as body to api
 */
export type ApiServiceOptions<T, R> = {
    body?: R
    initialData?: T
    appendUrl?: string
    params?: Record<string, string>
    headers?: Record<string, string>
}

export const useApiService = <T extends unknown, R = Record<string, unknown>>(
    url: string,
    options: ApiServiceOptions<T, R>
) => {
    const { body: bodyInit, headers, initialData, params } = options
    const { push } = useHistory()
    const source = axios.CancelToken.source()
    const [error, setError] = useState<AxiosError<IServerError> | undefined>(
        undefined
    )
    const [data, setData] = useState<T | undefined>(initialData)
    const [isError, setIsError] = useState(false)
    const [loading, setLoading] = useState(false)

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
        async (method, body?: unknown, appendUrl?: string) => {
            // Add params to the url
            const baseUrl = process.env.REACT_APP_API_URL as string
            let finalUrl = baseUrl + url + (appendUrl || "")
            if (params) {
                finalUrl += `?${new URLSearchParams(params).toString()}`
            }

            let result: AxiosResponse<T> | undefined
            let axiosError: AxiosError<IServerError> | undefined
            let isError = false

            // reset states
            setIsError(false)
            setError(undefined)
            setLoading(true)

            try {
                switch (method) {
                    case "get":
                        result = await axios.get<T>(finalUrl, {
                            headers,
                            cancelToken: source.token,
                        })
                        break
                    case "patch":
                        result = await axios.patch<T>(
                            finalUrl,
                            body || bodyInit,
                            {
                                headers,
                                cancelToken: source.token,
                            }
                        )
                        break
                    case "delete":
                        result = await axios.delete<T>(finalUrl, {
                            headers,
                            cancelToken: source.token,
                        })
                        break
                    case "post":
                        result = await axios.post<T>(
                            finalUrl,
                            body || bodyInit,
                            {
                                headers,
                                cancelToken: source.token,
                            }
                        )
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
                updateStates(result, isError, axiosError)
                setLoading(false)
            }
            return { result, isError, error: axiosError }
        },
        [url, bodyInit, params, source, headers]
    )

    const getData = useCallback(async () => fetchData("get"), [fetchData])

    const postData = useCallback(
        async (body?: unknown, appendUrl?: string) =>
            fetchData("post", body, appendUrl),
        [fetchData]
    )

    const putData = useCallback(
        async (body?: unknown) => fetchData("patch", body),
        [fetchData]
    )

    const deleteData = useCallback(
        async (appendUrl?: string) => fetchData("delete", null, appendUrl),
        [fetchData]
    )

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
