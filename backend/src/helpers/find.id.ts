


class findById {
    async findById(id:string, Prisma : any){
        return await Prisma.user.findFirst({
            where: {
                id: id,
            },
        });
    }
   
}

export const findByIdHandler = new findById();