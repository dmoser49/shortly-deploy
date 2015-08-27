module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src : ['public/client/**/*.js'],
        dest: 'public/dist/concatenated.js',
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec', //nyan, xunit, html-cov, dot, min, markdown
          bail: true,
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      //your code here
      options: {
        separator: ';',
      },
      dist: {
        src : ['public/dist/concatenated.js'],
        dest: 'public/dist/concatenated.min.js',
      }
    },

    jshint: {
      files: [
        // Add filespec list here
        'public/client/**/*.js', 'public/dist/*.js'
      ],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },

    cssmin: {
      //your code here
      options: {
        separator: ';',
      },
      dist: {
        src : ['public/**/*.css'],
        dest: 'public/dist/style.min.css',
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      },
      server: {
        //your code here
        files: [
        'app/*.js',
        'app/**/*.js',
        'server-config.js',
        'lib/*.js'
        ],
        tasks: ['mochaTest']
      }
    },

    shell: {
      prodServer: {
        //can be used to auto-deploy to Heroku/Azure.
        command: ['git add .', 'git commit -m "' + new Date() + '"', 'git push heroku master'].join('&&')
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'jshint',
    'mochaTest'
    //your code here
  ]);

  grunt.registerTask('build', [
    //your code here
    'concat', 'uglify', 'cssmin'
  ]);

  //can be used to auto-deploy.
  grunt.registerTask('upload', function(n) {
    //Grunt options are ways to customize tasks.  Research ways to use them.
    if(grunt.option('prod')) {
      // add your production server task here
      grunt.task.run([ 'shell:prodServer' ])
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
    // add your deploy tasks here
    'test',
    'build',
    'upload'
  ]);


};
