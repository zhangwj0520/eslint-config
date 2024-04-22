import { fetch } from 'zx'

const requestUrl
  = 'https://registry-direct.npmmirror.com/@zhangwj0520/pkg-name/sync?sync_upstream=true'

const pkgs = ['eslint-config']

const requestUrls = pkgs.map(item => requestUrl.replace('pkg-name', item))

async function sync() {
  await Promise.all(requestUrls.map(url => fetch(url, { method: 'PUT' })))
}

sync()
