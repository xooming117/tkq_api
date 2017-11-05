exports.init = function (router) {
    require('../user/router.js').init(router)
    require('../repo/router.js').init(router)
}