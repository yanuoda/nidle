#!/usr/bin/expect  
set timeout -1
set host [lindex $argv 0]  
set username [lindex $argv 1]  
set password [lindex $argv 2] 
set dirname  [lindex $argv 3] 
set src_file [lindex $argv 4]  
set dest_file [lindex $argv 5]
set appname [lindex $argv 6]
set decompress [lindex $argv 7]
set authenticity [lindex $argv 8]

# scp
spawn sh -c "scp -p $dirname/$src_file $username@$host:$dest_file"
if {$authenticity==1} {
  expect {
    "(yes/no)?" {
      send "yes\n";
      expect "*assword:" {
        send "$password\n"
      }
    }
    "*assword:*" {  
      send "$password\n"
    }
  }
}
expect "100%"

# 判断是否需要解压，node服务在起服务前才去解压
if {$decompress==1} {
  # ssh
  spawn sh -c "ssh $username@$host"
  if {$authenticity==1} {
    expect {
      "(yes/no)?" {
        send "yes\n";
        expect "*assword:" {
          send "$password\n"
        }
      }
      "*assword:*" {  
        send "$password\n"
      }
    }
  }
  expect "Last login:*"

  # 解压
  # send "cd $dest_file && tar -zxpf ./$src_file -C ./$appname && rm -rf ./$src_file\n"
  send "cd $dest_file\n"
  expect "\]\[#$]"
  send "tar --no-same-owner -zkxpf ./$src_file -C ./$appname\n"
  expect "\]\[#$]"
  send "rm -rf ./$src_file\n"
  expect "\]\[#$]"
  send "exit\n"
}

expect eof
