import {generateConfigHeaderFormData, generateConfigHeader} from "../utils/HttpConfig";
import axiosClient from "./axiosClient";
import qs from 'qs'

const apiUploadSingleFile = (token,
                                    type,
                                    file,
                                    callBackOk,
                                    callBackError) => {
    const formData = new FormData();
    formData.append('file', file);
    const params = {
        type: type
    }
    const queryParams = qs.stringify(params);
    return axiosClient.post(`/file/single/upload?${queryParams}`, formData, generateConfigHeaderFormData(token))
        .then(response => callBackOk(response))
        .catch(error => callBackError(error))
}

const apiUploadMultiFile = (token,
                            type,
                            files,
                            callBackOk,
                            callBackError) => {
    const formData = new FormData();
    formData.append('files', files);
    const params = {
        type: type
    }
    const queryParams = qs.stringify(params);
    return axiosClient.post(`/file/multi/upload?${queryParams}`, formData, generateConfigHeaderFormData(token))
        .then(response => callBackOk(response))
        .catch(error => callBackError(error))
}

const apiDeleteFile = (token, id, callBackOk, callBackError) => {
    return axiosClient.delete(`/file/${id}`, generateConfigHeader(token))
        .then(callBackError)
        .catch(callBackError)
}

module.exports = {
    apiUploadSingleFile: apiUploadSingleFile,
    apiUploadMultiFile: apiUploadMultiFile
}