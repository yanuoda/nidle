// step queue
class StepQueue {
  constructor () {
		this._queue = []
    this._current = null
	}

	enqueue (run, options) {
		this._queue.push({
      step: options,
      run
    })
	}

	dequeue () {
		const item = this._current = this._queue.shift()
    return item.run
	}

	get size () {
		return this._queue.length
	}

  get current () {
    return this._current.step
  }

	filter (options) {
		return this._queue.filter(item => {
      return item.step.name === options.name
    })
	}
}

// module.exports = StepQueue
export default StepQueue
