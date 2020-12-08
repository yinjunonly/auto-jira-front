import {
    httpPost,
    httpGet,
    httpPatch,
    httpPut,
    httpPostByFormData,
    httpDelete,
    httpDeleteByJson,
    httpPostUpload,
    baseUrl,
} from "./apiConfig";
import qs from "querystring";

/** 获取issue创建信息 */
export const getIssueInfo = params => httpGet('/jira/issue/info', params);