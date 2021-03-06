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

import paintEntries, { paintWithMissingFcp } from '../fixtures/paint-entries'
import resourceEntries from '../fixtures/resource-entries'
import userTimingEntries from '../fixtures/user-timing-entries'
import { TIMING_LEVEL2_ENTRIES } from '../fixtures/navigation-entries'
import longtaskEntries from '../fixtures/longtask-entries'
import largestContentfulPaintEntries from '../fixtures/lcp-entries'
import {
  LONG_TASK,
  LARGEST_CONTENTFUL_PAINT,
  MEASURE,
  PAINT,
  NAVIGATION,
  RESOURCE
} from '../../src/common/constants'

export function mockObserverEntryTypes(type) {
  if (type === LONG_TASK) {
    return longtaskEntries
  } else if (type === LARGEST_CONTENTFUL_PAINT) {
    return largestContentfulPaintEntries
  }

  return []
}

export function mockPaintEntryWithMissingFCP() {
  const _getEntriesByType = window.performance.getEntriesByType

  window.performance.getEntriesByType = function(type) {
    expect([RESOURCE, PAINT, MEASURE, NAVIGATION]).toContain(type)
    if (type === RESOURCE) {
      return resourceEntries
    } else if (type === PAINT) {
      return paintWithMissingFcp
    } else if (type === MEASURE) {
      return userTimingEntries
    } else if (type === NAVIGATION) {
      return TIMING_LEVEL2_ENTRIES
    } else {
      return []
    }
  }

  return function unMock() {
    window.performance.getEntriesByType = _getEntriesByType
  }
}

export function mockGetEntriesByType() {
  const _getEntriesByType = window.performance.getEntriesByType

  window.performance.getEntriesByType = function(type) {
    expect([RESOURCE, PAINT, MEASURE, NAVIGATION]).toContain(type)
    if (type === RESOURCE) {
      return resourceEntries
    } else if (type === PAINT) {
      return paintEntries
    } else if (type === MEASURE) {
      return userTimingEntries
    } else if (type === NAVIGATION) {
      return TIMING_LEVEL2_ENTRIES
    } else {
      return []
    }
  }

  return function unMock() {
    window.performance.getEntriesByType = _getEntriesByType
  }
}
