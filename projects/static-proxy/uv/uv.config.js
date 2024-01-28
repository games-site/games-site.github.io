self.__uv$config = {
    prefix: '/uv/service/',
    bare: 'https://refactored-space-broccoli-jpgv9544vxg2rg6-8080.app.github.dev/v/',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/uv/uv.handler.js',
    bundle: '/uv/uv.bundle.js',
    config: '/uv/uv.config.js',
    sw: '/uv/uv.sw.js',
};
