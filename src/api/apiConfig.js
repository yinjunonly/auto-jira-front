import axios from "axios";
import qs from "querystring";
import {getSystemConfig} from "@/utils/tools";
import router from "../router";

const host = getSystemConfig().host;
const port = getSystemConfig().port;

//设置每次请求返回时拦截
axios.interceptors.response.use(
    function (response) {
        if (response.data) {
            let {status, message: msg} = response.data;
            switch (status) {
                case 500:
                    alert("服务器内部错误！");
                    return Promise.reject({status, msg});
                case 600:
                    alert("数据处理失败！");
                    return Promise.reject({status, msg});
                case 400:
                    alert("参数验证未通过！");
                    return Promise.reject({status, msg});
                case 401:
                    let user = localStorage.getItem("user");
                    if (user) {
                        alert("登录已失效！");
                        router.push({path: "/login"}).then();
                        localStorage.removeItem("user");
                    }
                    return Promise.reject({status, msg});
                case 403:
                    let user1 = localStorage.getItem("user");
                    if (user1) {
                        alert("登录已失效！");
                        router.push({path: "/login"}).then();
                        localStorage.removeItem("user");
                    }
                    return Promise.reject({status, msg});
                case 200:
                    break;
                default:
                    alert(msg);
                    return Promise.reject({status, msg});
            }
        }
        return response.data;
    },
    function (err) {
        return Promise.reject(err);
    }
);
//访问前缀
axios.defaults.baseURL = `${host}${port ? `:${port}` : ""}`;
axios.defaults.responseType = 'json';
axios.defaults.withCredentials = true;
export const baseUrl = `${host}${port ? `:${port}` : ""}`;

export const httpGet = (path, params) => {
    params = params || {};
    return axios.get(`${path}?${qs.stringify(params)}`).then(res => {
        return res.data;
    });
};

export const httpPost = (path, params) => {
    params = params || {};
    return axios.post(path, params).then(res => {
        return res.data;
    });
};

export const httpPostByFormData = (path, params) => {
    params = params || {};
    let formData = new FormData();
    for (let key in params) {
        formData.append(key, params[key]);
    }
    return axios.post(path, formData, {headers: {"Content-Type": "application/x-www-form-urlencoded"}}).then(res => {
        return res.data;
    });
};

export const httpPostUpload = (path, params) => {
    params = params || {};
    let formData = new FormData();
    for (let key in params) {
        formData.append(key, params[key]);
    }
    return axios.post(path, formData, {headers: {"Content-Type": "multipart/form-data"}}).then(res => {
        return res.data;
    });
};

export const httpDelete = (path, params) => {
    params = params || {};
    return axios.delete(`${path}?${qs.stringify(params)}`).then(res => {
        return res.data;
    });
};

export const httpDeleteByJson = (path, params) => {
    params = params || {};
    return axios.delete(path, {data: params}).then(res => {
        return res.data;
    });
};

export const httpPatch = (path, params) => {
    params = params || {};
    return axios.patch(path, params).then(res => {
        return res.data;
    });
};

export const httpPut = (path, params) => {
    params = params || {};
    return axios.put(path, params).then(res => {
        return res.data;
    });
};

