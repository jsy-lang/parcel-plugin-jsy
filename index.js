module.exports = function(bundler) {
    bundler.addAssetType('jsy', require.resolve('./cjs/jsy_asset.js'))
}
