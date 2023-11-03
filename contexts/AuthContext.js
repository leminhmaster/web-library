import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";
import Login from "../pages/login";
import {useDispatch, useSelector} from "react-redux";
import { apiUserInfoByToken } from "../api/authApi"


const AuthContext = createContext();
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

    useEffect(() => {
        console.log("token in store : " + tokenInStore)
        if(tokenInStore !== null) {
            apiUserInfoByToken(tokenInStore,(res) => {
                setUserInfo(res.data)
                setCheckAuthentication(true)

            }, (error) => {
                setCheckAuthentication(false)
            })
        } else {

        }
    }, [])

    useEffect(() => {
        console.log("token in store : " + tokenInStore)
        if(tokenInStore !== null) {
            apiUserInfoByToken(tokenInStore,(res) => {
                setUserInfo(res.data)
                setCheckAuthentication(true)
            }, (error) => {
                setCheckAuthentication(false)
            })
        } else {
            console.log("get token from cookies or ....")
        }
    },[tokenInStore])

    const value = {token: tokenInStore, userInfo};

    if (checkAuthentication === false){
        return (<Login/>)
    }

    return(<AuthContext.Provider value={value} {...props}/>)
}
export default AuthProvider