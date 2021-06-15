#!/bin/bash
#当前脚本所在位置
echo 'let us go...'
scriptDir=$(cd $(dirname $0); pwd)

echo ${scriptDir};
#暂存文件夹
SOURCE_CODE='compile_code'
#先看有没有这个文件夹，如果有，先删后建
if [ -d $SOURCE_CODE ];then
  rm -rf $SOURCE_CODE
fi

mkdir $SOURCE_CODE

cd $SOURCE_CODE

echo 'start clone source code from gitlab'
#拉取前端代码
git clone http://gitlab.seassoon.ai/sixiang/sixiang-2.0/sixiang-frontend.git

echo 'clone source code done!'

cd sixiang-frontend

echo 'start excute npm run build script to get a built package'

#准备开始前端代码打包
npm i
npm run build

echo 'build source code done'

#进入目录  复制前端程序包到部署目录
echo 'copy Windows package to linux server directory by scp'

distDir=$(cd $(dirname $0); pwd)
baseDir=/dist

password='k*-3X8$y2WMKq2qw'

#清空远程Linux上已有文件夹

ssh -t root@10.0.101.18 rm -rf /test/dist/*

if [ -d dist ];then
scp -rp $distDir$baseDir root@10.0.101.18:/test/dist
fi

if [ -d $SOURCE_CODE ];then
  rm -rf $SOURCE_CODE
fi

echo 'scp success'

