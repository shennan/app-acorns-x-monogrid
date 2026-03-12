import VendOS from '@vendos/js'
import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App'

VendOS.connect({
  // websocketUrl: 'ws://localhost:8080',
  clientSecret: 'test'
})

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.VendOS = VendOS

const container = document.getElementById('root')
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!)

const boot = async () => {

  const { appConfiguration } = await VendOS.App.configuration({})

  const formattedConfig = appConfiguration.reduce((acc: any, c: any) => ({
    ...acc,
    [c.id]: c.value
  }), {})

  // Do not use React.StrictMode
  root.render(<App {...formattedConfig} />)

}

boot()