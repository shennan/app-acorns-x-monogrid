import './App.scss'
import { useCallback, useEffect, /* useMemo, */useRef, useState } from 'react'
import VendOS from '@vendos/js'
// import { Button } from '@vendos/app-components'
import { useAsync, useIntervalEffect } from '@react-hookz/web'
import { AppConfiguration, AppState, /* BUTTON_CONFIG, */Channel, DURATION_FOR_OUTRO } from './constants'
import { useRiveMechanic } from './hooks'
import { getLandingButtonHit, getYearButtonIndex, persistCardTapResult, persistDataToVendOS } from './helpers'

const App = (config: AppConfiguration): JSX.Element => {

  const [{ screen, investAmount, pressedButtonIndex, successfulVend }, setState] = useState<AppState>({ screen: 'landing' })
  const [{ result: channelInfo }, { execute }] = useAsync(getChannelsInfo)
  // const showButtonIndices = useMemo(() => [], [channelInfo])
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const timeoutMs = (config.timeoutSeconds || 30) * 1000

  const {

    RiveComponent,
    // buttonInputInOrder,
    triggerCardTapSuccess,
    triggerLandingButtonPressed,
    triggerProductSuccessfullyVended,
    triggerProductUnsuccessfullyVended,
    triggerResetApp,
    triggerUserYearsSelection,
    configureButtons,
    userYearsValue

  } = useRiveMechanic()

  useEffect(() => {

    if (screen === 'landing') {

      console.log('CLEARING TIMEOUTS')
      clearTimeout(timeoutRef.current)
      timeoutRef.current = undefined

      VendOS.Payment.cancel().catch(() => { /* NOOP */ })
      console.log('SCREEN IS LANDING')

      triggerResetApp()
      execute()

    } else if (screen === 'choose') {

      console.log('SCREEN IS CHOOSE')

      if (!investAmount && typeof pressedButtonIndex === 'undefined') {

        triggerLandingButtonPressed()

        if (timeoutMs) {

          console.log('CREATING CHOOSE TIMEOUT')

          clearTimeout(timeoutRef.current)

          timeoutRef.current = setTimeout(() => {

            console.log('Choose timeout')
            setState({ screen: 'landing' })

          }, timeoutMs)
        }
      }

    } else if (screen === 'tap') {

      console.log('SCREEN IS TAP')

      // Make sure all variables are fulfilled at this stage
      if (investAmount && typeof pressedButtonIndex !== 'undefined') {

        clearTimeout(timeoutRef.current)
        timeoutRef.current = undefined

        triggerUserYearsSelection(investAmount)

        if (timeoutMs) {

          console.log('CREATING PAYMENT TIMEOUT')

          clearTimeout(timeoutRef.current)

          timeoutRef.current = setTimeout(() => {

            console.log('Payment timeout')

            setState({ screen: 'landing' })

          }, timeoutMs)
        }

        VendOS.Payment.cancel().catch(console.error).finally(() => {

          VendOS.Payment.hold({ amount: 100 }).then(async (res) => {

            clearTimeout(timeoutRef.current)
            timeoutRef.current = undefined

            setState(state => {

              // Because of timeouts possibly being reached whilst this hold is in flight,
              // we need to check we're still on the right page before moving on, as it may have
              // gone back to landing

              if (state.screen === 'tap') {

                persistCardTapResult('success', config)

                return { ...state, screen: 'vend' }

              }

              // Otherwise, change nothing
              return state

            })

          }).catch((err) => {

            clearTimeout(timeoutRef.current)
            timeoutRef.current = undefined

            console.error(err)

            setState(state => {

              // Because of timeouts possibly being reached whilst this hold is in flight,
              // we need to check we're still on the right page before moving on, as it may have
              // gone back to landing

              console.log('Hold error', state.screen)

              if (state.screen === 'tap') {

                persistCardTapResult(config.vendOnCardErrors ? 'success but with tap fault' : 'failure', config)

                return { ...state, screen: config.vendOnCardErrors ? 'vend' : 'tapFailure' }
              }

              // Otherwise, change nothing
              return state

            })
          })
        })
      }

    } else if (screen === 'tapFailure') {

      console.log('SCREEN IS TAP FAILURE')

      setTimeout(() => setState(state => ({ ...state, screen: 'tap' })), 1000)

    } else if (screen === 'vend') {

      console.log('SCREEN IS VEND')

      if (channelInfo && typeof pressedButtonIndex !== 'undefined') {

        triggerCardTapSuccess()

        const channel = channelInfo.find((info) => info.buttonIndex === pressedButtonIndex)

        if (channel) {

          VendOS.Vending.vend.item({ channels: [channel.channelIndex] }).then(() => {

            setState(state => ({ ...state, screen: 'outro', successfulVend: true }))

          }).catch(() => {

            setState(state => ({ ...state, screen: 'outro', successfulVend: false }))

          })
        }
      }

    } else if (screen === 'outro') {

      console.log('SCREEN IS OUTRO')

      if (typeof successfulVend !== 'undefined') {

        persistDataToVendOS({ investAmount, pressedButtonIndex, successfulVend }, config)

        if (!successfulVend)
          triggerProductUnsuccessfullyVended()
        else
          triggerProductSuccessfullyVended()

        setTimeout(() => setState({ screen: 'landing' }), DURATION_FOR_OUTRO)

      }
    }
  }, [screen, investAmount, pressedButtonIndex, successfulVend])

  useEffect(() => {

    if (screen === 'choose' && channelInfo && configureButtons) {

      configureButtons(channelInfo.map(c => c.buttonIndex))

    }

  }, [screen, channelInfo, configureButtons])

  useIntervalEffect(() => {

    if (userYearsValue?.value) {

      setState(state => ({ ...state, screen: 'tap', investAmount: userYearsValue.value as unknown as number }))

    }

  }, investAmount ? undefined : 1000)

  useEffect(() => {

    console.log('userYearsValueChanged', userYearsValue?.value)

  }, [userYearsValue])

  const onPointerDownCapture = useCallback((e: React.PointerEvent<HTMLDivElement>) => {

    /*
      NOTE: Because the developers of the Rive animation have not used events on the buttons for me to listen to,
      I need to convert pointer event coordinates to the particular button index, such that I can ensure we vend from
      the physically located channel that matches the button. We're also using this for our landing button now, as it
      was clashing with the year selection buttons.
    */

    // Don’t call preventDefault/stopPropagation, just observe
    const rect = e.currentTarget.getBoundingClientRect()

    // position inside container in CSS pixels
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (screen === 'landing') {

      const landingButtonHit = getLandingButtonHit(x, y)

      if (landingButtonHit)
        setState({ screen: 'choose' })

    } else if (screen === 'choose' && typeof pressedButtonIndex === 'undefined') {

      const buttonHit = getYearButtonIndex(x, y)

      if (buttonHit) {

        console.log('Setting pressedButtonIndex state to', buttonHit.index)
        setState((state) => ({ ...state, pressedButtonIndex: buttonHit.index }))

      }
    }

  }, [screen, pressedButtonIndex])

  return (
    <div
      className="App"
      onPointerDown={onPointerDownCapture}
    >
      <RiveComponent className="App__rive-canvas"/>
      {/* { screen === 'landing' && <div className="App__landing-button" onPointerUp={() => setState({ screen: 'choose' })}/> } */}
      {/* { screen === 'choose' && (
        <div className="App__year-buttons">
          {
            Array.from(Array(buttonInputInOrder.length)).map((_, i) => (
              <div
                key={`App__year-buttons-button--${i}`}
                className={classNames('App__year-buttons-button', { 'App__year-buttons-button--out-of-stock': !showButtonIndices.includes(i) })}
                onPointerDown={() => setState({ screen: 'tap', investAmount: BUTTON_INDEX_INVEST_AMOUNT[i] })}
              />
            ))
          }
        </div>
      )} */}
      {/* {screen === 'choose' && (
        <div className="App__landing-button">
          <Button {...BUTTON_CONFIG}>Back</Button>
        </div>
      )} */}
    </div>
  )
}

const getChannelsInfo = async () => {

  const channels = await VendOS.Vending.channels() as Channel[]

  const shelves = 8
  const perShelf = 10

  const possibleChannelsInOrder = [...channels].sort((a, b) => {

    const rowA = (shelves - 1) - Math.floor(a.index / perShelf)
    const colA = a.index % perShelf

    const rowB = (shelves - 1) - Math.floor(b.index / perShelf)
    const colB = b.index % perShelf

    if (rowA !== rowB) return rowA - rowB

    return colA - colB

  }).filter(channel => channel.status !== 'disconnected').slice(0, 15)

  return possibleChannelsInOrder.reduce((acc, channel, buttonIndex) => {

    const { disabled, currentStock, itemisedVending, status, notRestocked, index } = channel

    if (disabled || status === 'outOfStock') return acc

    if (notRestocked || (itemisedVending && !currentStock)) return acc

    // If we've got this far, asume there is stock
    return [...acc, { channelIndex: index, buttonIndex }]

  }, [] as { channelIndex: number, buttonIndex: number }[])
}

export default App
