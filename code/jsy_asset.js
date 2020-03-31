const { Asset } = require('parcel-bundler');

import tiny_sourcemap from 'tiny-source-map'
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
      let src_map = options.sourceMaps ? tiny_sourcemap() : null

      const js_src = jsy_transpile(this.contents, {
        addSourceMapping(arg) {
          if (null === src_map) return;
          arg.source = source
          src_map.addMapping(arg)
        }, })

      if (null !== src_map) {
        src_map = src_map.toJSON()
        src_map.sourcesContent = [this.contents]
        src_map.sources = [this.relativeName]
        delete src_map.source
      }

      return [{ type: 'js', value: js_src, map: src_map }]

    } catch (err) {
      if (undefined !== err.src_loc) {
        console.error('Error in JSY transpile:', err.src_loc.pos, err)
        throw err
      } else throw err
    }
  }
}

module.exports = JSYAsset
