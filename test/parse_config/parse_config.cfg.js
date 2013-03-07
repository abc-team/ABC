// -*- coding: utf-8; -*-
module.exports = {
  "config" : {
    "var" : {
      "timestamp" : "20120312"
    },
    "concat" : {
      "a" : {
        "src" : ["*.js"],
        "exclude" : ["index.js"],
        "dest" : "index.js"
      },
      "b" : {
        "src" : ["a.js","b.js"],
        "dest" : "ab.js"
      }
    },
    "min" : {
      "a" : {
        "src" : ["*.js"],
        "exclude" : ["*-min.js","*-combo.js"],
        "dest" : "{{filename}}-min.js",
        "codeInput" : "utf8",
        "codeOutput" : "gbk"
      },
      "b" : {
        "src" : "a.js",
        "dest" : "a-min.js"
      }
    },
    "combo" : {
      "a" : {
        "src" : ["init/*.js"],
        "dest" : "release/{{timestamp}}/init/{{filename}}.js"
      }
    },
    "copy" : {
      "a" : {
        "src" : ["v1"],
        "dest" : ["v2"]
      }
    },
    "del" : {
      "a" : {
        "src" : ["*"]
      }
    },
    "exec" : {
      "git" : {
        "cmd" : "git commit ."
      }
    },
    "include" : {
      "a" : {
        "task" : "path/to/some/abc.json"
      }
    }
  },
  "tasks" : {"default" : ["include:a","concat:a","min:b","exec:git"]}
}