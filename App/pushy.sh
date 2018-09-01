#! /bin/bash

:<<!
使用方式：
1. 修改PUSHYEMAIL和PUSHYPASSWORD
2. 将该文件复制到RN项目根目录下
3. 终端中跳转到RN项目根目录路径，输入sh pushy.sh，回车即可执行脚本
!

# judge flag
SYSTEMSTATUS=0
STEP1STATUS=0

#pushy login info
PUSHYEMAIL="fengjianjian@ablecloud.cn"
PUSHYPASSWORD="Ablecloud2018"

echo '\033[30;1m提交热更新 \033[0m'

# 定义选择操作系统方法
selectPhoneOS() {
echo "\033[36;1m请选择手机系统: \033[0m"
echo "\033[33;1m1. iOS \033[0m"
echo "\033[33;1m2. Android \033[0m"



	read -p "请输入选项[1-2]:" system
	if [[ $system == 1 ]]; then
		system="ios"
		SYSTEMSTATUS=1
	elif [[ $system == 2 ]]; then
		system="android"
		SYSTEMSTATUS=2
	else
		echo "输入错误，请重新输入"
	fi
}
#定义选择第一步操作方法
selectFirstStepAction() {
	
echo "\033[36;1m请选择执行的操作: \033[0m"
echo "\033[33;1m1. 配置热更新 \033[0m"
echo "\033[33;1m2. 发布应用 \033[0m"
echo "\033[33;1m3. 发布热更新版本 \033[0m"
echo "\033[33;1m4. 退出 \033[0m"

	read -p "请输入选项[1-3]:" step1

	if [[ $step1 == 1 ]];then
		step1="配置热更新"
		STEP1STATUS=1
	elif [[ $step1 == 2 ]];then
		step1="发布应用"
		STEP1STATUS=2
	elif [[ $step1 == 3 ]]; then
		step1="发布热更新版本"
		STEP1STATUS=3
	elif [[ $step1 == 4 ]]; then
		echo '886~\n'
		exit
	else
		echo "输入信息有误，请重新输入"
		sleep 0.5
		continue
	fi
}
# 登录pushy之后，选择要执行的操作
selectConfigPushy() {

echo "\033[36;1m请选择执行的操作: \033[0m"
echo "\033[33;1m1. 创建app\033[0m"
echo "\033[33;1m2. 选择app \033[0m"

	read -p "请输入选项[1-2]：" appAction

	if [[ $appAction == 1 ]]; then
		pushy createApp --platform $system
	else 
		pushy selectApp --platform $system
	fi
}

# 选择操作系统循环
while [[ $SYSTEMSTATUS -eq 0 ]]; do
	selectPhoneOS
done

# 选择执行行为循环
while [[ $STEP1STATUS -le 1 ]]; do
	selectFirstStepAction
	# 根据输入执行相应操作
	if [[ $step1 == "配置热更新" ]]; then
		echo "\033[32;1m*****开始配置热更新***** \033[0m"
		pushy login $PUSHYEMAIL $PUSHYPASSWORD
		selectConfigPushy

	elif [[ $step1 == "发布应用" ]]; then
		read -p "请输入IPA/APK文件路径:" filePath
		if [[ $system == "ios" ]]; then
			pushy uploadIpa $filePath
		else 
			pushy uploadApk $filePath
		fi
	else
		pushy bundle --platform $system
	fi
done


