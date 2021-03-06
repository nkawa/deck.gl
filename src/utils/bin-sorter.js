// Copyright (c) 2015 - 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// getValue takes an array of points returns a value to sort the bins on.
// by default it returns the number of points
// this is where to pass in a function to color the bins by
// avg/mean/max of specific value of the point
const defaultGetValue = points => points.length;

export default class BinSorter {
  constructor(bins = [], getValue = defaultGetValue) {
    this.sortedBins = this.getSortedBins(bins, getValue);
    this.maxCount = this.getMaxCount();
  }

  /**
   * Get an array of object with sorted values and index of bins
   * @param {Array} bins
   * @param {Function} getValue
   * @return {Array} array of values and index lookup
   */
  getSortedBins(bins, getValue) {
    return bins
      .map((h, i) => ({i, value: getValue(h.points), counts: h.points.length}))
      .sort((a, b) => a.value - b.value);
  }

  /**
   * Get range of values of all bins
   * @param {Number[]} range
   * @param {Number} range[0] - lower bound
   * @param {Number} range[1] - upper bound
   * @return {Array} array of new value range
   */
  getValueRange([lower, upper]) {
    const len = this.sortedBins.length;
    if (!len) {
      return [0, 0];
    }
    const lowerIdx = Math.ceil(lower / 100 * (len - 1));
    const upperIdx = Math.floor(upper / 100 * (len - 1));

    return [this.sortedBins[lowerIdx].value, this.sortedBins[upperIdx].value];
  }

  /**
   * Get ths max count of all bins
   * @return {Number | Boolean} max count
   */
  getMaxCount() {
    return Math.max.apply(null, this.sortedBins.map(b => b.counts));
  }
}
