import { Joystick } from 'react-joystick-component'

export interface JoystickMovement {
  isMoving: boolean
  direction: number
}

interface Props {
  onDirectionChange: (arg: JoystickMovement) => void
}

const JoystickItem = (props: Props) => {
  return (
    <Joystick
      size={75}
      baseColor="#4b4b4b70"
      stickColor="#42eacb80"
      stop={(event) => {
        const x1 = 0
        const y1 = event.y ?? 0
        const x2 = event.x ?? 0
        const y2 = 0
        var deltaX = x2 - x1 // distance between joystick and center
        var deltaY = y2 - y1 // distance between joystick and center
        var rad = Math.atan2(deltaY, deltaX) // In radians
        var deg = (rad * 180) / Math.PI // In degrees
        var direction = (deg + 360) % 360; // Convert degrees to direction
        props.onDirectionChange({
          isMoving: false,
          direction
        })
      }}
      move={(event) => {
        const x1 = 0
        const y1 = event.y ?? 0
        const x2 = event.x ?? 0
        const y2 = 0
        var deltaX = x2 - x1 // distance between joystick and center
        var deltaY = y2 - y1 // distance between joystick and center
        var rad = Math.atan2(deltaY, deltaX) // In radians
        var deg = (rad * 180) / Math.PI // In degrees
        var direction = (deg + 360) % 360; // Convert degrees to direction
        props.onDirectionChange({ isMoving: true, direction })
      }}
    />
  )
}

export default JoystickItem
