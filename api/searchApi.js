import axiosClient from "./axiosClient";
import qs from "qs";
import {generateConfigHeader} from "../utils/HttpConfig";

export const timKiemTaiLieuPhieuMuon = (token, params , callBackOk, callBackError) => {
    axiosClient.get('/internal/search/tai-lieu?' + qs.stringify(params), generateConfigHeader(token))
        .then(callBackOk)
        .catch(callBackError)
}