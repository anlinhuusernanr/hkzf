import React, { Component } from 'react'

import FilterFooter from '../../../../components/FilterFooter'

import styles from './index.module.css'

export default class FilterMore extends Component {
  state = {
    selectedValue: this.props.defaultValue
  }
  onTagClick = (value) => {
    const { selectedValue } = this.state
    const newSelectedValue = [...selectedValue]
    if (selectedValue.indexOf(value) <= -1) {
      // 没有当前项的值
      newSelectedValue.push(value)
    } else {
      const index = newSelectedValue.findIndex(item => item === value)
      newSelectedValue.splice(index, 1)
    }
    this.setState({
      selectedValue: newSelectedValue
    })
  }
  // 渲染标签
  renderFilters(data) {
    const { selectedValue } = this.state
    // 高亮类名： styles.tagActive
    return data.map(item => {
      const isSelected = selectedValue.indexOf(item.value) > -1
      return (
        <span
          key={item.value}
          className={[styles.tag, (isSelected ? styles.tagActive : '')].join(' ')}
          onClick={() => this.onTagClick(item.value)}
        >{item.label}</span>
      )
    })
  }
  // 取消按钮事件处理
  onCancel = () => {
    this.setState({
      selectedValue: []
    })
  }
  onOk = () => {
    const { type, onSave } = this.props
    onSave(type, this.state.selectedValue)
  }
  render() {
    const { data: { roomType, oriented, floor, characteristic }, onCancel, type } = this.props
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div className={styles.mask} onClick={() => onCancel(type)} />

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter
          className={styles.footer}
          cancelText="清除"
          onCancel={this.onCancel}
          onOk={this.onOk}
        />
      </div>
    )
  }
}