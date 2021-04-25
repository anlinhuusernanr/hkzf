import React from 'react'

import { Flex } from 'antd-mobile'
import PropTypes from 'prop-types'

import styles from './index.module.css'

function FilterFooter({
<<<<<<< HEAD
    cancelText = '取消',
    okText = '确定',
    onCancel,
    onOk,
    className
}) {
    return (
        <Flex className={[styles.root, className || ''].join(' ')}>
            {/* 取消按钮 */}
            <span
                className={[styles.btn, styles.cancel].join(' ')}
                onClick={onCancel}
            >
                {cancelText}
            </span>

            {/* 确定按钮 */}
            <span className={[styles.btn, styles.ok].join(' ')} onClick={onOk}>
                {okText}
            </span>
        </Flex>
    )
=======
  cancelText = '取消',
  okText = '确定',
  onCancel,
  onOk,
  className
}) {
  return (
    <Flex className={[styles.root, className || ''].join(' ')}>
      {/* 取消按钮 */}
      <span
        className={[styles.btn, styles.cancel].join(' ')}
        onClick={onCancel}
      >
        {cancelText}
      </span>

      {/* 确定按钮 */}
      <span className={[styles.btn, styles.ok].join(' ')} onClick={onOk}>
        {okText}
      </span>
    </Flex>
  )
>>>>>>> cbde0036de1da847591541642d20d7cc9903ff71
}

// props校验
FilterFooter.propTypes = {
<<<<<<< HEAD
    cancelText: PropTypes.string,
    okText: PropTypes.string,
    onCancel: PropTypes.func,
    onOk: PropTypes.func,
    className: PropTypes.string
}

export default FilterFooter
=======
  cancelText: PropTypes.string,
  okText: PropTypes.string,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  className: PropTypes.string
}

export default FilterFooter
>>>>>>> cbde0036de1da847591541642d20d7cc9903ff71
