import * as React from 'react';
import { Menu } from './Menu';
import IconFont from '../IconFont';
const styles = require('./MenuItem.css');

export interface IMenuItemProps {
    menu: Menu
}

class MenuItem extends React.Component<IMenuItemProps> {
    render() {
        const { menu } = this.props;
        const menuContent = (
            <div className={styles.content} onClick={menu.onClick}>
                <p className={styles.icon}><IconFont type={menu.icon} /></p>
                <p className={styles.text}>{menu.text}</p>
            </div>
        )
        return (
            <div className={styles.menu}>
                {menu.link ?
                    <a href={menu.link}>{menuContent}</a> :
                    menuContent
                }
            </div>
        )
    }
}

export default MenuItem;