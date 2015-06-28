module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        csbuxBanner: '<%= pkg.name %> - v<%= pkg.version %> (<%= pkg.release %>) - <%= grunt.template.today("yyyy-mm-dd") %>  <%= pkg.copyright %>',
        csbuxProdJs: 'csbux-<%= pkg.version %>.min.js',
        csbuxProdCss: 'csbux-<%= pkg.version %>.min.css',
        csbuxDevJs: 'csbux-dts.js',
        csbuxDevCss: 'dtsStyle.css',
        ngtemplates: {
            myapp: {
                options: {
                    base: "web",
                    module: "csbux.directives.dts",
                },
                src: "templates/**/*.html",
                dest: "build/csbux-tpl.js"
            }
        },

        // 2. Configuration for concatinating files goes here.
        concat: {  
           options: {
                banner: '/*! <%= csbuxBanner %> */'
                },    
            dist: {
                    src: [
                        "src/dts/csbux-dts.js",                        
                        "build/csbux-tpl.js"
                    ],
                    dest: 'build/<%= csbuxProdJs %>',
                },
            css: {
                    src: [
                        "src/**/*.css"
                    ],
                    dest: 'build/csbux.concat.css',
                }

        },
        uglify : {
            options: {
                banner: '/*! <%= csbuxBanner %> */',
                mangle: false
            },
            js: {
                files: {
                    'build/<%= csbuxProdJs %>' : [ 'build/<%= csbuxProdJs %>' ]
                }
            }
        },
        cssmin: {           
            css: {
                src: 'build/csbux.concat.css',
                dest: 'build/<%= csbuxProdCss %>'
            }
        },    
        copy: {
          release: {
            files: [              
              { src: 'src/dts/docs/script.js', dest:"build/script.js"},                                          
              { src: 'src/dts/docs/templates/**', dest:"build/templates/", expand: true, flatten: true, filter:'isFile'},                            
              { src: 'build/<%= csbuxProdJs %>', dest:"dist/<%= csbuxProdJs %>"},                            
              { src: 'build/<%= csbuxProdCss %>', dest:"dist/<%= csbuxProdCss %>"},                            
            ],
          },
          dev: {
            files: [
                {expand: true, flatten: true, src: ['src/dts/docs/**.*'], dest: 'build/'},                
                {expand: true, flatten: true, src: ['src/dts/docs/templates/**.*'], dest: 'build/templates'},                
              // { src: 'src/dts/docs/index.html', dest:"build/index.html"},                            
              // { src: 'src/dts/docs/script.js', dest:"build/script.js"},                                          
              // { src: 'src/dts/docs/templates/**', dest:"build/templates/", expand: true, flatten: true, filter:'isFile'},                            
              // { src: 'src/dts/docs/dtsStyle.css', dest:"build/dtsStyle.css"},                            
              { src: 'src/dts/csbux-dts.js', dest:'build/csbux-dts.js'},                            
              { src: 'templates/dts/csbux-dts-template.html', dest:"build/templates/dts/csbux-dts-template.html"},                            
              
            ],
          },
        },  
        replace: {
          release: {
            options: {
              patterns: [
                {
                  match: 'csbuxJs',
                  replacement: '<%= csbuxProdJs %>'
                },
                {
                  match: 'csbuxCss',
                  replacement: '<%= csbuxProdCss %>'
                }
              ]
            },
            files: [
              {expand: true, flatten: true, src: ['src/dts/docs/index.html'], dest: 'build/'}
            ]
          },
          dev: {
            options: {
              patterns: [
                {
                  match: 'csbuxJs',
                  replacement: '<%= csbuxDevJs %>'
                },
                {
                  match: 'csbuxCss',
                  replacement: '<%= csbuxDevCss %>'
                }
              ]
            },
            files: [
              {expand: true, flatten: true, src: ['src/dts/docs/index.html'], dest: 'build/'}
            ]
          }
        },         
        // Deletes all .js files, but skips min.js files 
        clean: {
          all: ["build", "dist"],
          build: ["build"],
          postBuild: ["build/*tpl.js", "build/*.concat.css"]
        }

    });

    // 3. Where we tell Grunt we plan to use this plug-in.    
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');  
    grunt.loadNpmTasks('grunt-replace');  
    grunt.loadNpmTasks('grunt-contrib-clean');

    //dev builds
    grunt.registerTask('default', ['copy:dev', 'replace:dev']);
    grunt.registerTask('dev-clean', ['clean:all', 'copy:dev', 'replace:dev']);
    
    //release build
    grunt.registerTask('release', ['clean:all', 'ngtemplates', 'concat', 'uglify', 'cssmin', 'copy:release', 'replace:release', 'clean:postBuild']);

};