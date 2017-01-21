
 if [ $# = 0 ]; then
     echo "Your command line contains $# arguments"
     exit 1
 fi
 pm2 restart $1
 pm2 logs $1 --lines 400