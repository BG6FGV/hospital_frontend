/**
 * Copyright 2017 IBM All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
var network = require('./network.js')
var log = network.getlog('Query')

var queryChaincode = function (peer, channelName, chaincodeName, args, fcn, username, org) {
  var channel = network.getChannelForOrg(org)
  var client = network.getClientForOrg(org)
  var target = buildTarget(peer, org)
  return network.getRegisteredUsers(username, org).then((user) => {
    var txId = client.newTransactionID()
    // send query
    var request = {
      chaincodeId: chaincodeName,
      txId: txId,
      fcn: fcn,
      args: args
    }
    return channel.queryByChaincode(request, target)
  }, (err) => {
    log.info('Failed to get submitter \'' + username + '\'')
    return 'Failed to get submitter \'' + username + '\'. Error: ' + err.stack ? err.stack : err
  }).then((responsePayloads) => {
    if (responsePayloads) {
      for (let i = 0; i < responsePayloads.length; i++) {
        log.info(args[0] + ' now has ' + responsePayloads[i].toString('utf8') +
          ' after the move')
        return responsePayloads[i].toString('utf8')
      }
    } else {
      log.error('responsePayloads is null')
      return 'responsePayloads is null'
    }
  }, (err) => {
    log.error('Failed to send query due to error: ' + err.stack ? err.stack : err)
    return 'Failed to send query due to error: ' + err.stack ? err.stack : err
  }).catch((err) => {
    log.error('Failed to end to end test with error:' + err.stack ? err.stack : err)
    return 'Failed to end to end test with error:' + err.stack ? err.stack : err
  })
}
var getBlockByNumber = function (peer, blockNumber, username, org) {
  var target = buildTarget(peer, org)
  var channel = network.getChannelForOrg(org)

  return network.getRegisteredUsers(username, org).then((member) => {
    return channel.queryBlock(parseInt(blockNumber), target)
  }, (err) => {
    log.info('Failed to get submitter "' + username + '"')
    return 'Failed to get submitter "' + username + '". Error: ' + err.stack ? err.stack : err
  }).then((responsePayloads) => {
    if (responsePayloads) {
      // log.debug(responsePayloads)
      log.debug(responsePayloads)
      return responsePayloads // responsePayloads.data.data[0].buffer
    } else {
      log.error('responsePayloads is null')
      return 'responsePayloads is null'
    }
  }, (err) => {
    log.error('Failed to send query due to error: ' + err.stack ? err.stack : err)
    return 'Failed to send query due to error: ' + err.stack ? err.stack : err
  }).catch((err) => {
    log.error('Failed to query with error:' + err.stack ? err.stack : err)
    return 'Failed to query with error:' + err.stack ? err.stack : err
  })
}
var getTransactionByID = function (peer, trxnID, username, org) {
  var target = buildTarget(peer, org)
  var channel = network.getChannelForOrg(org)

  return network.getRegisteredUsers(username, org).then((member) => {
    return channel.queryTransaction(trxnID, target)
  }, (err) => {
    log.info('Failed to get submitter "' + username + '"')
    return 'Failed to get submitter "' + username + '". Error: ' + err.stack ? err.stack : err
  }).then((responsePayloads) => {
    if (responsePayloads) {
      log.debug(responsePayloads)
      return responsePayloads
    } else {
      log.error('responsePayloads is null')
      return 'responsePayloads is null'
    }
  }, (err) => {
    log.error('Failed to send query due to error: ' + err.stack ? err.stack : err)
    return 'Failed to send query due to error: ' + err.stack ? err.stack : err
  }).catch((err) => {
    log.error('Failed to query with error:' + err.stack ? err.stack : err)
    return 'Failed to query with error:' + err.stack ? err.stack : err
  })
}
var getBlockByHash = function (peer, hash, username, org) {
  var target = buildTarget(peer, org)
  var channel = network.getChannelForOrg(org)

  return network.getRegisteredUsers(username, org).then((member) => {
    return channel.queryBlockByHash(Buffer.from(hash), target)
  }, (err) => {
    log.info('Failed to get submitter "' + username + '"')
    return 'Failed to get submitter "' + username + '". Error: ' + err.stack ? err.stack : err
  }).then((responsePayloads) => {
    if (responsePayloads) {
      log.debug(responsePayloads)
      return responsePayloads
    } else {
      log.error('responsePayloads is null')
      return 'responsePayloads is null'
    }
  }, (err) => {
    log.error('Failed to send query due to error: ' + err.stack ? err.stack : err)
    return 'Failed to send query due to error: ' + err.stack ? err.stack : err
  }).catch((err) => {
    log.error('Failed to query with error:' + err.stack ? err.stack : err)
    return 'Failed to query with error:' + err.stack ? err.stack : err
  })
}
var getChainInfo = function (peer, username, org) {
  var target = buildTarget(peer, org)
  var channel = network.getChannelForOrg(org)

  return network.getRegisteredUsers(username, org).then((member) => {
    return channel.queryInfo(target)
  }, (err) => {
    log.info('Failed to get submitter "' + username + '"')
    return 'Failed to get submitter "' + username + '". Error: ' + err.stack ? err.stack : err
  }).then((blockchainInfo) => {
    if (blockchainInfo) {
      // FIXME: Save this for testing 'getBlockByHash'  ?
      log.debug('===========================================')
      log.debug(blockchainInfo.currentBlockHash)
      log.debug('===========================================')
      // log.debug(blockchainInfo)
      return blockchainInfo
    } else {
      log.error('responsePayloads is null')
      return 'responsePayloads is null'
    }
  }, (err) => {
    log.error('Failed to send query due to error: ' + err.stack ? err.stack : err)
    return 'Failed to send query due to error: ' + err.stack ? err.stack : err
  }).catch((err) => {
    log.error('Failed to query with error:' + err.stack ? err.stack : err)
    return 'Failed to query with error:' + err.stack ? err.stack : err
  })
}
// getInstalledChaincodes
var getInstalledChaincodes = function (peer, type, username, org) {
  var target = buildTarget(peer, org)
  var channel = network.getChannelForOrg(org)
  var client = network.getClientForOrg(org)

  return network.getOrgAdmin(org).then((member) => {
    if (type === 'installed') {
      return client.queryInstalledChaincodes(target)
    } else {
      return channel.queryInstantiatedChaincodes(target)
    }
  }, (err) => {
    log.info('Failed to get submitter "' + username + '"')
    return 'Failed to get submitter "' + username + '". Error: ' + err.stack ? err.stack : err
  }).then((response) => {
    if (response) {
      if (type === 'installed') {
        log.debug('<<< Installed Chaincodes >>>')
      } else {
        log.debug('<<< Instantiated Chaincodes >>>')
      }
      var details = []
      for (let i = 0; i < response.chaincodes.length; i++) {
        log.debug('name: ' + response.chaincodes[i].name + ', version: ' +
          response.chaincodes[i].version + ', path: ' + response.chaincodes[i].path
        )
        details.push('name: ' + response.chaincodes[i].name + ', version: ' +
          response.chaincodes[i].version + ', path: ' + response.chaincodes[i].path
        )
      }
      return details
    } else {
      log.error('response is null')
      return 'response is null'
    }
  }, (err) => {
    log.error('Failed to send query due to error: ' + err.stack ? err.stack : err)
    return 'Failed to send query due to error: ' + err.stack ? err.stack : err
  }).catch((err) => {
    log.error('Failed to query with error:' + err.stack ? err.stack : err)
    return 'Failed to query with error:' + err.stack ? err.stack : err
  })
}
var getChannels = function (peer, username, org) {
  var target = buildTarget(peer, org)
  var client = network.getClientForOrg(org)

  return network.getRegisteredUsers(username, org).then((member) => {
    // channel.setPrimaryPeer(targets[0])
    return client.queryChannels(target)
  }, (err) => {
    log.info('Failed to get submitter "' + username + '"')
    return 'Failed to get submitter "' + username + '". Error: ' + err.stack ? err.stack : err
  }).then((response) => {
    if (response) {
      log.debug('<<< channels >>>')
      var channelNames = []
      for (let i = 0; i < response.channels.length; i++) {
        channelNames.push('channel id: ' + response.channels[i].channel_id)
      }
      log.debug(channelNames)
      return response
    } else {
      log.error('responsePayloads is null')
      return 'responsePayloads is null'
    }
  }, (err) => {
    log.error('Failed to send query due to error: ' + err.stack ? err.stack : err)
    return 'Failed to send query due to error: ' + err.stack ? err.stack : err
  }).catch((err) => {
    log.error('Failed to query with error:' + err.stack ? err.stack : err)
    return 'Failed to query with error:' + err.stack ? err.stack : err
  })
}

function buildTarget (peer, org) {
  var target = null
  if (typeof peer !== 'undefined') {
    let targets = network.newPeers([network.getPeerAddressByName(org, peer)])
    if (targets && targets.length > 0) target = targets[0]
  }

  return target
}

exports.queryChaincode = queryChaincode
exports.getBlockByNumber = getBlockByNumber
exports.getTransactionByID = getTransactionByID
exports.getBlockByHash = getBlockByHash
exports.getChainInfo = getChainInfo
exports.getInstalledChaincodes = getInstalledChaincodes
exports.getChannels = getChannels
