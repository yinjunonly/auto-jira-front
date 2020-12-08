/**
 * 格式化时间
 * @param row 当前行
 * @param column 列
 */
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
            );
        }
    }
    return fmt;
};

export const format = (date, match) => {
    match = match || "yyyy-MM-dd";
    let time = new Date(date);
    return time.format(match);
};

export const formatTime = (date, match) => {
    match = match || "hh:mm";
    let time = new Date(date);
    return time.format(match);
};

export const formatDateTime = (date, match) => {
    if (date) {
        match = match || "yyyy-MM-dd hh:mm:ss";
        let time = new Date(date);
        return time.format(match);
    } else {
        return "-";
    }
};

export const formatMDTime = (date, match) => {
    match = match || "MM-dd hh:mm";
    let time = new Date(date);
    return time.format(match);
};

export const arrayKeyValue = (array, key) => {
    if (!array || !array.length) {
        return "";
    }
    const tmp = [];
    array.forEach(item => {
        tmp.push(item[key]);
    });
    return tmp;
};

export const join = (array, key, spear = ",") => {
    const tmp = arrayKeyValue(array, key);
    return tmp.join(spear);
};
/***
 *
 * @param array 数组
 * @param limit 每组的数量
 * @returns {Array}
 */
export const groupArray = (array, limit) => {
    const length = array.length;
    let toIndex = limit;
    const group = [];
    for (let i = 0; i < length; i += limit) {
        if (i + limit > length) {
            toIndex = length - i;
        }
        group[group.length] = array.slice(i, i + toIndex);
    }
    return group;
};

/**
 * 相同的头信息分组
 * @param array 数组
 * @param headerKeys 数组类型 头信息keys
 * @returns {Array}
 */
export const groupHeader = (array, headerKeys) => {
    if (!array || array.length === 0) {
        return [];
    }
    const newArray = [];
    array.forEach(item => {
        const tempJson = {};
        headerKeys.forEach(key => {
            tempJson[key] = item[key];
        });
        let exist = false;
        newArray.forEach(t => {
            if (exist) {
                return;
            }
            let equal = true;
            headerKeys.forEach(key => {
                if (!equal) {
                    return;
                }
                if (t[key] !== item[key]) {
                    equal = false;
                }
            });
            if (equal) {
                t.childs.push(item);
                exist = true;
            }
        });
        if (!exist) {
            tempJson.childs = [item];
            newArray.push(tempJson);
        }
    });

    return newArray;
};

/***
 * json对应的key值
 * @param json
 * @param key
 * @returns {*}
 */
export const deepValue = (json, key) => {
    const arr = key.split(".");
    let v;
    arr.forEach(key => {
        if (v) {
            v = v[key];
        } else {
            v = json[key];
        }
    });
    return v;
};

export const clearTreeNullChildren = tree => {
    if (!tree) {
        return;
    }
    for (let item of tree) {
        if (item.children && item.children.length > 0) {
            clearTreeNullChildren(item.children);
        } else {
            delete item.children;
        }
    }
};

export const Base64 = {
    encode(str) {
        // first we use encodeURIComponent to get percent-encoded UTF-8,
        // then we convert the percent encodings into raw bytes which
        // can be fed into btoa.
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1) {
                return String.fromCharCode('0x' + p1);
            }));
    },
    decode(str) {
        // Going backwards: from bytestream, to percent-encoding, to original string.
        return decodeURIComponent(atob(str).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }
};

/**
 * 获取系统配置文件
 */
export const getSystemConfig = () => {
    return window.serverConfig[window.serverConfig.profiles.active];
};

/**
 * 获取当前界面的表格列设置
 * @returns {null|any}
 */
export const getTableColumns = () => {
    let key = location.pathname;
    let strData = localStorage.getItem(key);
    if (strData) {
        return JSON.parse(strData);
    }
    return null;
};

/**
 * 设置当前界面表格列设置
 * @param columns
 */
export const setTableColumns = columns => {
    let key = location.pathname;
    localStorage.setItem(key, JSON.stringify(columns));
};

/**
 * 格式化金额
 * @param {金额} s 
 * @param {保留小数位} n 
 */
export const fmoney = (s, n) => {
    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    let l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
    let t = "";
    for (let i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    return t.split("").reverse().join("") + "." + r;
};

const Agents = ["Android", "iPhone",
    "SymbianOS", "Windows Phone",
    "iPad", "iPod"];

/**
 * 是否为PC端
 */
export const isPC = () => {
    let userAgentInfo = navigator.userAgent;
    let flag = true;
    for (let i = 0; i < Agents.length; i++) {
        if (userAgentInfo.indexOf(Agents[i]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}