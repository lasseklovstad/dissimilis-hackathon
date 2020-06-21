import React from "react"
import styles from './MusicIcon.module.scss'
import {makeStyles} from "@material-ui/core/styles"

export type MusicIconProps = {
    navn: 'half-note' | 'whole-note' | 'quarter-note' | 'eighth-note',
    id?: string,
    color?: 'green' | 'primary' | 'secondary' | 'warning' | 'error' |'white',
    size?: 'small' | 'medium' | 'large',
    space?: 'left' | 'right'
}



export const MusicIcon: React.FC<MusicIconProps> = props => {
    const colorStyle = useStyle(props)
    return <div id={props.id} role={'figure'}
                aria-describedby={props.navn}
                aria-labelledby={'caption-' + props.id}
                className={`${props.navn ? styles[props.navn] : ''} ${colorStyle.root}`}/>
}

const useStyle = makeStyles((theme) => ({
    root: (props: MusicIconProps) => {
        const style = {
            color: 'black',
            fontSize: theme.typography.h4?.fontSize,
            marginLeft: '0',
            marginRight: '0'
        }

        switch (props.color) {
            case "primary":
                style.color = theme.palette.primary.main
                break
            case "secondary":
                style.color = theme.palette.secondary.main
                break
            case "error":
                style.color = theme.palette.error.main
                break
            case "warning":
                style.color = theme.palette.warning.main
                break
            case "green":
                style.color = theme.palette.success.main
                break
            case "white":
                style.color = 'white'
                break
        }

        switch (props.size) {
            case "small":
                style.fontSize = theme.typography.subtitle2?.fontSize
                break
            case "medium":
                style.fontSize = theme.typography.h4?.fontSize
                break
            case "large":
                style.fontSize = theme.typography.h2?.fontSize
                break
        }

        switch (props.space) {
            case "left":
                style.marginLeft = '5px'
                break
            case "right":
                style.marginRight = '5px'
                break
        }

        return style
    }

}))