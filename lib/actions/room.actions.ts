"use server";

import { nanoid } from "nanoid";
import { liveblocks } from "../liveblocks";
import { revalidatePath } from "next/cache";
import { getAccessType, parseStringify } from "../utils";
import type { RoomData } from "@liveblocks/node";
import { redirect } from "next/navigation";
import { title } from "process";

export const createDocument = async ({
  userId,
  email,
}: CreateDocumentParams) => {
  const roomId = nanoid();

  try {
    const metadata = {
      creatorId: userId,
      email,
      title: "Untitled Document",
    };

    const usersAccesses: RoomAccesses = {
      [email]: ["room:write"],
    };

    const room = await liveblocks.createRoom(roomId, {
      // The default room permissions. `[]` for private, `["room:write"]` for public.
      defaultAccesses: [],
      usersAccesses,
      // Optional, custom metadata to attach to the room
      metadata,
    });

    revalidatePath("/");

    return parseStringify(room) as RoomData;
  } catch (error) {
    console.error("Error creating document: ", error);
  }
};

export const getDocument = async ({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);

    const hasAccess = Object.keys(room.usersAccesses).includes(userId);

    if (!hasAccess) {
      throw new Error("You do not have access to this document");
    }

    return parseStringify(room) as RoomData;
  } catch (error) {
    console.error("Error getting document: ", error);
  }
};

export const updateDocument = async (roomId: string, title: string) => {
  try {
    const updatedRoom = liveblocks.updateRoom(roomId, {
      metadata: {
        title: title
      }
    })

    revalidatePath(`/documents/${roomId}`);

    return parseStringify(updatedRoom) as RoomData
  } catch (error) {
    console.error("Error while updating document title: ", error);
  }
}

export const getDocuments = async (emailId: string) => {
  try {
    const rooms = await liveblocks.getRooms({userId: emailId});

    return parseStringify(rooms) as {
      nextPage: string | null;
      nextCursor: string | null;
      data: RoomData[]
    };
  } catch (error) {
    console.error("Error getting rooms: ", error);
  }
};

export const updateDocumentAccess = async ({roomId, email, userType, updatedBy}: ShareDocumentParams) => {
  try {
    const usersAccesses: RoomAccesses = {
      [email]: getAccessType(userType) as AccessType,
    };

    const updatedRoom = await liveblocks.updateRoom(roomId, {
      usersAccesses,
      metadata: {
        updatedBy: updatedBy.email
      }
    });

    if(updatedRoom) {
      const notificationId = nanoid();

      await liveblocks.triggerInboxNotification({
        userId: email,
        kind: '$documentAccess',
        subjectId: notificationId,
        activityData: {
          title: `You have been granted ${userType} access to this document by ${updatedBy.name}`,
          updatedBy: updatedBy.name,
          avatar: updatedBy.avatar,
          email: updatedBy.email,
        },
        roomId
      })
    }
    
    revalidatePath(`/documents/${roomId}`);

    return parseStringify(updatedRoom) as RoomData;
  } catch (error) {
    console.error("Error updating document access: ", error);
  }
}

export const removeCollaborator = async ({roomId, email}: {roomId: string, email: string}) => {
  try {
    const room = await liveblocks.getRoom(roomId);

    if(room.metadata.email === email) {
      throw new Error("You cannot remove yourself from the document");
    }

    const updatedRoom = await liveblocks.updateRoom(roomId, {
      usersAccesses: {
        [email]: null
      }
    });

    revalidatePath(`/documents/${roomId}`);
    return parseStringify(updatedRoom) as RoomData;
  } catch (error) {
    console.error("Error removing collaborator: ", error);
  }
}

export const deleteDocument = async (roomId: string) => {
  try {
    await liveblocks.deleteRoom(roomId);
    revalidatePath("/");
    redirect("/");
  } catch (error) {
    console.error("Error deleting document: ", error);
  }
};
