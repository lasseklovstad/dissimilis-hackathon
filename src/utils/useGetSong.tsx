import { useApiService } from "./useApiService";
import { ISong } from "../models/ISong";

/**
 * Get one song
 * @param id songs id
 */
export const useGetSong = (id: number) => {
    const url = 'songs/';
    const params = { 'Id': id.toString() };
    const initialData: ISong[] = [];
    const getSongs = useApiService<ISong[]>("get", url, { params, initialData }).fetchData;
    return getSongs;
}