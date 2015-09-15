module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    aws: grunt.file.readJSON('.aws_config.json'),
    jshint: {
      files: ['gruntfile.js', 'app/<%= pkg.name %>'],
      options: {
        globals: {
          console: true,
          module: true
        }
      }
    },
    karma: {
      unit: {
        configFile: 'test/karma.conf.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! Nathan Thiesen <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'app/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    s3: {
      options: {
        accessKeyId: '<%= aws.AWSAccessKeyId %>',
        secretAccessKey: '<%= aws.AWSSecretKey %>',
        bucket: '<%= aws.bucket %>',
        access: 'public-read',
        region: '<%= aws.region %>'
      },
      beta: {
        files: [
          { cwd: 'build/',
            src: ['<%= pkg.name %>.min.js'],
            dest: '<%= aws.destination %>/beta/'
          }
        ]
      },
      stable: {
        files: [
          { cwd: 'build/',
            src: ['<%= pkg.name %>.min.js'],
            dest: '<%= aws.destination %>/stable/'
          }
        ]
      }
    },
    cloudfront: {
      options: {
        accessKeyId: '<%= aws.AWSAccessKeyId %>',
        secretAccessKey: '<%= aws.AWSSecretKey %>',
        distributionId: '<%= aws.distributionId %>',
      },
      beta: {
        options: {
          invalidations: [
            '/<%= aws.destination %>/beta/*'
          ],
        }
      },
      stable: {
        options: {
          invalidations: [
            '/<%= aws.destination %>/stable/*'
          ],
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-aws');

  grunt.registerTask('deploy', ['deploy:beta']);
  grunt.registerTask('deploy:beta', ['s3:beta', 'cloudfront:beta']);
  grunt.registerTask('deploy:stable', ['s3:stable', 'cloudfront:stable']);

  grunt.registerTask('invalidate-cache:beta', ['cloudfront:beta']);
  grunt.registerTask('invalidate-cache:stable', ['cloudfront:stable']);

  grunt.registerTask('test', ['jshint', 'karma']);
  grunt.registerTask('default', ['jshint', 'karma', 'uglify']);

};
