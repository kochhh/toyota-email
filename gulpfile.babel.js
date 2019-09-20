'use strict'

import { src, dest, watch, series, parallel } from 'gulp'
import del from 'del'
import server from 'browser-sync'
import notify from 'gulp-notify'
import plumber from 'gulp-plumber'

const source = ((base) => ({
  email:  `${base}/email`
}))('src')

const build = ((base) => ({
  root:   `${base}`,
  email:  `${base}/email`
}))('dist')

const Server = server.create()

const errorHandler = function() {
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>',
    sound: 'Submarine'
  }).apply(this, [...arguments])
  this.emit('end')
}

export const clean = () => del([`${build.root}/`])

export function serverInit() {
  Server.init({
    server: {
      baseDir: `${build.root}/`
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
  return src(`${source.email}/**/*.*`)
    .pipe(plumber({ errorHandler }))
    .pipe(dest(`${build.email}/`))
}

export function watchFiles() {
  watch(`${source.email}/**/*.*`, series('emailCopy'))
}

const task = series(
  clean,
  parallel(emailCopy, serverInit, watchFiles)
)

export { task as default }
