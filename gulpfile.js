const { series } = require('gulp');
const { exec } = require('child_process');
const fs = require('fs-extra');
const { Observable, of } = require('rxjs');
const { concatMap, map } = require('rxjs/operators');

const { params } = require('./local');

/**
 * ファイル/ディレクトリがあるか確認します。
 * @param {*} path パス
 * @returns 真偽のObservable
 */
function exists(path) {
  return new Observable((s) => {
    console.log('check if there is', path);
    fs.access(path, fs.constants.F_OK, (err) => {
      s.next(!err);
      s.complete();
    });
  });
}

/**
 * ファイル/ディレクトリを削除します。
 * @param {*} path パス
 * @returns 削除したパス名のObservable
 */
function remove(path) {
  return new Observable((s) => {
    console.log('remove', path);
    fs.remove(path, (err) => {
      if (!!err) {
        s.error(err);
      } else {
        s.next(path);
      }
      s.complete();
    });
  });
}

/**
 * ファイル/ディレクトリがあれば削除、なければ何もしません。
 * @param {*} path パス
 * @returns パスのObservable
 */
function removeIfExists(path) {
  return exists(path).pipe(
    concatMap((result) => result ? remove(path) : of(path)),
  )
}

/**
 * ファイル/ディレクトリを移動します。
 * @param {*} src 移動元のパス
 * @param {*} target 移動先のパス
 * @returns 移動元と移動先のパスの配列のObservable
 */
function move([src, target]) {
  return new Observable((s) => {
    console.log(`move ${src} to ${target}`);
    fs.move(src, target, (err) => {
      if (!!err) {
        s.error(err);
      } else {
        s.next([src, target]);
      }
      s.complete();
    });
  });
}

/**
 * Reactアプリをビルドします。
 * @returns 子プロセス
 */
function build() {
  return exec('npx react-scripts build');
}

/**
 * ビルド済みReactアプリをSailsサーバに配置します。
 * @returns Observable
 */
function deploy() {
  const assetsPath = `${params.serverDir}/assets`;
  const buildPath = params.buildDir;
  return removeIfExists(assetsPath).pipe(
    map((path) => [buildPath, path]),
    concatMap(move),
  );
}

exports.default = series(build, deploy);