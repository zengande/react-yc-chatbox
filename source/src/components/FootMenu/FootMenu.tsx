import * as React from 'react';
import { Menu } from './Menu';
import MenuItem from './MenuItem';
const styles = require('./FootMenu.css');

export interface IFootMenuProps {
    style?: React.CSSProperties;
    menus?: Menu[],
    closed?: () => void;
}

class FootMenu extends React.PureComponent<IFootMenuProps> {
    render() {
        const { style, menus, closed } = this.props;
        return (
            <div style={style} className={styles.container}>
                {
                    menus && menus.length > 0 ?
                        menus.map((menu, index) => (<MenuItem key={index} menu={menu} onClicked={(close) => {
                            close && closed && closed();
                        }} />)) :
                        <p>无菜单项</p>
                }
            </div>
        )
    }
}

export default FootMenu;