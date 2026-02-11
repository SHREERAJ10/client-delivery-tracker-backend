import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export const paginate = async (page, pageSize, modelName, where, include)=>{
    try{
        const db = prisma[modelName];
        const skip = (+page - 1) * +pageSize;
        const totalCount = await db.count({
            where
        });
        const items = await db.findMany({
            where: where || {},
            select: include || {},
            skip: skip,
            take: pageSize,
        });

        return {
            items,
            totalCount,
            currentPage: page,
            previousPage: page - 1,
        }
    }
    catch (err){
        console.log(err);
    }
}