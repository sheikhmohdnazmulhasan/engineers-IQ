import { NextResponse } from "next/server";

import { decrypt } from '@/utils/text_encryptor';


export async function PATCH(request: Request) {

    const { token } = await request.json();

    if (!token) {
        return NextResponse.json({
            message: 'something wrong'
        }, { status: 400 });
    }

    const decryptedData = decrypt(token);
    if (!decryptedData) {
        return NextResponse.json({
            message: 'something wrong'
        }, { status: 400 });
    }

    const spited = decryptedData.split('+++');

    console.log(spited);

    return NextResponse.json({
        decryptedData
    }, { status: 400 });


}
