requirejs.config({
    baseUrl: "js",
    paths: {
        "gl-matrix": "https://cdn.jsdelivr.net/npm/gl-matrix@3.3.0/gl-matrix-min",
        "matter-js": "https://cdn.jsdelivr.net/npm/matter-js@0.14.2/build/matter.min"
    }
});

requirejs(["main"], () => { });
