import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb";

export async function POST( req: Request, { params } : { params: { storeId: string  } }) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { label, imageUrl } = body;

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 }); // check if user is signed in
        
        if (!label) return new NextResponse("Lable is required", { status: 400 }); // check if there is a label

        if (!imageUrl) return new NextResponse("Image URL is required", { status: 400 }); // check if there is an image

        if (!params.storeId) return new NextResponse("Store ID is required", { status: 400 }); // check if there is a store ID

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId: userId
            }
        })

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 }); // check if user is authorized to create a billboard for this store

        const billboard = await prismadb.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeId
            }
        });

        return NextResponse.json(billboard);


    } catch (error) {
        console.log('BILLBOARDS_POST',error)
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function GET( req: Request, { params } : { params: { storeId: string  } }) {
    try {

        if (!params.storeId) return new NextResponse("Store ID is required", { status: 400 }); // check if there is a store ID

        const billboards = await prismadb.billboard.findMany({
            where: {
                storeId: params.storeId
            }
        });

        return NextResponse.json(billboards);


    } catch (error) {
        console.log('BILLBOARDS_GET',error)
        return new NextResponse("Internal error", { status: 500 })
    }
}