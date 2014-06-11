var childProcess = require("child_process")
  , assert       = require("assert")
  , portfinder  = require('portfinder')

/**
 * Open an SSH tunnel to the remote host and expose a remote port
 * locally.
 */
function sshMole(params, cb) {

  assert(params, 'missing params')
  assert(params.user, 'missing params.user')
  assert(params.host, 'missing params.host')
  assert(params.remotePort, 'missing params.remotePort')

  if (!params.localPort) {
    return portfinder.getPort(function(err, port) {
      params.localPort = port
      sshMole(params, cb)
    })
  }

  params.timeout = params.timeout    || 5000

  var args  = [
                  params.user + "@" + params.host
                , "-L"
                , params.localPort + ":" + params.host + ':' + params.remotePort
                , "-N"
                , "-v"
                , "-i"
                , params.identityFile
              ]

    , child = childProcess.spawn("ssh", args)
    , killer = setTimeout(kill, params.timeout)

  function kill() {
    child.kill('SIGKILL')
    cb(new Error('error establishing the ssh tunnel'))
  }

  function done() {
    child.kill('SIGKILL')
  }

  child.stderr.on('data', function kickOff(data) {
    if (data.toString().match(/authentication succeeded/i)) {
      child.stderr.removeListener('data', kickOff)
      clearTimeout(killer)
      cb(null, {
          port: params.localPort
        , done: done
      })
    }
  })
}

module.exports = sshMole
