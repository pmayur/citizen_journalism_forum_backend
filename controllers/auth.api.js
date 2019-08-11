let authModule = require('../modules/auth')

module.exports = function(router) {


    router.post('/login', async function(req, res) {
        try {
            let email = req.body.email;
            let password = req.body.password;

            let result  = await authModule.login(email, password);
            if (result == 'invalid_credentials') {
                res.json({
                    succes: false,
                    message: "Invalid email or password."
                })
                return;
            }

            // delete password
            delete result.password;

            // session set
            req.session.userData = result;
            req.session.touch()

            res.json({
                succes: true,
                data: result
            })
        } catch (e) {
            res.status(500);
            res.json({
                succes: false,
                message: "Internal Error"
            })
        }
    })

    router.post('/signup', async function (req, res) {
        try {
            let email = req.body.email;
            let password = req.body.password;
            let name = req.body.name;

            let result = await authModule.signup(email, password, name);

            if (result == 'email_exists') {
                res.json({
                    succes: false,
                    message: "Email already exists"
                })
                return;
            }
            
            res.json({
                succes: true
            })
        } catch (e) {
            res.status(500);
            res.json({
                succes: false,
                message: "Internal Error"
            })
        }
    })

    router.post('/logout', async function (req, res) {
        try {
            req.session.destroy(function (err) {
                if (err) res.json({success:false})

                res.json({
                    succes: true
                })
            })
        } catch (e) {
            res.status(500);
            res.json({
                succes: false,
                message: "Internal Error"
            })
        }
    })

    return router;
}