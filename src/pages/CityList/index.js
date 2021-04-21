import React, { Component } from 'react';

import { Toast } from 'antd-mobile';
import "./index.scss"
import axios from 'axios';
import { getCurrentCity } from '../../utils/index'
import { List, AutoSizer } from 'react-virtualized'

import NavHeader from '../../components/NavHeader/index'

// 数据格式化的方法
const formatCityData = (list) => {
    const cityList = {};
    // 获取cityList
    list.forEach(item => {
        const frist = item.short.substr(0, 1)
        if (cityList[frist]) {
            cityList[frist].push(item)
        } else {
            cityList[frist] = []
            cityList[frist].push(item)
        }
    })
    // 获取索引数据
    const cityIndex = Object.keys(cityList).sort()
    return {
        cityList,
        cityIndex,
    }
}

const fromatCityIndex = (letter) => {
    switch (letter) {
        case '#':
            return '当前城市'
            break;
        case 'hot':
            return '热门城市'
            break;
        default:
            return letter.toUpperCase()
            break;
    }
}
// 索引标题高度
const TITLE_HEIGHT = 36
// 每个城市名称高度
const NAME_HEIGHT = 50
// 当前热门城市
const HOST_CITY = ['北京', '上海', '广州', '深圳']
export default class CityList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cityIndex: [],
            cityList: {},
            activeIndex: 0
        }
        // 创建ref对象
        this.cityListComponent = React.createRef()
    }
    async componentDidMount() {
        await this.getCityList()
        // measureAllRows 提前计算List中每一行的高度实现scrollToRow 的精确跳转
        //注意应该保证List组件中已经拥有数据  保证在获取数据之后在执行 
        this.cityListComponent.current.measureAllRows()
    }

    //获取城市列表数据
    async getCityList() {
        const res = await axios.get('http://localhost:8080/area/city?level=1')
        const { cityList, cityIndex } = formatCityData(res.data.body)
        // 获取热门城市
        const hotRes = await axios.get('http://localhost:8080/area/hot')
        cityList['hot'] = hotRes.data.body
        cityIndex.unshift('hot')
        // 获取当前定位城市
        const curCity = await getCurrentCity()
        cityList['#'] = [JSON.parse(curCity)]
        cityIndex.unshift('#')
        this.setState({
            cityIndex,
            cityList
        })
    }
    // 城市点击改变切换
    changeCity = ({ label, value }) => {
        if (HOST_CITY.indexOf(label) > -1) {
            localStorage.setItem('hkzf_city', JSON.stringify({ label, value }))
            this.props.history.go(-1)
        } else {
            Toast.info('该城市暂无房源', 1, null, false)
        }
    }
    rowRenderer = ({
        key, // Unique key within array of rows
        index, // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style, // Style object to be applied to row (to position it)
    }) => {
        const { cityIndex, cityList } = this.state
        const letter = cityIndex[index]
        return (<div key={key} style={style} className="city">
            <div className="title">{fromatCityIndex(letter)}</div>
            {
                cityList[letter].map(item => <div className="name" key={item.value} onClick={() => this.changeCity(item)}>{item.label}</div>)
            }
        </div>)
    }
    // 创建动态计算每一行的高度
    getRowHeight = ({ index }) => {
        const { cityIndex, cityList } = this.state
        // 索引标题高度 + 城市数量 * 城市名称高度
        //TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT

        return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT
    }
    // 渲染右侧所以列表方法
    renderCityIndex = () => {
        const { cityIndex, activeIndex } = this.state
        return cityIndex.map((item, index) =>
            <li className="city-index-item" key={item} onClick={() => {
                this.cityListComponent.current.scrollToRow(index)
            }}>
                <span className={activeIndex === index ? 'index-active' : ''}>{item === 'hot' ? '热' : item.toUpperCase()}</span>
            </li>)
    }
    // 用于获取List组件渲染行信息
    onRowsRendered = ({ startIndex }) => {
        if (this.state.activeIndex !== startIndex) {
            this.setState({
                activeIndex: startIndex
            })
        }
    }
    render() {
        return (
            <div className="cityList">
                <NavHeader>城市列表</NavHeader>
                <AutoSizer>
                    {
                        ({ width, height }) =>
                            <List
                                ref={this.cityListComponent}
                                width={width}
                                height={height}
                                rowCount={this.state.cityIndex.length}
                                rowHeight={this.getRowHeight}
                                rowRenderer={this.rowRenderer}
                                onRowsRendered={this.onRowsRendered}
                                scrollToAlignment="start"
                            />

                    }
                </AutoSizer>
                {/* 右侧索引列表 */}
                <ul className="city-index">
                    {this.renderCityIndex()}
                </ul>
            </div>
        )
    }
}