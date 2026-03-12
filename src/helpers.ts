import VendOS from '@vendos/js'
import { AppConfiguration, AppState, BUTTON_GRID, ButtonHit } from './constants'

export function getYearButtonIndex (x: number, y: number): ButtonHit {

  const { left, top, width, height, cols, rows, gap } = BUTTON_GRID

  // Check if inside container
  if (
    x < left
    || x > left + width
    || y < top
    || y > top + height
  ) {
    return null
  }

  const innerX = x - left
  const innerY = y - top

  const totalHorizontalGap = (cols - 1) * gap
  const totalVerticalGap = (rows - 1) * gap

  const cellWidth = (width - totalHorizontalGap) / cols
  const cellHeight = (height - totalVerticalGap) / rows

  // Determine column
  const col = Math.floor(innerX / (cellWidth + gap))
  const row = Math.floor(innerY / (cellHeight + gap))

  // Check if inside actual cell area (not gap)
  const xInCell = innerX % (cellWidth + gap)
  const yInCell = innerY % (cellHeight + gap)

  if (xInCell > cellWidth || yInCell > cellHeight) {
    return null // Clicked in gap
  }

  if (col < 0 || col >= cols || row < 0 || row >= rows) {
    return null
  }

  const index = row * cols + col

  return { index, row, col }

}

export const getLandingButtonHit = (x: number, y: number) => {

  const BUTTON_WIDTH = 750
  const BUTTON_HEIGHT = 176
  const BUTTON_X = 160
  const BUTTON_Y = 1680

  return x >= BUTTON_X && x <= BUTTON_X + BUTTON_WIDTH && y >= BUTTON_Y && y <= BUTTON_Y + BUTTON_HEIGHT

}

export const persistDataToVendOS = (data: Omit<AppState, 'screen'>, config: AppConfiguration) => {

  const setName = getDataSetName(config)

  VendOS.Data.local.createSet({ name: setName }).then(() => {

    VendOS.Data.local.createRecord({ set: setName, data })

  })
}

export const getDataSetName = ({ testMode = false }: Pick<Partial<AppConfiguration>, 'testMode'>) => (testMode ? 'journeys-test' : 'journeys')