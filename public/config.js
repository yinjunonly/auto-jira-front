window.serverConfig = {
    // 配置文件当前激活项
    profiles: {
        active: "dev"
    },
    // 开发环境
    dev: {
        host: "http://localhost",
        port: "9081"
    },
    // 测试环境
    test: {
        host: "http://10.129.222.200",
        port: "9081"
    },
    // 生产环境
    prod: {
        host: "http://localhost",
        port: "9081"
    }
};
