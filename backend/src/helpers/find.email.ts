



class findEmail{

    async findEmail(email:string,Prisma : any){
        return await Prisma.user.findFirst({
            where: {
                email: email,
            },
        });
    }
}

export const findEmailHandler = new findEmail();