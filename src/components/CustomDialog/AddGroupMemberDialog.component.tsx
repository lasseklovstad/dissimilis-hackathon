import React, { useEffect, useState } from "react"

import { IUser } from "../../models/IUser"
import { useGetUsers } from "../../utils/useApiServiceUsers"
import { useGetGroupOrOrganisationMembers } from "../../utils/useApiServiceGroups"
import { UserAutoCompleteDialog } from "./UserAutoCompleteDialog.component"

export const AddGroupMemberDialog = (props: {
    handleOnSaveClick: (value: IUser | undefined) => void
    handleOnCancelClick: () => void
    isLoading?: boolean
    isGroup: boolean
    groupId: number
    title: string
    descriptionText?: string
    saveText: string
}) => {
    const {
        handleOnSaveClick,
        handleOnCancelClick,
        isGroup,
        groupId,
        title,
        descriptionText = "",
        saveText,
    } = props

    const { getUsers, users } = useGetUsers()

    const { getGroupMembers, groupMembers } = useGetGroupOrOrganisationMembers(
        isGroup,
        groupId
    )

    const [userList, setUserList] = useState<any>(users)

    useEffect(() => {
        setUserList(
            users?.filter(
                (user) =>
                    !groupMembers?.some(
                        (member) => user.userId === member.userId
                    )
            )
        )
    }, [users, groupMembers])

    return (
        <>
            <UserAutoCompleteDialog
                handleOnCancelClick={handleOnCancelClick}
                handleOnSaveClick={handleOnSaveClick}
                saveText={saveText}
                title={title}
                userList={userList}
                descriptionText={descriptionText}
                isLoading={getUsers.loading || getGroupMembers.loading}
            />
        </>
    )
}
