import { createContext, ReactNode, useContext } from "react"
import { IUser } from "../../models/IUser"
import { useGetUser } from "../../utils/useApiServiceUsers"
import { Loading } from "../loading/Loading.component"
import { Alert } from "@mui/material"

interface IUserContext {
    user: IUser
}

const UserContext = createContext<IUserContext | undefined>(undefined)

export const UserContextProvider = (props: { children?: ReactNode }) => {
    const { user, getUser } = useGetUser()

    if (getUser.loading) {
        return <Loading isLoading={true} />
    }
    if (getUser.error) {
        return <Alert severity={"error"}>{getUser.error.message}</Alert>
    }
    if (user) {
        return (
            <UserContext.Provider value={{ user }}>
                {props.children}
            </UserContext.Provider>
        )
    }
    return null
}

export const useUser = () => {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error("You are not in context of UserContextProvider")
    }
    return context
}
