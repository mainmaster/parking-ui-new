import {$api} from "../index";

export const login = async ({username, password}) => {
    return $api.post('/accounts/login/', {
        username: username,
        password: password
    },{
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export const logout = async () =>{
    return await $api.post('/accounts/logout/').then(()=>{
        window.location.href = '/login'
    })
}

export const getUserData = async () =>{
    return $api.get('/accounts/user/')
}