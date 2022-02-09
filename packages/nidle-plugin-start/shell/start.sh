#!/bin/bash
list_file=$1
tar_file=$2
expectShell=$3
startShell=$4

cat $list_file | while read line
do
  host_ip=`echo $line | awk '{print $1}'`
  username=`echo $line | awk '{print $2}'`
  password=`echo $line | awk '{print $3}'`
  dest_file=`echo $line | awk '{print $4}'`
  appname=`echo $line | awk '{print $5}'`
  printf "登录服务器并重启服务：%s:%s/%s\n" $host_ip $dest_file $appname
  $expectShell $host_ip $username $password $dest_file $appname $tar_file $startShell
done 
