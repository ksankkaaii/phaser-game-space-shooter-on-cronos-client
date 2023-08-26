import store from '../stores'
import { setIsExist } from '../stores/PhaserStore'

import { phaserEvents, Event } from '../events/EventCenter'

import { Wrapper, ModalWrapper, Buttons } from '../styles/Confirm'

const Confirm = () => {

  const exitGame = () => {
    phaserEvents.emit(Event.EXIST_GAME)
    store.dispatch(setIsExist(false))
  }
  return (
    <Wrapper>
      <ModalWrapper>
        <Buttons>
          <img src="assets/images/btn_yes.png" alt="yes" onClick={() => exitGame()} />
          <img src="assets/images/btn_no.png" alt="no" onClick={() => store.dispatch(setIsExist(false))} />
        </Buttons>
      </ModalWrapper>
    </Wrapper>
  )
}

export default Confirm