import jwt from 'jsonwebtoken';

async function createJwtTokenForAccVerification(payload: { email: string; name: string }) {
    const jwtToken = jwt.sign(payload,
        process.env.JWT_SECRET_FOR_ACCOUNT_VERIFICATION as string,
        { expiresIn: '15m' }
    );

    return jwtToken
}

export default createJwtTokenForAccVerification