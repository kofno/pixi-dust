module.exports = function(grunt) {

  "use strict";

  grunt.initConfig({

    srcFiles: ["*.purs", "bower_components/**/src/**/*.purs"],

    psc: {
      options: {
        modules: ["HangmanM"]
      },
      all: {
        src: ["<%= srcFiles %>"],
        dest: 'HangmanM.js'
      }
    }
  });

  grunt.loadNpmTasks("grunt-purescript");

  grunt.registerTask("default", ["psc:all"]);
};
