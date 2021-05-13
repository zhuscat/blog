const ghpages = require('gh-pages')
const process = require('process')

console.log('Deploy: upload to GitHub')

ghpages.publish(
  'public',
  {
    branch: 'master',
    repo: 'git@github.com:zhuscat/zhuscat.github.io.git',
  },
  err => {
    if (err) {
      console.error(err)
      console.error('Deploy: deploying to GitHub Failed')
      process.exit(1)
      return
    }

    console.log('Deploy: deployed to GitHub')
  }
)
