import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";
import Login from "../pages/login";
import {useDispatch, useSelector} from "react-redux";
import { apiUserInfoByToken } from "../api/authApi"
import cookieUtils from "../utils/cookieUtils";
import {setJwtToken} from "../slices/tokenSlice";


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

    // useEffect(() => {
    //     console.log("token in store : " + tokenInStore)
    //     if(tokenInStore !== null) {
    //         apiUserInfoByToken(tokenInStore,(res) => {
    //             setUserInfo(res.data)
    //             setCheckAuthentication(true)
    //             cookieUtils.setCookie('token', tokenInStore)
    //         }, (error) => {
    //             setCheckAuthentication(false)
    //         })
    //     } else {
    //     }
    // }, [])

    const logout = () => {
        cookieUtils.removeCookie('token')
        dispatch(setJwtToken(null))
    }

    useEffect(() => {
        console.log("token in store depen: " + tokenInStore)
        if(tokenInStore !== null) {
            apiUserInfoByToken(tokenInStore,(res) => {
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
            console.log("token in cookies = "+ tokenInCookies)
            if (tokenInCookies === undefined || tokenInCookies === null){
                setCheckAuthentication(false)
            }
            else
                dispatch(setJwtToken(tokenInCookies))
        }
    },[tokenInStore])

    const value = {
        token: tokenInStore,
        userInfo :userInfo,
        logout: () => logout()
    };

    if (checkAuthentication === false){
        return (<Login/>)
    }

    return(<AuthContext.Provider value={value} {...props}/>)
}
export default AuthProvider