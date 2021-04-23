import { Flex } from 'antd-mobile'
import React, { Component } from 'react'

import SearchHeader from '../../components/SearchHeader/index'
import Filter from './components/Filter'

import styles from './index.module.css'
// 获取当前城市信息
const { label } = JSON.parse(localStorage.getItem('hkzf_city'))

export default class List extends Component {
    render() {
        return (
            <div>
                <Flex className={styles.header}>
                    <i className="iconfont icon-back" onClick={() => this.props.history.go(-1)}></i>
                    <SearchHeader cityName={label} className={styles.searchHeader}></SearchHeader>
                </Flex>
                <Filter></Filter>
            </div>
        )
    }
}