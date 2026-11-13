// Writes a pass/fail table with failure reasons to the GitHub Actions run page.
// Reads the mochawesome JSON produced by the Cypress run.
// Usage: node scripts/ci-summary.mjs [path-to-json] (optional PAGES_URL env var adds a link)

import { readFileSync, appendFileSync } from 'node:fs'

const jsonPath = process.argv[2] ?? 'reports/mochawesome/index.json'
const summaryFile = process.env.GITHUB_STEP_SUMMARY
const pagesUrl = process.env.PAGES_URL

const report = JSON.parse(readFileSync(jsonPath, 'utf8'))

// Mochawesome nests suites; collect every test from every level.
function collectTests(suites, out = []) {
  for (const suite of suites ?? []) {
    out.push(...(suite.tests ?? []))
    collectTests(suite.suites, out)
  }
  return out
}

const tests = report.results.flatMap((file) => collectTests(file.suites))
const passed = tests.filter((t) => t.state === 'passed')
const failed = tests.filter((t) => t.state === 'failed')
const status = failed.length === 0 ? 'PASSED' : 'FAILED'

const escape = (text) =>
  String(text ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/\|/g, '\\|')
    .replace(/\n/g, ' ')

const lines = [
  `## Test run: ${status}`,
  '',
  `| Total | Passed | Failed | Duration |`,
  `| --- | --- | --- | --- |`,
  `| ${tests.length} | ${passed.length} | ${failed.length} | ${(report.stats.duration / 1000).toFixed(1)} s |`,
  '',
  '| Test | Result | Reason |',
  '| --- | --- | --- |',
  ...tests.map((t) => {
    const result = t.state === 'passed' ? 'Passed' : 'Failed'
    const reason = t.state === 'passed' ? '' : escape(t.err?.message?.split('\n')[0])
    return `| ${escape(t.fullTitle)} | ${result} | ${reason} |`
  }),
]

if (pagesUrl) {
  lines.push('', `Full report: ${pagesUrl}`)
}

const output = lines.join('\n') + '\n'

if (summaryFile) {
  appendFileSync(summaryFile, output)
} else {
  console.log(output)
}
