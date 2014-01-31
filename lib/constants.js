/**
 * @ignore
 */
packageJson = require('../package.json');

module.exports = {
    uri: 'http://localhost:8080',
    timeout: 30 * 1000,
    userAgent: 'MarathonAPI:' + packageJson.version + '-Node.js:' + process.version,
    endPoints: {
        start_apps: '/v1/apps/start',
        tasks: '/v1/apps/%s/tasks',
        search: '/v1/apps/search?%s',
        ping: '/ping'
    }
};