#!/usr/bin/env bun
// @ts-nocheck
import { createCliRenderer } from '@opentui/core'
import { createRoot } from '@opentui/react'
import { App } from './src/App'

async function main() {
  const cwd = process.cwd()
  
  const renderer = await createCliRenderer({ 
    exitOnCtrlC: false,
  })
  
  const root = createRoot(renderer)
  root.render(<App cwd={cwd} />)
}

main().catch((error) => {
  console.error('Error starting GitArbor:', error)
  process.exit(1)
})
