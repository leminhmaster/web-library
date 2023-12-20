import {generateConfigHeaderFormData, generateConfigHeader, generateConfigHeaderApiPubic} from "../utils/HttpConfig";
import axiosClient from "./axiosClient";
import qs from 'qs'

export const baoGia = (token, request, callBackOk, callBackError) => {
    axiosClient.post("/internal/phieu-muon/bao-gia", request, generateConfigHeader(token))
        .then(callBackOk)
        .catch(callBackError)
}

export const themPhieuMuon = (token, request, callBackOk, callBackError) => {
    axiosClient.post("/internal/phieu-muon", request, generateConfigHeader(token))
        .then(callBackOk)
        .catch(callBackError)
}

export const suaPhieuMuon = (token, maPM, request, callBackOk, callBackError) => {
    axiosClient.put(`/internal/phieu-muon/${maPM}`, request, generateConfigHeader(token))
        .then(callBackOk)
        .catch(callBackError)
}

export const chiTietPhieuMuon = (token, maPM, callBackOk, callBackError) => {
    axiosClient.get(`/internal/phieu-muon/${maPM}`, generateConfigHeader(token))
        .then(callBackOk).catch(callBackError);
}

export const xacNhanPhieuMuon = (token, maPM, callBackOk, callBackError) => {
    axiosClient.patch(`/internal/phieu-muon/${maPM}:xac-nhan`, null, generateConfigHeader(token))
        .then(callBackOk)
        .catch(callBackError)
}

export const huyPhieuMuon = (token, maPM, callBackOk, callBackError) => {
    axiosClient.patch(`/internal/phieu-muon/${maPM}:huy`, generateConfigHeader(token))
        .then(callBackOk)
        .catch(callBackError)
}

export const xoaPhieuMuon = (token, maPM, callBackOk, callBackError) => {
    axiosClient.delete(`/internal/phieu-muon/${maPM}`, generateConfigHeader(token))
        .then(callBackOk)
        .catch(callBackError)
}

export const timKiemPhieuMuon = (token, params, callBackOk, callBackError) => {
    axiosClient.get("/internal/phieu-muon?"+qs.stringify(params), generateConfigHeader(token))
        .then(callBackOk)
        .catch(callBackError)
}
