#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
function error (err) {
  console.log(err)
}
function copyFile(src, target) {
  fs.createReadStream(src).pipe(fs.createWriteStream(target));
}
function copyDir(src, target, callback) {
  fs.access(target, function(err){
    if(err){
      // 目录不存在时创建目录
      fs.mkdirSync(target);
    }
    _copy(null, src, target);
  });
  function _copy(err, src, target) {
    if(err){
      callback(err);
    } else {
      fs.readdir(src, function(err, paths) {
        if(err){
          callback(err)
        } else {
          paths.forEach(function(path) {
            var _src = src + '/' +path;
            var _target = target + '/' +path;
            fs.stat(_src, function(err, stat) {
              if(err){
                callback(err);
              } else {
                // 判断是文件还是目录
                if(stat.isFile()) {
                  fs.writeFileSync(_target, fs.readFileSync(_src));
                } else if(stat.isDirectory()) {
                  // 当是目录是，递归复制
                  copyDir(_src, _target, callback)
                }
              }
            })
          })
        }
      })
    }
  }
}
switch (process.argv[2]) {
  case '--list':
  case '--li':
  case '--l':
    console.log('dir\n')
    fs.readdir( process.cwd(), function ( err, files ) {
      var list = files
      console.log( list.join( '\n\r' ) )
    })
  case '--cli':
    const src = path.dirname(__dirname) + '/static/'
    const target = process.cwd()
    fs.readdir(src, function (err, paths) {
      paths.forEach(function (path) {
        var _src = src + path
        fs.stat(_src, function (err, stat) {
          if (err) {
            error(err)
          } else {
            if(stat.isFile()) {
              fs.copyFile(_src, target);
            } else if(stat.isDirectory()) {
              copyDir(_src, target + '/' + path, error)
            }
          }
        })
      })
    })
}
