import { StateMachineInput, useRive, useStateMachineInput } from '@rive-app/react-webgl2'
import { useCallback, useMemo } from 'react'
import { useIntervalEffect } from '@react-hookz/web'
import { RIVE_SRC, RIVE_STATE_MACHINE_ID } from './constants'

export const useRiveMechanic = () => {

  const { rive, RiveComponent } = useRive({ src: RIVE_SRC, stateMachines: RIVE_STATE_MACHINE_ID, autoplay: true }, { shouldResizeCanvasToContainer: true })

  const userYearsSelection = useStateMachineInput(rive, RIVE_STATE_MACHINE_ID, 'userYearsSelection')
  const landingButtonPressed = useStateMachineInput(rive, RIVE_STATE_MACHINE_ID, 'landingButtonPressed')
  const resetApp = useStateMachineInput(rive, RIVE_STATE_MACHINE_ID, 'reset')
  const cardTapSuccess = useStateMachineInput(rive, RIVE_STATE_MACHINE_ID, 'cardTapSuccess')
  const productSuccessfullyVended = useStateMachineInput(rive, RIVE_STATE_MACHINE_ID, 'productSuccessfullyVended')
  const productUnsuccessfullyVended = useStateMachineInput(rive, RIVE_STATE_MACHINE_ID, 'unSuccessfullyVended')
  const malfunctionError = useStateMachineInput(rive, RIVE_STATE_MACHINE_ID, 'malfunctionError')
  const first25 = useStateMachineInput(rive, RIVE_STATE_MACHINE_ID, 'showButton25_1')
  const second25 = useStateMachineInput(rive, RIVE_STATE_MACHINE_ID, 'showButton25_2')
  const third25 = useStateMachineInput(rive, RIVE_STATE_MACHINE_ID, 'showButton25_3')
  const first28 = useStateMachineInput(rive, RIVE_STATE_MACHINE_ID, 'showButton28_1')
  const second28 = useStateMachineInput(rive, RIVE_STATE_MACHINE_ID, 'showButton28_2')
  const third28 = useStateMachineInput(rive, RIVE_STATE_MACHINE_ID, 'showButton28_3')
  const first31 = useStateMachineInput(rive, RIVE_STATE_MACHINE_ID, 'showButton31_1')
  const second31 = useStateMachineInput(rive, RIVE_STATE_MACHINE_ID, 'showButton31_2')
  const third31 = useStateMachineInput(rive, RIVE_STATE_MACHINE_ID, 'showButton31_3')
  const first33 = useStateMachineInput(rive, RIVE_STATE_MACHINE_ID, 'showButton33_1')
  const second33 = useStateMachineInput(rive, RIVE_STATE_MACHINE_ID, 'showButton33_2')
  const third33 = useStateMachineInput(rive, RIVE_STATE_MACHINE_ID, 'showButton33_3')
  const first35 = useStateMachineInput(rive, RIVE_STATE_MACHINE_ID, 'showButton35_1')
  const second35 = useStateMachineInput(rive, RIVE_STATE_MACHINE_ID, 'showButton35_2')
  const third35 = useStateMachineInput(rive, RIVE_STATE_MACHINE_ID, 'showButton35_3')

  const ready = useMemo(() => {

    if (!rive) return false

    const sm = rive.stateMachineInputs(RIVE_STATE_MACHINE_ID)
    if (!sm || sm.length === 0) return false

    return true

  }, [rive])

  const buttonInputInOrder = useMemo(() => [
    first35,
    second35,
    third35,
    first33,
    second33,
    third33,
    first31,
    second31,
    third31,
    first28,
    second28,
    third28,
    first25,
    second25,
    third25
  ], [
    first25,
    second25,
    third25,
    first28,
    second28,
    third28,
    first31,
    second31,
    third31,
    first33,
    second33,
    third33,
    first35,
    second35,
    third35
  ])

  const configureButtons = useCallback((showButtonIndices: number[]) => {

    if (ready) {

      // Check all buttons are ready for being set
      const readyButtons = buttonInputInOrder.filter(
        (button): button is StateMachineInput => button !== null
      )
      const allButtonsReady = readyButtons.length === buttonInputInOrder.length

      if (!allButtonsReady) return

      readyButtons.forEach((button, i) => {

        const showButton = showButtonIndices.includes(i)

        // eslint-disable-next-line no-param-reassign
        button.value = showButton

      })

      console.log('Buttons hidden:', showButtonIndices.join(','))

    }

  }, [ready, buttonInputInOrder])

  const triggerLandingButtonPressed = useCallback(() => {

    if (ready && landingButtonPressed) {

      landingButtonPressed.fire()
      console.log('landingButtonPressed.fire()')

    }

  }, [ready, landingButtonPressed])

  const triggerUserYearsSelection = useCallback((selection: number) => {

    if (ready && userYearsSelection && userYearsSelection.value !== null) {

      userYearsSelection.value = selection
      console.log('userYearsSelection.value =', userYearsSelection.value)

    }

  }, [ready, userYearsSelection])

  const triggerCardTapSuccess = useCallback(() => {

    if (ready && cardTapSuccess) {

      cardTapSuccess.fire()
      console.log('cardTapSuccess.fire()')

    }

  }, [ready, cardTapSuccess])

  const triggerProductSuccessfullyVended = useCallback(() => {

    if (ready && productSuccessfullyVended) {

      productSuccessfullyVended.fire()
      console.log('productSuccessfullyVended.fire()')

    }

  }, [ready, productSuccessfullyVended])

  const triggerProductUnsuccessfullyVended = useCallback(() => {

    if (ready && productUnsuccessfullyVended) {

      productUnsuccessfullyVended.fire()

      console.log('productUnsuccessfullyVended.fire()')

    }

  }, [ready, productUnsuccessfullyVended])

  const triggerResetApp = useCallback(() => {

    if (ready && resetApp) {

      resetApp.fire()

      console.log('resetApp.fire()')

    }

  }, [ready, resetApp])

  return {
    RiveComponent,
    rive,
    buttonInputInOrder,
    triggerLandingButtonPressed,
    triggerUserYearsSelection,
    triggerCardTapSuccess,
    triggerProductSuccessfullyVended,
    triggerProductUnsuccessfullyVended,
    triggerResetApp,
    configureButtons,
    userYearsValue: userYearsSelection
  }
}
