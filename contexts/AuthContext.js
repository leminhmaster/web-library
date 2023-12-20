"use client";
import {useRouter} from "next/router";
import {createContext, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {apiUserInfoByToken} from "../api/authApi"
import cookieUtils from "../utils/cookieUtils";
import {setJwtToken} from "../slices/tokenSlice";
import {isInternalUser} from "../utils/conditionUtils";
import {routingClientWeb} from "../utils/anotherUtils";


export const AuthContext = createContext();
const AuthProvider = (props) => {
    const router = useRouter();
    const [userInfo, setUserInfo] = useState({
        username: null,
        name: null,
        roles: []
    });
    const [checkAuthentication, setCheckAuthentication] = useState(false);
    const tokenInStore = useSelector((state) => state.token.token);
    const dispatch = useDispatch()

    const logout = () => {
        cookieUtils.removeCookie('token')
        dispatch(setJwtToken(null))
    }

    useEffect(() => {
        console.log("token in store depen: " + tokenInStore)
        console.log(router.asPath)
        if (tokenInStore !== null) {
            apiUserInfoByToken(tokenInStore, (res) => {
                setUserInfo(res.data)
                setCheckAuthentication(true)
                cookieUtils.setCookie('token', tokenInStore)
            }, (error) => {
                setCheckAuthentication(false)
                dispatch(setJwtToken(null))
                cookieUtils.removeCookie('token')
            })
        } else {
            const tokenInCookies = cookieUtils.getCookie('token')
            // console.log("token in cookies = "+ tokenInCookies)
            if (tokenInCookies === undefined || tokenInCookies === null) {
                setCheckAuthentication(false)
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