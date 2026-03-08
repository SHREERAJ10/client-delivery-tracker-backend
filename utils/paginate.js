import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export const paginate = async (page, pageSize, modelName, where, select)=>{
        const db = prisma[modelName];
        const skip = (+page - 1) * +pageSize;
        const totalCount = await db.count({
            where
        });
        const items = await db.findMany({
            where: where || {},
            select: select || {},
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