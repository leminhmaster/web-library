import {generateConfigHeaderFormData, generateConfigHeader, generateConfigHeaderApiPubic} from "../utils/HttpConfig";
import axiosClient from "./axiosClient";
import qs from 'qs'


export const apiListTacGia = (callBackOk, callBackError) => {
    const params = {
        page: 1,
        size: 10000
    }
    axiosClient.get("/public/tac-gia?"+qs.stringify(params), generateConfigHeaderApiPubic())
        .then(res => callBackOk(res))
        .catch(error => callBackError(error))
}

export const apiListTheLoai = (callBackOk, callBackError) => {
    const params = {
        page: 1,
        size: 10000
    }
    axiosClient.get("/public/the-loai?"+qs.stringify(params), generateConfigHeaderApiPubic())
        .then(res => callBackOk(res))
        .catch(error => callBackError(error))
}

export const apiListNhaXuatBan = (callBackOk, callBackError) => {
    const params = {
        page: 1,
        size: 10000
    }
    axiosClient.get("/public/nha-xuat-ban?"+qs.stringify(params), generateConfigHeaderApiPubic())
        .then(res => callBackOk(res))
        .catch(error => callBackError(error))
}

export const apiListQuocGia = (callBackOk, callBackError) => {
    const params = {
        page: 1,
        size: 10000
    }
    axiosClient.get("/public/quoc-gia?"+qs.stringify(params), generateConfigHeaderApiPubic())
        .then(res => callBackOk(res))
        .catch(error => callBackError(error))
}

export const apiListLoaiTaiLieu = (callBackOk, callBackError) => {
    const params = {
        page: 1,
        size: 10000
    }
    axiosClient.get("/public/loai-tai-lieu?"+qs.stringify(params), generateConfigHeaderApiPubic())
        .then(res => callBackOk(res))
        .catch(error => callBackError(error))
}
export const apiListNgonNgu = (callBackOk, callBackError) => {
    const params = {
        page: 1,
        size: 10000
    }
    axiosClient.get("/public/ngon-ngu?"+qs.stringify(params), generateConfigHeaderApiPubic())
        .then(res => callBackOk(res))
        .catch(error => callBackError(error))
}

export const apiListTaiLieuStatus = (callBackOk, callBackError) => {
    const params = {
        page: 1,
        size: 10000
    }
    axiosClient.get("/public/tai-lieu-status?"+qs.stringify(params), generateConfigHeaderApiPubic())
        .then(res => callBackOk(res))
        .catch(error => callBackError(error))
}

export const apiListThongTinTaiLieuStatus = (callBackOk, callBackError) => {
    const params = {
        page: 1,
        size: 10000
    }
    axiosClient.get("/public/thong-tin-tai-lieu-status?"+qs.stringify(params), generateConfigHeaderApiPubic())
        .then(res => callBackOk(res))
        .catch(error => callBackError(error))
}

export const apiListKhachHangStatus = (callBackOk, callBackError) => {
    const params = {
        page: 1,
        size: 10000
    }
    axiosClient.get("/public/khach-hang-status?"+qs.stringify(params), generateConfigHeaderApiPubic())
        .then(res => callBackOk(res))
        .catch(error => callBackError(error))
}

export const apiListNhanVienStatus = (callBackOk, callBackError) => {
    const params = {
        page: 1,
        size: 10000
    }
    axiosClient.get("/public/nhan-vien-status?"+qs.stringify(params), generateConfigHeaderApiPubic())
        .then(res => callBackOk(res))
        .catch(error => callBackError(error))
}

export const apiListSex = (callBackOk, callBackError) => {
    const params = {
        page: 1,
        size: 10000
    }
    axiosClient.get("/public/gioi-tinh?"+qs.stringify(params), generateConfigHeaderApiPubic())
        .then(res => callBackOk(res))
        .catch(error => callBackError(error))
}

export const apiListPhieuMuonStatus = (callBackOk, callBackError) => {
    axiosClient.get("/public/phieu-muon-status", generateConfigHeaderApiPubic())
        .then(res => callBackOk(res))
        .catch(error => callBackError(error))
}


