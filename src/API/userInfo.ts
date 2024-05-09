import { FinalItem } from "@/redux/itemsApi";

export interface UserDataInterface {
    username: string;
    money: number;
    id: number;
    items: FinalItem[]
}


export const getUserData = async () => {
    if (!localStorage.getItem('token')) {
        return null
    }
    const token = localStorage.getItem('token') as string
    const userData = JSON.parse(atob(token?.split('.')[1]))
    const response = await fetch(`http://localhost:9999/users/${userData.id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    const result = await response.json() as UserDataInterface

    if (response.ok && token !== null && token !== undefined) {
        return result;
    } else {
        return null
    }
}