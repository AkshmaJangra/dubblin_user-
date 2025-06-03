import { authOptions } from "../app/api/auth/[...nextauth]/route"; // Adjust the path as necessary
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";

export async function getCurrentUser() {
    try {
        const isServer = process.env.IS_SERVER_FLAG ? true : false;
        let session: any;
        if (isServer) {
            session = await getServerSession(authOptions);
        } else {
            session = await getSession();
        }
        if (!session || !session.user) {
            return null;
        }
        return session.user;
    } catch (error) {
        return null;
    }
}
