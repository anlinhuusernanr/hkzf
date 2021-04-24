import React from 'react';
import { withRouter } from 'react-router-dom'
import { NavBar } from 'antd-mobile'
import PropTypes from 'prop-types'
//import './index.scss'
import styles from './index.module.css'
function NavHeader({ children,
    history,
    onLeftClick,
    className,
    rightContent }) {
    console.log(onLeftClick)
    const defaultHandler = () => history.go(-1)
    return (
        <NavBar
            className={[styles.navBar, className || ''].join(' ')}
            mode="light"
            icon={<i className="iconfont icon-back"></i>}
            onLeftClick={onLeftClick || defaultHandler}
            rightContent={rightContent}
        >{children}</NavBar>
    )

}
NavHeader.propTypes = {
    children: PropTypes.string.isRequired,
    onLeftClick: PropTypes.func,
    className: PropTypes.string,
    rightContent: PropTypes.array
}

export default withRouter(NavHeader)