'use server';

import { clerkClient } from "@clerk/nextjs/server";
import { parseStringify } from "../utils";
import { liveblocks } from "../liveblocks";

export const getClerkUsers = async ({ userIds }: { userIds: string[] }) => {
    try {
        const { data } = await clerkClient.users.getUserList({
            emailAddress: userIds,
        });

        const users = data.map((user) => ({
            id: user.id,
            name: user.fullName,
            email: user.emailAddresses[0].emailAddress,
            avatar: user.imageUrl,
        }));

        const sortedUsers = userIds.map((email) => users.find((user) => user.email === email));

        return parseStringify(sortedUsers) as Omit<User, "userType">[];
    } catch (error) {
        console.error(error);
    }
}

export const getDocumentUsers = async ({roomId, currentUser, text}: {roomId: string, currentUser: string, text: string}) => {
    try {
        const room = await liveblocks.getRoom(roomId);

        const users = Object.keys(room.usersAccesses).filter((email) => email !== currentUser);

        if(text.length) {
            const lowerCaseText = text.toLowerCase();

            const filteredUsers = users.filter((email) => email.toLowerCase().includes(lowerCaseText));

            return parseStringify(filteredUsers) as string[];
        }

        return parseStringify(users) as string[];
    } catch (error) {
        console.error("Error fetching document users: ", error);
    }
}
