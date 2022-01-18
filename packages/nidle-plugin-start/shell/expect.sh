#!/usr/bin/expect  
set timeout -1
set host [lindex $argv 0]  
set username [lindex $argv 1]  
set password [lindex $argv 2]  
set src_file [lindex $argv 3]  
set app_name [lindex $argv 4]  
set tar_file [lindex $argv 5]
set start_shell [lindex $argv 6]

spawn sh -c "ssh $username@$host"
expect {
  "(yes/no)?" {
    send "yes\n"
    expect "*assword:" {
      send "$password\n"
    }
  }
  "*assword:*" {  
    send "$password\n"
  }
}
expect "Last login:*"

send "cd $src_file\n"
expect "*#"

# 备份
send "tar -zcpf ./$app_name.bak.tar.gz ./$app_name\n"
expect "*#"

# 解压
send "rm -rf $app_name\n"
expect "*#"
send "mkdir $app_name\n"
expect "*#"
send "tar -zxpf ./$tar_file -C ./$app_name\n"
expect "*#"

# 起服务
send "cd $app_name\n"
expect "*#"
send "/bin/sh ./$start_shell\n"

expect {
  "Start got error" {
    # 错误，还原
    send "cd ..\n"
    expect "*#"
    send "rm -rf $app_name\n"
    expect "*#"
    send "tar -zxpf ./$app_name.bak.tar.gz -C ./\n"

    # 重启服务
    send "cd $app_name\n"
    expect "*#"
    send "/bin/sh ./$start_shell\n"
    expect "egg started on"
    send "cd ..\n"
  }
  "egg started on" {
    send "cd ..\n"
  }
}
# 删除文件
send "rm -rf ./$app_name.bak.tar.gz\n"
expect "*#"
send "rm -rf ./$tar_file\n"

# 退出
send "exit\n"

expect eof
