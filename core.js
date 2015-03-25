var $$ = window.$ ? window.$ : window.jQuery;

/**
 * CORE
 */
var core = (function () {

    /**
     * core datastore getter
     */
    function get (key) {
        return core.data[key];
    }

    /**
     * core datastore setter
     */
    function set (key, value) {
        return core.data[key] = value;
    }

    /**
     * Executes an array of functions, Sequentially
     */
    function executeFunctionArray (functionArray, args) {
        if (typeof(functionArray) !== "object" || !functionArray.length) return false;

        for (var i = 0; i < functionArray.length; i++) {
            args = functionArray[i](args);
        }

        return args;
    }

    /**
     * Registers a new global on the core object
     */
    function registerGlobal (key, value) {

        if (typeof(core[key]) === "undefined") {

            if (typeof(value) === "function") {

                core[key] = function () {
                    /**
                     * Prepare Arguments
                     *
                     * TODO: (Source: MDN)
                     * You should not slice on arguments because it prevents optimizations in JavaScript
                     * engines (V8 for example). Instead, try constructing a new array by iterating
                     * through the arguments object.
                     */
                    // var args = Array.prototype.slice.call(arguments);
                    var args = arguments;
                    if (args.length === 0) args = null;

                    /**
                     * Execute Before hooks on the arguments
                     */
                    if (core.hooks[key] && core.hooks[key].before && core.hooks[key].before.length > 0)
                        args = executeFunctionArray(core.hooks[key].before, args);

                    /**
                     * Execute the intended function
                     */
                    result = value.apply(this, args);

                    /**
                     * Execute After hooks on the result
                     */
                    if (core.hooks[key] && core.hooks[key].after && core.hooks[key].after.length > 0)
                        result = executeFunctionArray(core.hooks[key].after, result);

                    return result;
                };

            } else {

                // If the global is being set to any other type of object or value, just do it.
                core[key] = value;

            }

        } else {
            console.log("ERROR: A module attempted to write to the `" + key + "` namespace, but it is already being used.");
        }
    }

    /**
     * Registers a new before hook on a core method
     *
     * Example:
     * We could add a before hook to generateUID which always set the separator to `+`
     *
     * ```javascript
     * core.before('generateUID', function(args) {
     *     if (args) args[0] = '+';
     *     return args;
     * });
     * ```
     *
     * Then, when we called generateUID('-'), we would get a GUID separated by `+` instead.
     *
     * TODO: Consider moving core.before & core.after to a private namespace to they cannot
     * be easily accessed by 3rd party code.
     *
     */
    function before (key, func) {
        if (!core.hooks[key]) core.hooks[key] = {};
        if (!core.hooks[key].before) core.hooks[key].before = [];
        core.hooks[key].before.push(func);
    }

    /**
     * Registers a new after hook on a core method
     */
    function after (key, func) {
        if (!core.hooks[key]) core.hooks[key] = {};
        if (!core.hooks[key].after) core.hooks[key].after = [];
        core.hooks[key].after.push(func);
    }

    /**
     * Return public objects & methods
     */
    obj = {
        data: {},
        hooks: {},
        executeFunctionArray: executeFunctionArray,
        registerGlobal: registerGlobal,
        before: before,
        after: after,
        get: get,
        set: set
    };

    obj = $$.extend({}, _, obj);

    return obj;
})();