import { DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { IUser } from "../../../models/IUser"
import { useSnackbarContext } from "../../../utils/snackbarContextProvider.component"
import { useShareSong } from "../../../utils/useApiServiceSongs"
import { DialogButton } from "../../CustomDialogComponents/DialogButton.components"
import { GroupUsersAutocomplete } from "./GroupUsersAutocomplete.component"

type GroupUsersDialogProps = {
    onClose: () => void
    onAddUser: (user: IUser[]) => void
    sharedWithUser: IUser[]
    songId: number
}

export const GroupUsersDialog = ({
    onClose,
    onAddUser,
    sharedWithUser,
    songId,
}: GroupUsersDialogProps) => {
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null)
    const { shareSong } = useShareSong(songId)
    const { launchSnackbar } = useSnackbarContext()
    const { t } = useTranslation()

    const handleAddUser = async ({ email }: IUser) => {
        const { error, result } = await shareSong.run(
            null,
            `?userEmail=${email}`
        )
        if (!error && result) {
            onAddUser(result.data)
        }
        if (error) {
            launchSnackbar(t("Snackbar.addShareUser"), true)
        }
    }

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault()
                selectedUser && handleAddUser(selectedUser)
            }}
        >
            <DialogTitle>{t("Dialog.shareWithPerson")}</DialogTitle>
            <DialogContent>
                <GroupUsersAutocomplete
                    disableUsers={sharedWithUser.map((user) => user.userId)}
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                />
            </DialogContent>
            <DialogActions>
                <DialogButton
                    disabled={!selectedUser || shareSong.loading}
                    type="submit"
                    variant="contained"
                >
                    {t("Dialog.addPerson")}
                </DialogButton>
                <DialogButton onClick={onClose}>
                    {t("Dialog.cancel")}
                </DialogButton>
            </DialogActions>
        </form>
    )
}
