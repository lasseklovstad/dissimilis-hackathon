import { useApiService } from "./useApiService";
import { ISong } from "../models/ISong";

/**
 * Get songs from database based on title or part of tilte
 * @param query title or part of title
 */
<<<<<<< HEAD
export const useGetFilteredSongs = (query: string, dependencies: [any]) => {
    console.log("Get filtered")
    const url = "Song/filtered";
    const params = { "Query": query.toString() }
    const [dataFromApi, isLoading, isError] = useApiService<ISong[]>("get", url, { params, dependencies });

    return dataFromApi
=======
export const useGetFilteredSongs = (query: string) => {
    const url = "Song/songs";
    const params = { "Query": query.toString() };
    const initialData: ISong[] = [];
    const [dataFromApi, isLoading, isError, errorMessage] = useApiService<ISong[]>("get", url, { params, initialData });
    return dataFromApi;
>>>>>>> ff641083b0d54c960c49923ddb8ed02c140e5b7c
}