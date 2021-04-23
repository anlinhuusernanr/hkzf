import React from 'react';
import { withRouter } from 'react-router-dom'
import { NavBar } from 'antd-mobile'
import PropTypes from 'prop-types'
//import './index.scss'
import styles from './index.module.css'
function NavHeader({ children, history, onLeftClick }) {
    console.log(onLeftClick)
    const defaultHandler = () => history.go(-1)
    return (
        <NavBar
            className={styles.navBar}
            mode="light"
            icon={<i className="iconfont icon-back"></i>}
            onLeftClick={onLeftClick || defaultHandler}
        >{children}</NavBar>
    )

}
NavHeader.propTypes = {
    children: PropTypes.string.isRequired,
    onLeftClick: PropTypes.func
}

export default withRouter(NavHeader)