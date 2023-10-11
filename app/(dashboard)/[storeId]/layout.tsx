import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import NavBar from "@/components/navbar";
import prismadb from "@/lib/prismadb";

export default async function DashboardLayout ({ children, params } : { children: React.ReactNode, params: { storeId: string } }) {
    const { userId } = auth();

    if (!userId) {
        redirect('/sing-in');
    }

    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
            userId: userId,
        }
    });

    if (!store) {
        redirect('/')
    }

    return(
        <>
            <NavBar />
            {children}
        </>
    );



}