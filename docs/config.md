## 命名
- abc[.taskname].json


## 说明
* 配置打包信息
* 可放在任意目录下，命名可以是：abc.json（默认按此配置执行），abc.project1.json(在命令行指定参数来执行)


## 格式：
````
{
	"var" : {
		"<variablename>" : "<value>"
	},
	"plugins": {
		"<pluginName>": "<pluginPath>"
	},
	"config" : {
		"[task-type]" : {
			"<taskname>" : {
				"[task-property-name]" : "[task-property-value]"
			}
		}
	},
	"tasks" : {
		"default" : ["[task-type[:taskname]]"],
		"<taskname>" : ["[task-type[:taskname]]"]
	}
}

````


## 参数说明

````
* var 			//定义公共变量；
* config		//打包任务的配置信息；
* tasks			//定义任务队列，默认执行default任务集
````


#### [task-type]：


````
copy        //拷贝文件或目录
remove      //删除文件或目录
min         //压缩
concat      //合并
create      //创建文件或目录树
watch       //监控文件变化
kmc         //kissy模块合并
csscombo    //css combo
less        //less编译
sass        //sass编译
coffee      //coffee编译
htt         //html to template
exec        //执行外部命令
include     //外联任务
````


#### task-type-property对应表

````
copy
    src
    exclude
    dest
    codeInput
    codeOutput
    
remove
    src
    exclude

min
    src
    exclude
    dest
    codeInput
    codeOutput

concat
    src
    exclude
    dest
    codeInput
    codeOutput

create
    src
    exclude
    dest

watch
    src
    exclude
    task

combo
    src
    exclude
    dest
    codeInput
    codeOutput

csscombo
    src
    exclude
    dest
    codeInput
    codeOutput

less
    src
    exclude
    dest
    codeInput
    codeOutput

sass
    src
    exclude
    dest
    codeInput
    codeOutput

coffee
    src
    exclude
    dest
    codeInput
    codeOutput

htt
    src
    exclude
    engine
    dest
    codeInput
    codeOutput

exec
    linux
    cmd

include
    task

var
    [user-define]

````

#### task-property

````
src :       [Path]      
            //指定打包文件源，支持Array
exclude :   [Path]
            //指定不包括的打包文件源，支持Array
dest :      [Path]
            //指定打包后生成的目标文件或目标目录
codeInput : [String]
            //指定打包文件源的编码，如'utf8','gbk'
codeOutput :[String]
            //指定生成的目标文件的编码，如'utf8','gbk'
cmd :       [String]
            //指定要执行的一条windows外部命令
linux :     [String]
            //指定要执行的一条linux外部命令
task :      [Path],[String]
            //指定任务，可以是本配置文件内配置好的任务，也可以是外部配置文件的任务,支持Array
            //适用于：watch,include
engine :    [String]
            //html to template转换时用到的模板引擎，如"kissy","kissyX"
````

#### [Path]

##### 匹配规则：

````
"a.js"  //精确匹配
"*"		//匹配0或任意数量字符
"**"	//匹配0或更多的目录  
````

##### 范例：

````
"a/*"			//匹配a/a.js, a/a.css, a/b
"**/*"			//匹配 *, */*, */*/*, */.../*/*
"*/abc.json"    //匹配a/a.json, b/abc.json, 不能匹配a/b/abc.json
"a*"			//匹配abc.json, a 
````

##### 匹配属性值

````
{{filename}}	//匹配到的文件名
{{extname}}		//匹配到的文件类型
{{path}}		//匹配到的文件路径（相对路径）
{{$[n]}}	//匹配到的第n个*值
````


##### 范例
````
"concat" : {
    "a" : {
        "src" : ["*.js"],
        "exclude" : ["combo.js"],
        "dest" : "combo.js"
    }
}
"combo" : {
    "a" : {
        "src" : ["init/*.js"],
        "dest" : "release/{{timestamp}}/init/{{filename}}.js"
    }
}
"min" : {
    "a" : {
        "src" : ["**/*"],
        "dest" : "{{path}}/{{filename}}-min.{{extname}}"
    },
    "b" : {
	"src" : [*.combo.js],
	"dest" : "{{$0}}-min.js"
    }
}
````


#### 综合范例：
`abc.json`
````
{
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
````


