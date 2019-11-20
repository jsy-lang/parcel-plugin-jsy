const { Asset } = require('parcel-bundler');

import jsy_transpile_snapshot from 'jsy-transpile'

let jsy_transpile = jsy_transpile_snapshot
try { jsy_transpile = require('jsy-transpile') } catch (err) {}


class JSYAsset extends Asset {
  constructor(name, pkg, options) {
    super(name, pkg, options)
    this.type = "js"
  }

  async generate() {
    const options = this.options
    const source = this.relativeName

    try {
      let src_map
      const addSourceMapping = options.sourceMaps
        ? arg => { arg.source = source; src_map = arg }
        : null

      this.contents = jsy_transpile(this.contents, { addSourceMapping })

      if (undefined !== src_map)
        this.sourceMap = src_map

      return [{ type: 'js', value: this.contents, sourceMap: src_map }]

    } catch (err) {
      if (undefined !== err.src_loc) {
        console.error('Error in JSY transpile:', err.src_loc.pos, err)
        throw err
      } else throw err
    }
  }
}

module.exports = JSYAsset
