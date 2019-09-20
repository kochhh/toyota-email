'use strict'

import { src, dest, watch, series, parallel } from 'gulp'
import del from 'del'
import server from 'browser-sync'
import notify from 'gulp-notify'
import plumber from 'gulp-plumber'

const Server = server.create()

const errorHandler = function() {
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>',
    sound: 'Submarine'
  }).apply(this, [...arguments])
  this.emit('end')
}

export const clean = () => del([`dist/`])

export function serverInit() {
  Server.init({
    server: {
      baseDir: `dist/`
    },
    port: 8080,
    logLevel: 'info',
    logConnections: false,
    logFileChanges: true,
    open: false,
    ui: false,
    notify: false,
    ghostMode: false,
    reloadDelay: 500
  })
}

export function emailCopy() {
  return src(`src/**/*.*`)
    .pipe(plumber({ errorHandler }))
    .pipe(dest(`dist/`))
}

export function watchFiles() {
  watch(`src/**/*.*`, series('emailCopy'))
}

const task = series(
  clean,
  parallel(emailCopy, serverInit, watchFiles)
)

export { task as default }
