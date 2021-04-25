import { Flex, Toast } from 'antd-mobile'
import React, { Component } from 'react'

import SearchHeader from '../../components/SearchHeader/index'
import Filter from './components/Filter'
import { API } from '../../utils/api'
import { List, AutoSizer, WindowScroller, InfiniteLoader } from 'react-virtualized'
import HouseItem from '../../components/HouseItem/index'
import { BASE_URL } from '../../utils/url'
import Sticky from '../../components/Sticky/index'
import NoHouse from '../../components/NoHouse/index'
import { getCurrentCity } from '../../utils/index'
import styles from './index.module.css'
// 获取当前城市信息
//const { label } = JSON.parse(localStorage.getItem('hkzf_city'))

export default class HouseList extends Component {
    state = {
        list: [],
        count: 0,
        isLoading: false
    }
    label = ''
    value = ''
    filters = {}
    async componentDidMount() {
        const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'))
        this.label = label
        this.value = value
        this.searchHouseList()
    }
    async searchHouseList() {
        this.setState({
            isLoading: true
        })
        Toast.loading('加载中...', 0, null, false)
        const res = await API.get('/houses', {
            params: {
                cityId: this.value,
                ...this.filters,
                rentType: this.filters['mode'],
                start: 1,
                end: 20
            }
        })
        const { list, count } = res.data.body
        Toast.hide()
        if (count !== 0) {
            Toast.info(`共找到${count}房源`, 2, null, false)
        }
        this.setState({
            list,
            count,
            isLoading: false
        })
    }

    onFilter = (filters) => {
        window.scrollTo(0, 0)
        this.filters = filters
        this.searchHouseList()
    }
    renderHouseList = ({
        key,
        index,
        style,
    }) => {
        // 根据索引获取当前房屋数据
        const { list } = this.state
        const house = list[index]
        if (!house) {
            return <div key={key} style={style}>
                <p className={styles.loading}></p>
            </div>
        }
        return (
            <HouseItem
                key={key}
                style={style}
                src={BASE_URL + house.houseImg}
                title={house.title}
                desc={house.desc}
                tags={house.tags}
                price={house.price}
                onClick={() => this.props.history.push(`/detail/${house.houseCode}`)}
            ></HouseItem>
        )
    }
    isRowLoaded = ({ index }) => {
        return !!this.state.list[index]
    }
    loadMoreRows = ({ startIndex, stopIndex }) => {
        return new Promise(resolve => {
            API.get('/houses', {
                params: {
                    cityId: this.value,
                    ...this.filters,
                    rentType: this.filters['mode'],
                    start: startIndex,
                    end: stopIndex
                }
            }).then(res => {
                this.setState({
                    list: [...this.state.list, ...res.data.body.list]
                })
                resolve()
            })
        })
    }
    renderList() {
        const { count, isLoading } = this.state
        // 关键点：在数据加载完成后，再进行 count 的判断
        // 解决方式：如果数据加载中，则不展示 NoHouse 组件；而，但数据加载完成后，再展示 NoHouse 组件
        if (count === 0 && !isLoading) {
            return <NoHouse>没有找到房源，请您换个搜索条件吧~</NoHouse>
        }

        return (
            <InfiniteLoader
                isRowLoaded={this.isRowLoaded}
                loadMoreRows={this.loadMoreRows}
                rowCount={count}
            >
                {({ onRowsRendered, registerChild }) => (
                    <WindowScroller>
                        {({ height, isScrolling, scrollTop }) => (
                            <AutoSizer>
                                {({ width }) => (
                                    <List
                                        onRowsRendered={onRowsRendered}
                                        ref={registerChild}
                                        autoHeight // 设置高度为 WindowScroller 最终渲染的列表高度
                                        width={width} // 视口的宽度
                                        height={height} // 视口的高度
                                        rowCount={count} // List列表项的行数
                                        rowHeight={120} // 每一行的高度
                                        rowRenderer={this.renderHouseList} // 渲染列表项中的每一行
                                        isScrolling={isScrolling}
                                        scrollTop={scrollTop}
                                    />
                                )}
                            </AutoSizer>
                        )}
                    </WindowScroller>
                )}
            </InfiniteLoader>
        )
    }
    render() {
        return (
            <div>
                <Flex className={styles.header}>
                    <i className="iconfont icon-back" onClick={() => this.props.history.go(-1)}></i>
                    <SearchHeader cityName={this.label} className={styles.searchHeader}></SearchHeader>
                </Flex>
                <Sticky height={40}><Filter onFilter={this.onFilter}></Filter></Sticky>
                <div className={styles.houseItems}>
                    {this.renderList()}
                </div>
            </div>
        )
    }
}
