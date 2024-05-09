
import { ChangeEvent, useEffect, useState } from "react";
import auth from './authorization/authorization.module.css';
import { AuthFormInterface, InputType, InputsValues, TabForm, authorization, authorizationTabsInterface, test } from "./authorization/authorizationAPI";
import { Button, Form, Input } from "antd";
import { buttonStyles, formAuthStyle, inputStyles } from "@/UI/ui";
import { useRouter } from "next/router";
import { authCheker } from "@/API/authCheker";


const Authorization = () => {
    const [form, setForm] = useState<TabForm>(TabForm.signUp);
    const route = useRouter();
    const [authFormData, setAuthFormData] = useState<AuthFormInterface>({login:'', password:'', passwordConfirm:''});

    useEffect(() => {
        const checkAuth = async () => {
            if (await authCheker()) {
                route.push('/')
            }
        }
        checkAuth();
    }, [])


    const authorizationTabs:authorizationTabsInterface = (value) => {
        setForm(value)
        if(value == TabForm.signIn){
            
        } else {
    
        }
    }


    const tabStyle = (tab:TabForm) => { 
        return `${auth.auth_tab} ${tab === form? auth.tab_active : ''} `
    } 

    const inputOnChange = (e:ChangeEvent<HTMLInputElement>, type:InputType) => {
        setAuthFormData(prev => ({...prev, [type]: e.target.value}));
    }

    


    return(
        <div className={auth.page}>
            <div className={auth.container}>
                <div className='logo'></div>    
                <div className={auth.auth_block}>
                    <div className={auth.form_block}>
                        <div className={`${auth.auth_tabs}
                        ${form === TabForm.signIn? 
                            auth.tab_signIn : auth.tab_signUp}
                        `}>
                            <div className={`${tabStyle(TabForm.signUp)}`} 
                            onClick={() => authorizationTabs(TabForm.signUp)}>Sing up</div>

                            <div className={`${tabStyle(TabForm.signIn)}`} 
                            onClick={() => authorizationTabs(TabForm.signIn)}>Sing in</div>
                        </div>
                        <Form
                            labelCol={ {span: 24} }
                            name="authForm"
                            onFinish={(e) => authorization(e, form, authFormData)}
                            style={{...formAuthStyle, flexDirection: 'column'}}
                            >
                            <Form.Item
                                name="login"
                                style={{margin: 0, padding: 0}}
                                label="Login"
                                rules={[{ required: true, message: 'Please input your login!' }]}
                            >
                                <Input 
                                style={inputStyles}
                                value={authFormData.login} 
                                onChange={(e) => inputOnChange(e, InputsValues.login)}
                                placeholder="Input login" 
                                id="auth_login" 
                                required
                                />
                            </Form.Item>
                            
                            <Form.Item
                                name="password"
                                label="Password"
                                style={{margin: 0, padding: 0}}
                                rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                                <Input.Password 
                                style={inputStyles}
                                value={authFormData.password} 
                                onChange={(e) => inputOnChange(e, InputsValues.password)}
                                placeholder="Input password" 
                                id="auth_password" 
                                required
                                />
                            </Form.Item>
                            
                            {form === TabForm.signUp && (
                                <Form.Item
                                name="passwordConfirm"
                                label="Password confirmation"
                                style={{margin: 0, padding: 0}}
                                rules={[{ required: true, message: 'Please confirm your password!' }]}
                                >
                                <Input.Password 
                                    style={inputStyles}
                                    value={authFormData.passwordConfirm} 
                                    onChange={(e) => inputOnChange(e, InputsValues.passwordConfirm)}
                                    placeholder="Input password again" 
                                    id="auth_password_confirm" 
                                    required
                                />
                                </Form.Item>
                            )}
                            
                            <Form.Item>
                                <Button style={buttonStyles} type="primary" htmlType="submit">
                                {form === TabForm.signUp ? 'Sign Up' : 'Sign In'}
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>  
            </div>
        </div>
    )
}

export default Authorization;