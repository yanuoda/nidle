#!/bin/bash
list_file=$1
dirname=$2
src_file=$3
tar_file=$4
expectShell=$5
decompress=$6

printf "tar -zcpf %s %s\n" $tar_file $src_file
cd $src_file
tar -zcpf ../$tar_file .

cat $list_file | while read line
do
  host_ip=`echo $line | awk '{print $1}'`
  username=`echo $line | awk '{print $2}'`
  password=`echo $line | awk '{print $3}'`
  dest_file=`echo $line | awk '{print $4}'`
  appname=`echo $line | awk '{print $5}'`
  printf "同步代码到服务器：%s:%s/%s\n" $host_ip $dest_file $appname
  $expectShell $host_ip $username $password $dirname $tar_file $dest_file $appname $decompress
done 
