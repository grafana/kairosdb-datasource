module.exports = function (grunt) {
    require("load-grunt-tasks")(grunt);
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks("grunt-execute");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-package-modules");
    grunt.loadNpmTasks("grunt-tslint");
    grunt.loadNpmTasks("grunt-karma");

    grunt.initConfig({
        clean: {
            dist: ["dist"],
            post: ["dist/node_modules"]
        },
        packageModules: {
            dist: {
                src: "package.json",
                dest: "dist"
            },
        },
        copy: {
            src_to_dist: {
                cwd: "src",
                expand: true,
                src: ["**/*", "!**/*.js", "!**/*.scss", "!node_modules/**/*"],
                dest: "dist"
            },
            metadata: {
                expand: true,
                src: ["plugin.json", "README.md"],
                dest: "dist"
            }
        },
        watch: {
            rebuild_all: {
                files: ["src/**/*"],
                tasks: ["watch-ts"],
                options: {spawn: false}
            }
        },
        tslint: {
            options: {
                configuration: "tslint.json"
            },
            files: {
                src: [
                    "src/**/*.ts"
                ]
            },
            test: {
                src: [
                    "specs/*.ts",
                    "specs/**/*.ts"
                ]
            }
        },
        typescript: {
            build: {
                src: [
                    "dist/**/*.ts"
                ],
                dest: "dist/",
                options: {
                    module: "system",
                    target: "es5",
                    rootDir: "dist/",
                    keepDirectoryHierarchy: false,
                    declaration: true,
                    emitDecoratorMetadata: true,
                    experimentalDecorators: true,
                    sourceMap: true,
                    noImplicitAny: false
                }
            }
        },
        babel: {
            options: {
                sourceMap: true,
                presets: ["es2015"]
            },
            distTestsSpecsNoSystemJs: {
                files: [{
                    expand: true,
                    cwd: "src/spec",
                    src: ["**/*.js"],
                    dest: "dist/test/spec",
                    ext: ".js"
                }]
            }
        },
        karma: {
            unit: {
                configFile: "karma.conf.js"
            }
        }
    });

    grunt.registerTask("default", [
        "clean:dist",
        "copy",
        "packageModules",
        "tslint",
        "typescript:build",
        "babel",
        "karma",
        "clean:post"
    ]);
};
