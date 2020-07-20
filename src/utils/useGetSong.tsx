import { apiService } from "./apiService";
import { ISong } from "../models/ISong";

/**
 * Get one song
 * @param id songs id
 */
export const useGetSong = (id: number) => {
    const url = 'Song/songs';
    const params = { 'Id': id.toString() };
    const initialData: ISong[] = [];
    const getSongs = apiService<ISong[]>("get", url, { params, initialData }).fetchData;
    return getSongs;
}