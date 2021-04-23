import React, { Component } from 'react'

import { API } from '../../../../utils/api'
import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import styles from './index.module.css'


const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false
}
const selectedValue = {
  area: ['area', 'null'],
  mode: ['null'],
  price: ['null'],
  more: []
}
export default class Filter extends Component {
  state = {
    titleSelectedStatus,
    // 控制FilterPicker或FilterMore的展示隐藏
    openType: '',
    filtersData: {},
    selectedValue,
  }
  componentDidMount() {
    this.getFiltersData()
  }
  // 获取数据
  async getFiltersData() {
    const { value } = JSON.parse(localStorage.getItem('hkzf_city'))
    const res = await API.get(`/houses/condition?id=${value}`)
    this.setState({
      filtersData: res.data.body
    })
  }
  onTitleClick = (type) => {
    const { titleSelectedStatus, selectedValue } = this.state
    // 创建新的标题选择状态
    const newTitleSelectedStatus = { ...titleSelectedStatus }
    Object.keys(titleSelectedStatus).forEach(key => {
      if (key === type) {
        newTitleSelectedStatus[type] = true
        return
      }
      const selectedVal = selectedValue[key]
      if (key === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')) {
        newTitleSelectedStatus[key] = true
      } else if (key === 'mode' && selectedVal[0] !== 'null') {
        newTitleSelectedStatus[key] = true
      } else if (key === 'price' && selectedVal[0] !== 'null') {
        newTitleSelectedStatus[key] = true
      } else if (key === 'more' && selectedVal.length !== 0) {
        newTitleSelectedStatus[key] = true
      } else {
        newTitleSelectedStatus[key] = false
      }
    })
    this.setState({
      openType: type,
      titleSelectedStatus: newTitleSelectedStatus
    })
    // this.setState(preType => {
    //   return {
    //     titleSelectedStatus: {
    //       // 获取当前对象的所有属性
    //       ...preType.titleSelectedStatus,
    //       [type]: true
    //     },
    //     openType: type
    //   }
    // })
  }
  onCancel = (type) => {
    const { titleSelectedStatus, selectedValue } = this.state
    // 创建新的标题选择状态
    const newTitleSelectedStatus = { ...titleSelectedStatus }
    const selectedVal = selectedValue[type]
    if (type === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')) {
      newTitleSelectedStatus[type] = true
    } else if (type === 'mode' && selectedVal[0] !== 'null') {
      newTitleSelectedStatus[type] = true
    } else if (type === 'price' && selectedVal[0] !== 'null') {
      newTitleSelectedStatus[type] = true
    } else if (type === 'more' && selectedVal.length !== 0) {
      newTitleSelectedStatus[type] = true
    } else {
      newTitleSelectedStatus[type] = false
    }
    this.setState({
      openType: '',
      titleSelectedStatus: newTitleSelectedStatus
    })
  }
  onSave = (type, value) => {
    const { titleSelectedStatus } = this.state
    // 创建新的标题选择状态
    const newTitleSelectedStatus = { ...titleSelectedStatus }
    const selectedVal = value
    if (type === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')) {
      newTitleSelectedStatus[type] = true
    } else if (type === 'mode' && selectedVal[0] !== 'null') {
      newTitleSelectedStatus[type] = true
    } else if (type === 'price' && selectedVal[0] !== 'null') {
      newTitleSelectedStatus[type] = true
    } else if (type === 'more' && selectedVal.length !== 0) {
      newTitleSelectedStatus[type] = true
    } else {
      newTitleSelectedStatus[type] = false
    }
    this.setState({
      openType: '',
      selectedValue: {
        ...this.state.selectedValue,
        [type]: value
      },
      titleSelectedStatus: newTitleSelectedStatus
    })
  }
  // 渲染filterPicker组件的方法
  renderFilterPicker() {
    const { openType, filtersData: { area, subway, rentType, price }, selectedValue } = this.state
    if (openType !== 'area' && openType !== 'mode' && openType !== 'price') {
      return null
    }
    // 根据openType来拿当前筛选数据
    let data = []
    let cols = 3
    let defaultValue = selectedValue[openType]
    switch (openType) {
      case 'area':
        data = [area, subway]
        cols = 3
        break;
      case 'mode':
        data = rentType
        cols = 1
        break;
      case 'price':
        data = price
        cols = 1
        break;
      default:
        break
    }
    return <FilterPicker
      key={openType}
      onCancel={this.onCancel}
      onSave={this.onSave}
      data={data}
      cols={cols}
      type={openType}
      defaultValue={defaultValue} />
  }
  // 渲染filterMore组件
  renderFilterMore() {
    const {
      openType,
      selectedValue,
      filtersData: { roomType, oriented, floor, characteristic } } = this.state
    if (openType !== 'more') {
      return null
    }
    const data = {
      roomType,
      oriented,
      floor,
      characteristic
    }
    const defaultValue = selectedValue.more
    return <FilterMore data={data} type={openType} onSave={this.onSave}
      defaultValue={defaultValue}
      onCancel={this.onCancel}
    ></FilterMore>
  }
  render() {
    const { titleSelectedStatus, openType } = this.state
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {
          (openType === 'area' || openType === 'mode' || openType === 'price') ?
            <div className={styles.mask} onClick={() => { this.onCancel(openType) }} /> : null
        }

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle titleSelectedStatus={titleSelectedStatus} onClick={this.onTitleClick} />

          {/* 前三个菜单对应的内容： */}
          {
            this.renderFilterPicker()
          }


          {/* 最后一个菜单对应的内容： */}
          {this.renderFilterMore()}
        </div>
      </div>
    )
  }
}