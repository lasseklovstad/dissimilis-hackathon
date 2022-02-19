import React from "react"
import { Route, Routes, Navigate } from "react-router-dom"
import { DashboardView } from "./views/DashboardView/DashboardView"
import { LoginView } from "./views/LoginView/LoginView"
import { SongView } from "./views/SongView/SongView"
import { ExportView } from "./views/ExportView/ExportView"
import { LibraryView } from "./views/LibrayView/LibraryView"
import { AdminView } from "./views/AdminView/AdminView"
import { GroupAdminView } from "./views/AdminView/GroupAdminView"
import { SongContextProvider } from "./context/song/SongContextProvider.component"
import { UserContextProvider } from "./components/UserContextProvider/UserContextProvider"

export const SongRouting = () => {
    return (
        <SongContextProvider>
            <Routes>
                <Route path=":songId" element={<SongView />} />
                <Route path=":songId/export" element={<ExportView />} />
            </Routes>
        </SongContextProvider>
    )
}

export const Routing = () => {
    return (
        <Routes>
            <Route path="/" element={<LoginView />} />
            <Route path={"/*"} element={<PrivateRoutes />} />
        </Routes>
    )
}

const PrivateRoutes = () => {
    if (sessionStorage.getItem("apiKey") && sessionStorage.getItem("userId")) {
        return (
            <UserContextProvider>
                <Routes>
                    <Route path="dashboard" element={<DashboardView />} />
                    <Route path="library" element={<LibraryView />} />
                    <Route path="admin" element={<AdminView />} />
                    <Route
                        path="admin/organisation/:organisationId"
                        element={<GroupAdminView />}
                    />

                    <Route path="song/*" element={<SongRouting />} />
                </Routes>
            </UserContextProvider>
        )
    }
    return <Navigate to="/" replace />
}
