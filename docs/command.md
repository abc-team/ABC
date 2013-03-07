## 初始化
````
>abc init [taskfile]	
			//在现有目录进行初始化，默认生成abc.json
	 [taskfile] 	
			//初始化一个任务名为abc.[taskfile].json的任务，如："abc.yourtask.json","abc.project1.json"
````


## 打包	
````
>abc run [taskfile[.taskname]]
			//在当前目录执行打包，默认按abc.json打包，如果无abc.json，返回
	 [taskfile] 
			//指定打包配置文件名，按当前目录里的abc.[taskfile].json来打包，如无则返回
	 [taskname] 
			//按打包配置文件内的任务进行打包，如无文件或任务名则返回
````


## 打开web界面
````	
>abc web
			//开启web界面
````

