import axios, { AxiosResponse } from "axios"
import { useHistory } from "react-router-dom"

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
    const history = useHistory()

    // Add params to the url
    const baseUrl = process.env.REACT_APP_API_URL as string
    let finalUrl = baseUrl + url
    if (options.params) {
        finalUrl += `?${new URLSearchParams(options.params).toString()}`
    }

    const fetchData = async () => {
        let result: AxiosResponse<T> | undefined
        let errorMessage
        let isError = false

        try {
            result = await axios.get<T>(finalUrl, { headers: options.headers })
        } catch (error) {
            if (error?.response?.status === 401) {
                history.push("/")
                sessionStorage.removeItem("apiKey")
                sessionStorage.removeItem("userId")
            }
            isError = true
            errorMessage = error
            console.log(error)
        }
        return { result, isError, errorMessage }
    }

    const postData = async () => {
        let result: AxiosResponse<T> | undefined
        let errorMessage
        let isError = false
        try {
            result = await axios.post<T>(finalUrl, options.body, {
                headers: options.headers,
            })
        } catch (error) {
            if (error?.response?.status === 401) {
                history.push("/")
                sessionStorage.removeItem("apiKey")
                sessionStorage.removeItem("userId")
            }
            isError = true
            errorMessage = error
            console.log(error)
        }
        return { result, isError, errorMessage }
    }

    const putData = async () => {
        let result: AxiosResponse<T> | undefined
        let errorMessage
        let isError = false
        try {
            result = await axios.put<T>(finalUrl, options.body, {
                headers: options.headers,
            })
        } catch (error) {
            if (error?.response?.status === 401) {
                history.push("/")
                sessionStorage.removeItem("apiKey")
                sessionStorage.removeItem("userId")
            }
            isError = true
            errorMessage = error
            console.log(error)
        }
        return { result, isError, errorMessage }
    }

    const deleteData = async () => {
        let result: AxiosResponse<T> | undefined
        let errorMessage
        let isError = false
        try {
            result = await axios.delete<T>(finalUrl, {
                headers: options.headers,
            })
        } catch (error) {
            if (error?.response?.status === 401) {
                history.push("/")
                sessionStorage.removeItem("apiKey")
                sessionStorage.removeItem("userId")
            }
            isError = true
            errorMessage = error
            console.log(error)
        }
        return { result, isError, errorMessage }
    }

    return { fetchData, postData, putData, deleteData }
}

/**
 * Params are added to the finalUrl
 * Body is sent as body to api
 */
export type ApiServiceOptions<T> = {
    body?: any
    initialData?: T
    params?: Record<string, string>
    headers?: Record<string, string>
    dependencies?: any[]
}
