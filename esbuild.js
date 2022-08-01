
const entry_points = {
  location: 'src/index.js'
}
const loader = {
  '.png': 'file',
  '.svg': 'file'
}

if (process.env.NODE_ENV === 'development') {
  // Development mode watches for file changes and rebuilds

  require('esbuild').serve({
    servedir: '.',
  }, {
    entryPoints: entry_points,
    outdir: 'dist',
    bundle: true,
    loader: loader
  }).then(server => {
    console.log(server)
    // Call "stop" on the web server to stop serving
    //server.stop()
  })

} else {
  // Production build
  require('esbuild').build({
    entryPoints: entry_points,
    outdir: 'dist',
    bundle: true,
    minify: true,
    sourcemap: true,
    loader: loader
  })
  .then((response) => {
    console.log('build finished')
  })
  .catch(() => process.exit(1))
}
