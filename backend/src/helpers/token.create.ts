

class CreateTokens{

    createToken(userId:string , JwtService:any){
        const access_token = JwtService.sign({ id :userId }, { expiresIn: '7d' });
        const refresh_token = JwtService.sign({ id :userId }, { expiresIn: '30d' });
        return { access_token, refresh_token };
    }
}

export const createTokenHandler = new CreateTokens();