const ghpages = require('gh-pages')

ghpages.publish(
  'public',
  {
    branch: 'master',
    repo: 'git@github.com:zhuscat/zhuscat.github.io.git',
  },
  err => {
    if (err) {
      console.error(err)
      console.error('Deploying to GitHub Failed')
      return
    }
    console.log('Deployed to GitHub')
  }
)
