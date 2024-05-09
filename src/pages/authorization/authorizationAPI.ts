import { FormEvent } from "react";

export interface AuthFormInterface {
    login: string;
    password: string;
    passwordConfirm?: string
}

export enum TabForm {
    signIn = 'signIn',
    signUp = 'signUp'
}

export enum InputsValues {
    login = 'login',
    password = 'password',
    passwordConfirm = 'passwordConfirm'

}

export type InputType = InputsValues.login | InputsValues.password | InputsValues.passwordConfirm

export type authorizationTabsInterface = (value:TabForm) => void

type AuthorizationInterface = (e:FormEvent<HTMLFormElement>, form:TabForm, data:AuthFormInterface) => void

type TokenType = {accessToken: string}





export const authorization: AuthorizationInterface = async(e, form, data) => { 

    if (form === TabForm.signIn) {
        const response = await fetch('http://localhost:9999/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'username': data.login,
                'password': data.password,
                'money' : 1000000000,
                'items' : []
            })
        })
        const fetchResult:TokenType = await response.json()
        if (fetchResult.accessToken) {
            console.log(fetchResult)
            localStorage.setItem('token', fetchResult.accessToken)
            window.location.reload();
        }
        return;
    }

    if (data.password!== data.passwordConfirm) {
        alert('Пароли не совпадают')
        return;
    }

    fetch('http://localhost:9999/user/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'username': data.login,
            'email': data.login,
            'password': data.password,
        })
    })

    return ;
}

export const test = async () => {
    const response = await fetch('http://localhost:9999/users');
    const data = await response.json();
    return data;
}
