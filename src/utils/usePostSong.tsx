import { useApiService } from "./useApiService";

export const usePostSong = (title: string, timeSignature: string) => {
    const url = 'song';
    const apiKey = sessionStorage.getItem("apiKey") || "";
    const userId = sessionStorage.getItem("userId") || "";
    const headers = { 'X-API-Key': apiKey, 'X-User-ID': userId, }; const body = { "title": title, "timeSignature": timeSignature };
    const postSong = useApiService<number>("post", url, { headers, body }).postData;
    return postSong;
}