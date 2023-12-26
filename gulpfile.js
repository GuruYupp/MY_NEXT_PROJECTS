const { task, src, dest, series } = require("gulp");
const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const clean = require("gulp-clean");
const deletfile = require("gulp-delete-file")

task('copy-public', (done) => {
  const argv = yargs(hideBin(process.argv)).argv; 
  src(`./otts/${argv.env}/${argv.tenant}/public/**/*.*`).pipe(dest('./public'));
  done(); 
});

task('copy-appConfig', (done) => {
  const argv = yargs(hideBin(process.argv)).argv; 
  src(`./otts/${argv.env}/${argv.tenant}/app.config.js`).pipe(dest('./src'));
  done(); 
});

task('copy-nextConfig', (done) => {
  const argv = yargs(hideBin(process.argv)).argv;
  src(`./otts/${argv.env}/${argv.tenant}/next.config.js`).pipe(dest('./'));
  done();
});

task('copy-varscss', (done) => {
  const argv = yargs(hideBin(process.argv)).argv;
  src(`./otts/${argv.env}/${argv.tenant}/styles/_var.scss`).pipe(dest('./src/'));
  done();
});


task('clean-public', () => {  
  return src('./public', { read: false, allowEmpty: true }) 
    .pipe(clean());   
});

task('remove-appConfig', (done) => {
  return src('./src/app.config.js')
    .pipe(deletfile());
});

task('remove-nextConfig', (done) => {
  return src('./next.config.js')
    .pipe(deletfile());
});

task('remove-varscss', (done) => {
  return src('./src/_var.scss')
    .pipe(deletfile());
});

task('check argvs',(done)=>{
  const argv = yargs(hideBin(process.argv)).argv;
  if(!argv.tenant || !argv.env){
    throw new Error("please pass valid arguments like --tenant='xxx' --env='xxx'")
  }
  done()
})

exports.default = series('check argvs','clean-public', 'remove-appConfig', 'remove-nextConfig','remove-varscss','copy-public', 'copy-appConfig','copy-nextConfig','copy-varscss')

