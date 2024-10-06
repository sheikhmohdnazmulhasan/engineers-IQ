'use server'

export async function getWhoToFollow(user: string) {

    const fetchOption = {
        next: {
            tags: ["WHO_TO_fOLLOW"],
        },
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/follow?user=${user}`, fetchOption);
    return res.json();
}