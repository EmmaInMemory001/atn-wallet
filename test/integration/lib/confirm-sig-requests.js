const reactTriggerChange = require('react-trigger-change')
const {
  timeout,
  queryAsync,
  findAsync,
} = require('../../lib/util')
const PASSWORD = 'password123'

QUnit.module('confirm sig requests')

QUnit.test('successful confirmation of sig requests', (assert) => {
  const done = assert.async()
  runConfirmSigRequestsTest(assert).then(done).catch((err) => {
    assert.notOk(err, `Error was thrown: ${err.stack}`)
    done()
  })
})

async function runConfirmSigRequestsTest(assert, done) {
  let selectState = await queryAsync($, 'select')
  selectState.val('confirm sig requests')
  reactTriggerChange(selectState[0])

  // await timeout(1000000)

  const pendingRequestItem = $.find('.tx-list-item.tx-list-pending-item-container.tx-list-clickable')

  if (pendingRequestItem[0]) {
    pendingRequestItem[0].click()
  }

  let confirmSigHeadline = await queryAsync($, '.request-signature__headline')
  assert.equal(confirmSigHeadline[0].textContent, 'Your signature is being requested')

  let confirmSigMessage = await queryAsync($, '.request-signature__notice')
  assert.ok(confirmSigMessage[0].textContent.match(/^Signing\sthis\smessage/))

  let confirmSigRowValue = await queryAsync($, '.request-signature__row-value')
  assert.equal(confirmSigRowValue[0].textContent, '0x879a053d4800c6354e76c7985a865d2922c82fb5b3f4577b2fe08b998954f2e0')

  let confirmSigSignButton = await queryAsync($, 'button.btn-primary.btn--large')
  confirmSigSignButton[0].click()

  confirmSigHeadline = await queryAsync($, '.request-signature__headline')
  assert.equal(confirmSigHeadline[0].textContent, 'Your signature is being requested')

  confirmSigRowValue = await queryAsync($, '.request-signature__row-value')
  assert.ok(confirmSigRowValue[0].textContent.match(/^\#\sTerms\sof\sUse/))

  confirmSigSignButton = await queryAsync($, 'button.btn-primary.btn--large')
  confirmSigSignButton[0].click()

  confirmSigHeadline = await queryAsync($, '.request-signature__headline')
  assert.equal(confirmSigHeadline[0].textContent, 'Your signature is being requested')

  confirmSigRowValue = await queryAsync($, '.request-signature__row-value')
  assert.equal(confirmSigRowValue[0].textContent, 'Hi, Alice!')
  assert.equal(confirmSigRowValue[1].textContent, '1337')

  confirmSigSignButton = await queryAsync($, 'button.btn-primary.btn--large')
  confirmSigSignButton[0].click()

  const txView = await queryAsync($, '.tx-view')
  assert.ok(txView[0], 'Should return to the account details screen after confirming')
}
