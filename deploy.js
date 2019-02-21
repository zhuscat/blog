const ghpages = require('gh-pages')

ghpages.publish('public', {
  branch: 'master',
  repo: 'git@git.coding.net:zhuscat/zhuscat.git',
}, (err) => {
  if (err) {
    console.error(err)
    console.error('Deploying to Coding.net Failed')
    return
  }
  console.log('Deployed to Coding.net')
})

ghpages.publish('public', {
  branch: 'master',
  repo: 'git@github.com:zhuscat/zhuscat.github.io.git',
}, (err) => {
  if (err) {
    console.error(err)
    console.error('Deploying to GitHub Failed')
    return
  }
  console.log('Deployed to GitHub')
})
