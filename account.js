(function () {
    function resetPassword () {
        vex.dialog.open({
            message: 'To reset your password, please enter your email address:',
            input: "<input name=\"email\" type=\"text\" placeholder=\"Email\" required />",
            buttons: [
                $.extend({}, vex.dialog.buttons.YES, {
                    text: 'Reset Password'
                }), $.extend({}, vex.dialog.buttons.NO, {
                    text: 'Back'
                })
            ],
            callback: function (data) {
                if (data === false) {
                    return true; // Cancelled
                }

                firebaseRef.resetPassword({
                    email: data.email
                }, function (error) {
                    if (error) {
                        switch (error.code) {
                            case "INVALID_USER":
                                Messenger().post({
                                    message: "The specified user account does not exist.",
                                    type: 'error',
                                    showCloseButton: true
                                });
                                break;
                            default:
                                Messenger().post({
                                    message: "Error resetting password: " + error,
                                    type: 'error',
                                    showCloseButton: true
                                });
                        }
                    } else {
                        Messenger().post("Your password has been reset. You should receive an email at the address provided.");
                    }
                });
            }
        });
    }

    function auth () {
        // IF we have a callback
        if (callback && typeof(callback) === "function") {
            // Do not require authentication for SVGPEN (demo site)
            if (window.location.host === "svgpen.com" || window.location.host === "www.svgpen.com") return callback();

            // Do not require authentication for demos
            if (core.get('isTemplate')) return callback();
        }

        var authData = firebaseRef.getAuth();

        if (authData) {
            // console.log("Authenticated user with uid:", authData.uid);
            var userID = authData.uid;
            core.set('userID', authData.uid);
            core.set('userEmail', authData.password.email);
            getSitesObj(userID);
            if (callback && typeof(callback) === "function")
                callback();
        } else {
            // Modal
            vex.dialog.open({
                message: 'Enter your username and password:',
                input: "<input name=\"email\" type=\"text\" placeholder=\"Email\" required />\n<input name=\"password\" type=\"password\" placeholder=\"Password\" required />",
                buttons: [
                    $.extend({}, vex.dialog.buttons.YES, {
                        text: 'Login'
                    }), $.extend({}, vex.dialog.buttons.NO, {
                        text: 'Back'
                    })
                ],
                callback: function (data) {
                    if (data === false) {
                        return false; // Cancelled
                    }
                    firebaseRef.authWithPassword({ "email": data.email, "password": data.password
                    }, function (error, authData) {
                        if (error) {
                            // Todo: Try login again
                            Messenger().post({
                                message: "Login Failed! " + error + ' <a href="#" onclick="core.resetPassword()">Reset Password</a>?',
                                type: 'error',
                                showCloseButton: true
                            });
                        } else {
                            var userID = authData.uid;
                            core.set('userID', authData.uid);
                            core.set('userEmail', authData.password.email);
                            getSitesObj(userID);
                            if (callback && typeof(callback) === "function") callback();
                        }
                    });
                }
            });
        }
    }

    function createAccount () {
        vex.dialog.open({
            message: 'Please enter your email address and choose a password:',
            input: "<input name=\"email\" type=\"text\" placeholder=\"Email\" required />\n<input name=\"password\" type=\"password\" placeholder=\"Password\" required />",
            buttons: [
                $.extend({}, vex.dialog.buttons.YES, {
                    text: 'Login'
                }), $.extend({}, vex.dialog.buttons.NO, {
                    text: 'Back'
                })
            ],
            callback: function (data) {
                if (data === false) {
                    return false; // Cancelled
                }
                console.log(data.email, data.password);
            }
        });
    }

    core.registerGlobal('auth', auth);
    core.registerGlobal('resetPassword', resetPassword);
    core.registerGlobal('createAccount', createAccount)

})();