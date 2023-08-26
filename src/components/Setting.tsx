import { useState, useEffect } from 'react'
import Hotkeys from 'react-hot-keys'

import { Wrapper, ModalWrapper, SettingWrapper, SettingRow, Label, Keyboard } from '../styles/Setting'

const Setting = ({ setIsSetting, keyboard, setKeboard }) => {

  let settingsDefault = [
    { key: 'forward', label: "Move Forward", keyboard: keyboard.forward },
    { key: 'left', label: "Move Left", keyboard: keyboard.left },
    { key: 'right', label: "Move Right", keyboard: keyboard.right },
    { key: 'brake', label: "Brake", keyboard: keyboard.brake },
    { key: 'fire', label: "Fire", keyboard: keyboard.fire },
    { key: 'special', label: "Special", keyboard: keyboard.special },
    { key: 'music', label: "Music ON/OFF", keyboard: keyboard.music },
    { key: 'sounds', label: "Sounds ON/OFF", keyboard: keyboard.sounds },
    { key: 'exit', label: "Exit", keyboard: keyboard.exit },
  ]

  const [settings, setSettings] = useState(undefined)
  const [selectedRow, setSelectedRow] = useState('')

  useEffect(() => {
    setSettings(settingsDefault)
  }, [])

  const filterKey = (key: string) => {
    if (key === ' ') return "SPACE"
    else if (key === 'Escape') return "ESC"
    else if (key.startsWith("Arrow")) return key.replace("Arrow", '').toUpperCase()
    else return key.toUpperCase()
  }

  const changeKeyboard = (key: string) => {
    setKeboard(prevState => ({
      ...prevState,
      [selectedRow]: filterKey(key)
    }))
  }

  const onKeyDown = (keyName, e, handle) => {
    if (selectedRow !== '') {
      changeKeyboard(e.key)
      let temp = settings.map((setting) => {
        if (setting.key === selectedRow) {
          setting.keyboard = filterKey(e.key)
        }
        return setting
      })
      setSettings([...temp])
      setSelectedRow('')
    }
  }

  return (
    <Wrapper>
      <ModalWrapper>
        <SettingWrapper>
          {settings?.map((setting, index) => (
            <SettingRow key={index} selected={setting.key === selectedRow} onClick={() => setSelectedRow(setting.key)}>
              <Label>{setting.label}</Label>
              <Keyboard>{setting.keyboard}</Keyboard>
            </SettingRow>
          ))}
        </SettingWrapper>
        <img className='close' src="assets/images/btn_close.png" alt="close" onClick={() => setIsSetting(false)} />
        <Hotkeys
          keyName="a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,space,esc,up,down,left,right"
          onKeyDown={onKeyDown}
        />
      </ModalWrapper>
    </Wrapper>
  )
}

export default Setting