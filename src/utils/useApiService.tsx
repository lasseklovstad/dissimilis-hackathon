import axios, { AxiosError, AxiosResponse } from "axios"
import { useNavigate } from "react-router"
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

const getHeaders = () => {
    const apiKey = sessionStorage.getItem("apiKey") || ""
    const userId = sessionStorage.getItem("userId") || ""
    return { "X-API-Key": apiKey, "X-User-ID": userId }
}

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
    options?: ApiServiceOptions<T, R>
) => {
    const { body: bodyInit, headers = {}, initialData, params } = options || {}
    const navigate = useNavigate()
    const [error, setError] = useState<AxiosError<IServerError> | undefined>(
        undefined
    )
    const controller = useRef<AbortController>()

    const [data, setData] = useState<T | undefined>(initialData)
    const [isError, setIsError] = useState(false)
    const [loading, setLoading] = useState(false)

    const updateStates = (
        result: AxiosResponse<T> | undefined,
        isError: boolean,
        error: AxiosError<IServerError> | undefined
    ) => {
        if (controller.current?.signal.aborted) {
            return
        }
        setLoading(false)
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
            controller.current = new AbortController()
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
            if (!controller.current.signal.aborted) {
                setIsError(false)
                setError(undefined)
                setLoading(true)
            }

            try {
                switch (method) {
                    case "get":
                        result = await axios.get<T>(finalUrl, {
                            headers: { ...getHeaders(), ...headers },
                            signal: controller.current.signal,
                        })
                        break
                    case "patch":
                        result = await axios.patch<T>(
                            finalUrl,
                            body || bodyInit,
                            {
                                headers: { ...getHeaders(), ...headers },
                                signal: controller.current.signal,
                            }
                        )
                        break
                    case "delete":
                        result = await axios.delete<T>(finalUrl, {
                            headers: { ...getHeaders(), ...headers },
                            signal: controller.current.signal,
                        })
                        break
                    case "post":
                        result = await axios.post<T>(
                            finalUrl,
                            body || bodyInit,
                            {
                                headers: { ...getHeaders(), ...headers },
                                signal: controller.current.signal,
                            }
                        )
                        break
                    default:
                        break
                }
            } catch (error) {
                axiosError = error as AxiosError
                if (axiosError?.response?.status === 401) {
                    navigate("/")
                    sessionStorage.removeItem("apiKey")
                    sessionStorage.removeItem("userId")
                }
                isError = true
            } finally {
                updateStates(result, isError, axiosError)
            }
            return { result, isError, error: axiosError }
        },
        [url, bodyInit, params, headers]
    )

    const getData = useCallback(async () => fetchData("get"), [fetchData])

    const postData = useCallback(
        async (body?: unknown, appendUrl?: string) =>
            fetchData("post", body, appendUrl),
        [fetchData]
    )

    const putData = useCallback(
        async (body?: unknown, appendUrl?: string) =>
            fetchData("patch", body, appendUrl),
        [fetchData]
    )

    const deleteData = useCallback(
        async (appendUrl?: string) => fetchData("delete", null, appendUrl),
        [fetchData]
    )

    useEffect(() => {
        return () => {
            controller.current?.abort()
        }
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
