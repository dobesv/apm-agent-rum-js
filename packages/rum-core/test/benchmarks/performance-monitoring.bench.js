/**
 * MIT License
 *
 * Copyright (c) 2017-present, Elasticsearch BV
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

import { generateTestTransaction } from './'
import { createServiceFactory } from '../../src'
import { getGlobalConfig } from '../../../../dev-utils/test-config'

const { agentConfig } = getGlobalConfig('rum-core')

function getSendTransactions(performanceMonitoring, apmServer) {
  return function(transactions) {
    const payload = transactions
      .map(tr => performanceMonitoring.createTransactionPayload(tr))
      .filter(tr => tr)
    return apmServer.sendTransactions(payload)
  }
}

suite('PerformanceMonitoring', () => {
  const serviceFactory = createServiceFactory()
  const performanceMonitoring = serviceFactory.getService(
    'PerformanceMonitoring'
  )
  const apmServer = serviceFactory.getService('ApmServer')
  const _postJson = apmServer._postJson
  const configService = serviceFactory.getService('ConfigService')
  configService.setConfig({ serviceName: 'benchmark-performance-monitoring' })
  configService.setConfig(agentConfig)

  function ResolvedPromise() {
    return Promise.resolve()
  }
  const tr = generateTestTransaction(10)
  const sendTransactions = getSendTransactions(performanceMonitoring, apmServer)

  benchmark('createTransactionPayload', function() {
    performanceMonitoring.createTransactionPayload(tr)
  })

  benchmark('sendTransactions-no-json', function() {
    apmServer._postJson = ResolvedPromise
    sendTransactions([tr])
  })

  benchmark(
    'sendTransactions',
    function() {
      apmServer._postJson = _postJson
      sendTransactions([tr])
    },
    { delay: 1 }
  )
})

suite.skip('PerformanceMonitoring - Defered', function() {
  var serviceFactory = createServiceFactory()
  var performanceMonitoring = serviceFactory.getService('PerformanceMonitoring')
  var configService = serviceFactory.getService('ConfigService')
  configService.setConfig({
    serviceName: 'benchmark-send-transactions-defered'
  })
  const sendTransactions = getSendTransactions(performanceMonitoring, apmServer)

  benchmark(
    'sendTransactions - Defered',
    function(deferred) {
      var tr = generateTransaction()

      sendTransactions([tr]).then(() => {
        deferred.resolve()
      })
    },
    { defer: true }
  )
})
