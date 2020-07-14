import { useApiService } from "./useApiService";
import { ISong } from "../models/ISong";

/**
 * Get songs from database based on title or part of tilte
 * @param query title or part of title
 */
export const useGetFilteredSongs = (query: string) => {
    const url = "Song/songs";
    const params = { "Query": query.toString() };
    const initialData: ISong[] = [];
    const returnObject = useApiService<ISong[]>("get", url, { params, initialData });
    return returnObject;
}