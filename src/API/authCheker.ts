

export const authCheker = async () => {
    if (!localStorage.getItem('token')) {
        return false
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

    if (response.ok && response.status !== 403 && token !== null && token !== undefined) {
        return true;
    } else {
        return false
    }
}