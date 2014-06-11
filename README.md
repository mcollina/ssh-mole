ssh-mole
========

Expose remote ports on localhost!

```js
var sshMole = require('ssh-mole')

sshTunnel({
    host: 'x.x.x.x'
  , user: 'xxxxx'
  , remotePort: 12345
  , identityFile: 'path.to.your.pem'
}, function(err, control) {
  if (err) {
    console.log(err)
    process.exit(1)
  }

  // you can use the option localPort to ovveride
  console.log('tunnel digget at port', control.port)

  // to close the tunnel
  control.done()
})
```

Acknowledgements
----------------

This project was kindly sponsored by [nearForm](http://nearform.com).

License
-------

MIT
