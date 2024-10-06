'use server'

export async function getWhoToFollow(user: string) {

    const fetchOption = {
        next: {
            tags: ["WHO_TO_fOLLOW"],
        },
    };

    const res = await fetch(`https://engineers-iq.vercel.app/api/follow?user=${user}`, fetchOption);

    console.log(res.json());
    return res.json();
}