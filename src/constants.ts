import { ButtonProps } from '@vendos/app-components'

export const RIVE_STATE_MACHINE_ID = 'State Machine 1'
export const RIVE_SRC = '/vendingmachinescreen_032326_6.riv'

export const DURATION_FOR_APP_TIMEOUT = 30000 // 15 seconds
export const DURATION_FOR_OUTRO = 18000
export const DURATION_FOR_FAILED_VEND_MESSAGE = 5000
export const DURATION_FOR_CARD_TAP_FAILURE_MESSAGE = 4000

export const BUTTON_INDEX_INVEST_AMOUNT = [25, 25, 25, 28, 28, 28, 31, 31, 31, 33, 33, 33, 35, 35, 35]

export const BUTTON_GRID = {
  left: 114,
  top: 320,
  width: 854,
  height: 1397,
  cols: 3,
  rows: 5,
  gap: 10,
}

export const BUTTON_CONFIG: ButtonProps = {
  paddingTop: 45,
  paddingBottom: 50,
  fontSize: '62px',
  backgroundColour: 'black'
}

export interface AppConfiguration {
  testMode: boolean
  timeoutSeconds: number
  vendOnCardErrors: boolean
}

export interface AppState {
  screen: 'landing'|'choose'|'tap'|'tapFailure'|'vend'|'outro'
  investAmount?: number
  pressedButtonIndex?: number
  successfulVend?: boolean
}

export interface Channel {
  index: number
  status: 'connected'|'disconnected'|'outOfStock'
  currentStock: number
  itemisedVending: boolean
  disabled: boolean
  notRestocked: boolean
}

export type ButtonHit = {
  index: number
  row: number
  col: number
} | null