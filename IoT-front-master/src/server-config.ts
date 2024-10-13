const serverConfig = {
    localServerUrl: 'http://localhost:3100/api/',
    productionServerUrl: '',
};

export default {
    serverUrl: location.hostname === 'localhost' ? serverConfig.localServerUrl : serverConfig.productionServerUrl
};
