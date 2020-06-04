module.exports = [
  {
    comment: 'https://tools.ietf.org/html/rfc7914#section-11 #1',
    P: 'passwd',
    S: 'salt',
    c: 1,
    dkLen: 64,
    output: '55ac046e56e3089fec1691c22544b605f94185216dde0465e68b9d57c20dacbc49ca9cccf179b645991664b39d77ef317c71b845b1e30bd509112041d3a19783'
  },
  {
    comment: 'https://tools.ietf.org/html/rfc7914#section-11 #2',
    P: 'Password',
    S: 'NaCl',
    c: 80000,
    dkLen: 64,
    output: '4ddcd8f60b98be21830cee5ef22701f9641a4418d04c0414aeff08876b34ab56a1d425a1225833549adb841b51c9b3176a272bdebba1d078478f62b397f33c8d'
  },
  {
    comment: 'http://stackoverflow.com/questions/5130513/pbkdf2-hmac-sha2-test-vectors/5136918#5136918 #1',
    P: new TextEncoder().encode('password'),
    S: 'salt',
    c: 1,
    dkLen: 32,
    output: '120fb6cffcf8b32c43e7225256c4f837a86548c92ccc35480805987cb70be17b'
  },
  {
    comment: 'http://stackoverflow.com/questions/5130513/pbkdf2-hmac-sha2-test-vectors/5136918#5136918 #2',
    P: 'password',
    S: new TextEncoder().encode('salt'),
    c: 2,
    dkLen: 32,
    output: 'ae4d0c95af6b46d32d0adff928f06dd02a303f8ef3c251dfd6e2d85a95474c43'
  },
  {
    comment: 'http://stackoverflow.com/questions/5130513/pbkdf2-hmac-sha2-test-vectors/5136918#5136918 #3',
    P: 'password',
    S: new TextEncoder().encode('salt'),
    c: 4096,
    dkLen: 32,
    output: 'c5e478d59288c841aa530db6845c4c8d962893a001ce4e11a4963873aa98134a'
  },
  {
    comment: 'http://stackoverflow.com/questions/5130513/pbkdf2-hmac-sha2-test-vectors/5136918#5136918 #5',
    P: 'passwordPASSWORDpassword',
    S: new TextEncoder().encode('saltSALTsaltSALTsaltSALTsaltSALTsalt'),
    c: 4096,
    dkLen: 40,
    output: '348c89dbcbd32b2f32d814b8116e84cf2b17347ebc1800181c4e2a1fb8dd53e1c635518c7dac47e9'
  },
  {
    P: new ArrayBuffer(),
    S: new TextEncoder().encode('salt'),
    c: 1024,
    dkLen: 32,
    output: '9e83f279c040f2a11aa4a02b24c418f2d3cb39560c9627fa4f47e3bcc2897c3d'
  },
  {
    P: 'password',
    S: new ArrayBuffer(),
    c: 1024,
    dkLen: 32,
    output: 'ea5808411eb0c7e830deab55096cee582761e22a9bc034e3ece925225b07bf46'
  }
]
