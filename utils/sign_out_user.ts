'use client'
import { signOut as nextAuthSignOut } from "next-auth/react";

async function signOut() {
    localStorage.removeItem('signed_email');
    nextAuthSignOut();
}

export default signOut