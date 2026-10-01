// Run with Node.js 22.13+: node scripts/check-jwt-secret.mjs
import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { stripTypeScriptTypes } from 'node:module'
import { runInNewContext } from 'node:vm'

const backends = [
  'week-07-08-nodejs-backend/Final Assigment/my-project',
  'week-09-10-react/4.5.25/backend',
]
const secret = randomBytes(32).toString('hex')

for (const backend of backends) {
  for (const file of ['controllers/auth.controller.ts', 'middlewares/auth.middleware.ts']) {
    const source = readFileSync(new URL(`../${backend}/src/${file}`, import.meta.url), 'utf8')
    // Stub imports so these checks need neither installed packages nor a database.
    const code = stripTypeScriptTypes(source)
      .replace(/^import .*$/gm, '')
      .replace(/^export /gm, '')
    for (const value of [undefined, '', '   ']) {
      const env = value === undefined ? {} : { JWT_SECRET: value }
      assert.throws(() => runInNewContext(code, { process: { env } }), /JWT_SECRET must be configured/)
    }
    let usedKey
    const context = {
      process: { env: { JWT_SECRET: secret } },
      jwt: {
        sign: (_, key) => { usedKey = key; return 'test-token' },
        verify: (_, key) => { usedKey = key; return { userId: 1 } },
      },
      bcrypt: { compare: async () => true },
      prisma: { user: { findUnique: async () => ({ id: 1, email: 'test@example.com', password: 'test-hash' }) } },
    }
    const response = { json() {}, status(code) { assert.fail(`Unexpected HTTP ${code}`) } }
    if (file.startsWith('controllers/')) {
      await runInNewContext(`${code}\nlogin`, context)({ body: { email: 'test@example.com', password: 'test-input' } }, response)
    } else {
      let nextCalled = false
      runInNewContext(`${code}\nauthenticate`, context)({ headers: { authorization: 'Bearer test-token' } }, response, () => { nextCalled = true })
      assert.equal(nextCalled, true)
    }
    assert.equal(usedKey, secret, `${backend}/${file} must use the configured key`)
  }
}
console.log('JWT checks passed for both backends: missing/blank keys rejected; configured key used for signing and verification.')
