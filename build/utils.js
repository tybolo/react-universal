const { exec } = require('child_process')
const colors = require('colors/safe')
const fs = require('fs')
const paths = require('./paths')

const statsOptions = {
  colors: true,
  modules: false,
  excludeModules: [/node_modules/, /webpack/, /external/],
  children: false,
}

class ChildProcess {
  constructor (command, name, color) {
    this.command = command
    this.name = name || ''
    this.color = color || 'blue'
    this.process = null
    this.stdoutMsg = ''
    this.stdoutMsgWaitting = null
  }

  run () {
    if (this.process) return
    this.process = exec(this.command, {
      stdio: ['pipe', 'pipe', 'pipe'],
      // stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
      // shell: true
    })
    this.bind()
  }

  restart (cb) {
    this.process.unref()
    this.process = null
    this.run()
  }

  bind () {
    const process = this.process
    process.on('error', (err) => {
      console.log(colors[this.color]('[' + this.name + ' error]'))
      console.log(err.trim() + '\n')
    })
    process.stderr.on('data', (data) => {
      console.log(colors[this.color]('[' + this.name + ' stderr]'))
      console.log(data.trim() + '\n')
    })
    process.stdout.on('data', (data) => {
      // console.log(colors[this.color]('[' + this.name + ' stdout]'))
      // console.log(data.trim())
      this.log(data)
    })
    process.on('close', (code, signal) => {
      console.log(`exited: ${code}, ${signal}`)

      const fsWatcher = fs.watch(paths.serverSrc, {
        recursive: true
      }, (eventType, filename) => {
        this.restart(() => fsWatcher.close())
      })
    })
  }

  log (msg) {
    clearTimeout(this.stdoutMsgWaitting)
    this.stdoutMsg += msg
    this.stdoutMsgWaitting = setTimeout(() => {
      console.log(colors[this.color]('[' + this.name + ' stdout]'))
      console.log(this.stdoutMsg.trim() + '\n')
      this.stdoutMsg = ''
    }, 300)
  }
}

const errHandler = (err, stats) => {
  // 致命的 wepback 错误（配置出错等）
  if (err) {
    console.error(err.stack || err)
    if (err.details) {
      console.error(err.details)
    }
    return
  }

  const info = stats.toJson()
  // 编译错误（缺失的 module，语法错误等）
  if (stats.hasErrors()) {
    console.error(info.errors.toString())
    return
  }

  // 编译警告
  if (stats.hasWarnings()) {
    console.warn(info.warnings.toString())
  }

  // 编译结果
  console.log(stats.toString(statsOptions))
}

module.exports = {
  ChildProcess,
  errHandler,
  statsOptions
}
