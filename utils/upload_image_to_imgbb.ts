import axios from "axios";

interface UploadResponse {
    success: boolean;
    urls: string[] | null;
    error: Error | null;
}

async function uploadImageToImgBb(files: File[]): Promise<UploadResponse> {
    const images: string[] = [];

    try {
        for (let i = 0; i < files.length; i++) {
            const img = new FormData();
            img.append('image', files[i]);

            const { data } = await axios.post(
                `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_SECRET}`,
                img
            );

            if (data.success) {
                images.push(data.data?.display_url);
            }
        }

        return {
            success: true,
            urls: images,
            error: null
        };

    } catch (error) {
        return {
            success: false,
            urls: null,
            error: error as Error
        };
    }
}

export default uploadImageToImgBb;
