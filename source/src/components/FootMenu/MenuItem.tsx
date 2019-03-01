import * as React from 'react';
import { Menu } from './Menu';
import IconFont from '../IconFont';
const styles = require('./MenuItem.css');

export interface IMenuItemProps {
    menu: Menu,
    onClicked: (close: boolean) => void;
}

class MenuItem extends React.Component<IMenuItemProps> {
    shouldComponentUpdate(nextProps: IMenuItemProps) {
        return nextProps.menu.icon != this.props.menu.icon ||
            nextProps.menu.link != this.props.menu.link ||
            nextProps.menu.onClick != this.props.menu.onClick ||
            nextProps.menu.text != this.props.menu.text ||
            nextProps.menu.disabled != this.props.menu.disabled ||
            nextProps.menu.title != this.props.menu.title ||
            nextProps.onClicked != this.props.onClicked;
    }

    render() {
        const { menu, onClicked } = this.props;
        let menuClassName = styles.menu;
        if (menu.disabled) {
            menuClassName += ` ${styles.disabled}`;
        }
        const menuContent = (
            <div className={styles.content} onClick={() => {
                if (menu.disabled) {
                    return;
                }
                let close = false;
                if (menu.onClick) {
                    close = menu.onClick();
                }
                onClicked(close);
            }}>
                <p className={styles.icon}><IconFont type={menu.icon} /></p>
                <p className={styles.text}>{menu.text}</p>
            </div>
        )
        return (
            <div className={menuClassName} title={menu.title ? menu.title : menu.text}>
                {menu.link ?
                    <a href={menu.link} className={styles.link}>{menuContent}</a> :
                    menuContent
                }
            </div>
        )
    }
}

export default MenuItem;