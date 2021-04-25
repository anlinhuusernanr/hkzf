import React from 'react';
import { withRouter } from 'react-router-dom'
import { NavBar } from 'antd-mobile'
import PropTypes from 'prop-types'
//import './index.scss'
import styles from './index.module.css'
<<<<<<< HEAD
function NavHeader({ children,
    history,
    onLeftClick,
    className,
    rightContent }) {
=======
function NavHeader({ children, history, onLeftClick }) {
>>>>>>> cbde0036de1da847591541642d20d7cc9903ff71
    console.log(onLeftClick)
    const defaultHandler = () => history.go(-1)
    return (
        <NavBar
<<<<<<< HEAD
            className={[styles.navBar, className || ''].join(' ')}
            mode="light"
            icon={<i className="iconfont icon-back"></i>}
            onLeftClick={onLeftClick || defaultHandler}
            rightContent={rightContent}
=======
            className={styles.navBar}
            mode="light"
            icon={<i className="iconfont icon-back"></i>}
            onLeftClick={onLeftClick || defaultHandler}
>>>>>>> cbde0036de1da847591541642d20d7cc9903ff71
        >{children}</NavBar>
    )

}
NavHeader.propTypes = {
    children: PropTypes.string.isRequired,
<<<<<<< HEAD
    onLeftClick: PropTypes.func,
    className: PropTypes.string,
    rightContent: PropTypes.array
=======
    onLeftClick: PropTypes.func
>>>>>>> cbde0036de1da847591541642d20d7cc9903ff71
}

export default withRouter(NavHeader)