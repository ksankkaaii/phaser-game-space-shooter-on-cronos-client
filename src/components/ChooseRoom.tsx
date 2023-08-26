import React, { useEffect, useState } from 'react';

import { useAppSelector } from 'hooks';

import {
  Wrapper,
  ModalWrapper,
  Content,
  Table,
  THead,
  TBody,
  TRow,
  Identify,
  MapType,
  Room,
  Population,
  Cost
} from './../styles/ChooseRoom';

import { RoomMode } from 'interfaces/RoomMode';
import Boot from 'phaser/scenes/BootScene'
import { setCurRoom } from 'stores/RoomStore';
import store from 'stores';

const getMaxTeamPlayerNumber = (mode: RoomMode): number => {
  let res = 1;
  switch (mode) {
    case RoomMode.OvO:
      res = 1;
      break;
    case RoomMode.DvD:
      res = 2;
      break;
    case RoomMode.TvT:
      res = 3;
      break;
  
    default:
      break;
  }

  return res;
}

const ChooseRoom = ({setShowMultiJoin, setIsViewMulti, playMultiplayer, PhaserGame}) => {
  const [password, setPassword] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [passwordFieldEmpty, setPasswordFieldEmpty] = useState(false);
  const lobbyJoined = useAppSelector((state) => state.room.lobbyJoined);
  const availableRooms = useAppSelector((state) => state.room.availableRooms);

  useEffect(() => {
    
  }, [availableRooms]);

  const handleJoinClick = (roomId: string, password: string | null) => {
    if (!lobbyJoined) return
    const bootstrap = PhaserGame.scene.keys.boot as Boot
    bootstrap._network.joinCustomById(roomId, password)
      .then(
        () => {
          setIsViewMulti(false);
          playMultiplayer();
        }
      )
      .catch((error) => {
        console.error(error)
        if (password) setShowPasswordError(true)
      })
  }
  
  const handlePasswordSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const isValidPassword = password !== ''

    if (isValidPassword === passwordFieldEmpty) setPasswordFieldEmpty(!passwordFieldEmpty)
    if (isValidPassword) handleJoinClick(selectedRoom, password)
  }

  return (
    <Wrapper>
      <ModalWrapper>
        <Content>
          <img 
            className='close' 
            src="assets/images/btn_close.png" 
            alt="close" 
            onClick={() => setShowMultiJoin(false)} 
          />
          <Table>
            <THead>
              <Identify>
                ID
              </Identify>
              <Room>
                Mode
              </Room>
              <MapType>
                Map
              </MapType>
              <Population>
                Players
              </Population>
              <Cost>
                Cost
              </Cost>
            </THead>
            <TBody>
              {availableRooms?.map((room: any, index: number) => {
                return <TRow 
                  key={index}
                  onClick={
                    () => {
                      if(room?.maxClients > room?.clients) {
                        handleJoinClick(room?.roomId, null);
                        store.dispatch(setCurRoom(getMaxTeamPlayerNumber(room?.metadata?.roomMode)));
                      }
                    }
                  }
                  joinable={room?.maxClients > room?.clients ? true : false}
                >
                  <Identify>
                  {room?.roomId}
                  </Identify>
                  <Room>
                  {room?.metadata?.roomMode}
                  </Room>
                  <MapType>
                  {room?.metadata?.mapMode}
                  </MapType>
                  <Population>
                  {room?.clients || 0}
                  </Population>
                  <Cost>
                  {room?.metadata?.cost || 0}
                  </Cost>
                </TRow>
              })}
              {(!availableRooms || availableRooms.length === 0) && <div style={{ textAlign: 'center', marginTop: 20 }}>There is no any Room!</div>}
            </TBody>
          </Table>
        </Content>
      </ModalWrapper>
    </Wrapper>
  )
}

export default ChooseRoom
