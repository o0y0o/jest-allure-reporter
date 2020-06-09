const path = require('path')
const fs = require('fs-extra')
const { paramCase } = require('param-case')

const template = (strings, ...keys) => (...values) => {
  const dict = values[values.length - 1] || {}
  return keys.reduce(
    (result, key, index) =>
      result +
      (Number.isInteger(key) ? values[key] : dict[key]) +
      strings[index + 1],
    strings[0]
  )
}

const testSuiteTemplate = template`<?xml version="1.0"?>
<ns2:test-suite xmlns:ns2="urn:model.allure.qatools.yandex.ru" start="${'beginTime'}" stop="${'endTime'}">
  <name>${'filePath'}</name>
  <title>${'title'}</title>
  <labels>
    <label name="suite" value="${'reportTitle'}"/>
    <label name="subSuite" value="${'title'}"/>
  </labels>
  <test-cases>
    ${'testCases'}
  </test-cases>
</ns2:test-suite>
`

const testCaseTemplate = template`
<test-case start="${'beginTime'}" status="${'status'}" stop="${'endTime'}">
  <name>${'title'}</name>
  <title>${'title'}</title>
  <failure>
    <message>${'message'}</message>
    <stack-trace>${'message'}</stack-trace>
  </failure>
</test-case>
`

const escapeText = text =>
  text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/\[(2|3)(1|2|3|9)?m/g, '')
    .replace(new RegExp(String.fromCharCode(27), 'g'), '')

module.exports = function Reporter(_config, { title, srcDir, outputDir }) {
  this.onRunComplete = async (_context, results) => {
    await fs.remove(outputDir)

    const tasks = results.testResults.map(async testSuite => {
      if (!testSuite.testResults.length) return
      const filePath = testSuite.testFilePath.replace(srcDir, paramCase(title))
      const beginTime = testSuite.perfStats.start
      const testSuiteReport = testSuiteTemplate({
        reportTitle: title,
        title: testSuite.testResults[0].ancestorTitles[0],
        filePath,
        beginTime,
        endTime: testSuite.perfStats.end,
        testCases: testSuite.testResults
          .map(testCase => {
            const title = [...testCase.ancestorTitles, testCase.title]
              .slice(1)
              .join(' / ')
            return testCaseTemplate({
              title,
              beginTime,
              endTime: beginTime + testCase.duration,
              status: testCase.status,
              message: testCase.failureMessages.map(escapeText).join(',')
            })
          })
          .join('')
      })
      const filename =
        filePath.split('/').map(paramCase).join('_') + '_testsuite.xml'
      await fs.outputFile(path.join(outputDir, filename), testSuiteReport)
    })
    await Promise.all(tasks)
  }
}
