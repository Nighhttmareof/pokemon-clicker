import { UserDataInterface, getUserData } from "@/API/userInfo";
import Game from "@/components/game";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


const Index = () => {
    const route = useRouter()
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const checkAuth = async () => {
            if (await getUserData() !== null) {
                setLoading(false)
            } else {
                route.push('/authorization')
            }
        }
        checkAuth();
    }, [])
    return (
        <>
            {loading? <></> : <Game />}
        </>
    )
}

export default Index;