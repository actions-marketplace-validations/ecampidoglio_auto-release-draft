import * as core from '@actions/core'
import * as event from '../src/event'
import {run} from '../src/main'

jest.mock('@actions/core')
jest.mock('../src/event')

describe('When running the action', () => {
  const fakeGetCreatedTag = event.getCreatedTag as jest.MockedFunction<typeof event.getCreatedTag>
  const fakeSetOutput = core.setOutput as jest.MockedFunction<typeof core.setOutput>

  beforeAll(() => {
    fakeGetCreatedTag.mockReturnValue('v1.0.0')
  })

  test('it should set the release-url output parameter', async () => {
    await run()
    expect(fakeSetOutput).toHaveBeenCalledWith('release-url', expect.anything())
  })
})

describe('When the action fails', () => {
  const fakeGetCreatedTag = event.getCreatedTag as jest.MockedFunction<typeof event.getCreatedTag>
  const fakeSetOutput = core.setOutput as jest.MockedFunction<typeof core.setOutput>
  const fakeSetFailed = core.setFailed as jest.MockedFunction<typeof core.setFailed>

  beforeAll(() => {
    fakeGetCreatedTag.mockReturnValue('v1.0.0')
    fakeSetOutput.mockImplementation(() => {
      throw new Error('Failed to set the output parameter')
    })
  })

  test('it should set the action status as failed with the error message', async () => {
    await run()
    expect(fakeSetFailed).toHaveBeenCalledWith('Failed to set the output parameter')
  })
})
