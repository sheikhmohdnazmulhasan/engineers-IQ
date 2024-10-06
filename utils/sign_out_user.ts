'use client'

function signOut() {
    localStorage.removeItem('signed_token');
    window.location.reload()
}

export default signOut