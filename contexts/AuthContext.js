import {useRouter} from "next/router";
import React, {createContext, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {apiUserInfoByToken} from "../api/authApi"
import cookieUtils from "../utils/cookieUtils";
import {setJwtToken} from "../slices/tokenSlice";
import {isInternalUser} from "../utils/conditionUtils";
import AppClientLayout from "../components/AppLayout/AppClientLayout";
import Home from "../pages/home";
import Login from "../pages/login";
import Cart from "../pages/cart";
import UserDetail from "../pages/user_detail";


export const AuthContext = createContext();
const AuthProvider = (props) => {
    const router = useRouter();
    const [userInfo, setUserInfo] = useState({
        username: null,
        name: null,
        roles: []
    });
    const tokenInStore = useSelector((state) => state.token.token);
    const dispatch = useDispatch()

    const logout = () => {
        cookieUtils.removeCookie('token')
        dispatch(setJwtToken(null))
    }

    const routingClientWeb = (routeString) => {
        switch (routeString) {
            case '/':
            case '':
            case '/home':
                return <AppClientLayout><Home/></AppClientLayout>
            case '/login':
                return <Login/>
            case '/cart':
                return <AppClientLayout><Cart/></AppClientLayout>
            case '/user':
            case '/register':
                return <AppClientLayout><UserDetail/></AppClientLayout>
            default:
                return <h1>Lỗi! Trang khong ton tai</h1>
        }
    }

    useEffect(() => {
        console.log(router.asPath)
        if (tokenInStore !== null) {
            apiUserInfoByToken(tokenInStore, (res) => {
                console.log("token")
                console.log(res.data)
                setUserInfo(res.data)
                cookieUtils.setCookie('token', tokenInStore)
            }, (error) => {
                dispatch(setJwtToken(null))
                cookieUtils.removeCookie('token')
            })
        } else {
            const tokenInCookies = cookieUtils.getCookie('token')
            if (tokenInCookies === undefined || tokenInCookies === null) {
            } else
                dispatch(setJwtToken(tokenInCookies))
        }
    }, [tokenInStore])

    const value = {
        token: tokenInStore,
        userInfo: userInfo,
        logout: () => logout()
    };

    return isInternalUser(userInfo) ?
        (<AuthContext.Provider value={value} {...props}/>) :
        (routingClientWeb(router.asPath))
}
export default AuthProvider