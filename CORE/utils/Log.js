const Log = {
    info: (text) => {
        console.log('[APP-INFO] ' + text);
    },

    error: (text) => {
        console.log('[APP-ERROR] ' + text);
    }
}

module.exports = Log;