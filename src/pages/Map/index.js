import React, { Component } from 'react';

import axios from 'axios'
//import './index.scss';
import { Link } from 'react-router-dom'
import styles from './index.module.css'
import NavHeader from '../../components/NavHeader/index'

//解决脚手架全局对象需使用window来访问的问题
const BMapGL = window.BMapGL
// 覆盖物样式
const labelStyle = {
    cursor: 'pointer',
    border: '0px solid rgb(255, 0, 0)',
    padding: '0px',
    whiteSpace: 'nowrap',
    fontSize: '12px',
    color: 'rgb(255, 255, 255)',
    textAlign: 'center'
}

export default class Map extends Component {
    state = {
        isShowList: false,
        housesList: []
    }
    componentDidMount() {
        this.initMap()
    }
    createCircle(point, name, count, id, zoom) {
        const label = new BMapGL.Label('', {
            position: point,                          // 设置标注的地理位置
            offset: new BMapGL.Size(-35, -35)           // 设置标注的偏移量
        });
        // 添加唯一id
        label.id = id
        // 设置房源覆盖物内容  设置setContent之后BMapGL.Label('', opts)中的文本内容就失效了
        label.setContent(`
                    <div class="${styles.bubble}">
                        <p class="${styles.name}">${name}</p>
                        <p>${count}套</p>
                    </div>
                `)
        // 设置样式
        label.setStyle(labelStyle)
        // 添加点击事件
        label.addEventListener('click', () => {
            // 获取该区域下面的信息
            this.renderOverlays(id)
            // 以当前点击覆盖物为中心方法地图
            this.map.centerAndZoom(point, zoom)
            // 清楚当前覆盖物信息
            this.map.clearOverlays()
        })
        // 添加文本到地图中
        this.map.addOverlay(label);
    }
    createRect(point, name, count, id) {
        const label = new BMapGL.Label('', {
            position: point,                          // 设置标注的地理位置
            offset: new BMapGL.Size(-50, -28)           // 设置标注的偏移量
        });
        // 添加唯一id
        label.id = id
        // 设置房源覆盖物内容  设置setContent之后BMapGL.Label('', opts)中的文本内容就失效了
        label.setContent(`
            <div class="${styles.rect}">
                <span class="${styles.housename}">${name}</span>
                <span class="${styles.housenum}">${count}套</span>
                <i class="${styles.arrow}"></i>
            </div>
                `)
        // 设置样式
        label.setStyle(labelStyle)
        // 添加点击事件
        label.addEventListener('click', (e) => {
            const { offsetLeft, offsetTop } = e.currentTarget
            console.log(e)
            this.map.panBy(
                window.innerWidth / 2 - offsetLeft,
                (window.innerHeight - 330) / 2 - offsetTop
            )
            this.getHouseList(id)
        })
        // 添加文本到地图中
        this.map.addOverlay(label);
    }
    async getHouseList(id) {
        const res = await axios.get(`http://localhost:8080/houses?cityId=${id}`)
        console.log(res)
        this.setState({
            housesList: res.data.body.list,
            isShowList: true
        })
    }
    createOverlays(data, zoom, type) {
        const { coord: { latitude, longitude }, label: areaName, count, value } = data
        //创建坐标对象
        const areaPoint = new BMapGL.Point(longitude, latitude)
        if (type === 'circle') {
            // 创建区
            this.createCircle(areaPoint, areaName, count, value, zoom)
        } else {
            // 创建小区
            this.createRect(areaPoint, areaName, count, value)
        }
    }
    // 获取类型与级别
    getTypeAndZoom() {
        const zoom = this.map.getZoom();
        let nextZoom, type
        if (zoom >= 10 && zoom < 12) {
            type = "circle";
            nextZoom = 13
        } else if (zoom >= 12 && zoom < 14) {
            type = "circle";
            nextZoom = 15
        } else if (zoom >= 14 && zoom < 16) {
            type = "rect";
            nextZoom = 15
        }
        return { type, nextZoom }
    }
    // 渲染覆盖物入口
    async renderOverlays(id) {
        const res = await axios.get(`http://localhost:8080/area/map?id=${id}`)
        const data = res.data.body
        const { type, nextZoom } = this.getTypeAndZoom()
        data.forEach(item => {
            this.createOverlays(item, nextZoom, type)
        })
    }
    initMap() {
        // 获取当前定位城市
        const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'))
        // 在react脚手架中全局对象需要使用window来访问,否则会造成ESLink校验错误
        const map = new BMapGL.Map("container");
        // 把map交给this
        this.map = map
        // 设置中心点坐标
        //var point = new window.BMapGL.Point(116.404, 39.915);
        //创建地址解析器实例
        const myGeo = new BMapGL.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野
        myGeo.getPoint(label, async (point) => {
            if (point) {
                //初始化地图同时设置展示级别
                map.centerAndZoom(point, 11);
                // map.addOverlay(new BMapGL.Marker(point))
                // 添加常用控件
                map.addControl(new BMapGL.ZoomControl());
                map.addControl(new BMapGL.LocationControl());
                map.addControl(new BMapGL.ScaleControl());
                map.enableScrollWheelZoom(true);
                this.renderOverlays(value)

                // 获取房源数据
                // const res = await axios.get(`http://localhost:8080/area/map?id=${value}`)
                // console.log(res)
                // res.data.body.forEach(item => {
                //     const { coord: { latitude, longitude }, label: areaName, count, value } = item
                //     // 添加文版覆盖物
                //     // 创建文本标注
                //     const areaPoint = new BMapGL.Point(longitude, latitude)
                //     const opts = {
                //         position: areaPoint,                          // 设置标注的地理位置
                //         offset: new BMapGL.Size(-35, -35)           // 设置标注的偏移量
                //     }
                //     const label = new BMapGL.Label('', opts);
                //     // 添加唯一id
                //     label.id = value
                //     // 设置房源覆盖物内容  设置setContent之后BMapGL.Label('', opts)中的文本内容就失效了
                //     label.setContent(`
                //     <div class="${styles.bubble}">
                //         <p class="${styles.name}">${areaName}</p>
                //         <p>${count}套</p>
                //     </div>
                // `)
                //     // 设置样式
                //     label.setStyle(labelStyle)
                //     // 添加点击事件
                //     label.addEventListener('click', () => {
                //         console.log('点击了房源', label.id)
                //         // 以当前点击覆盖物为中心方法地图
                //         map.centerAndZoom(areaPoint, 13)
                //         // 清楚当前覆盖物信息
                //         map.clearOverlays()
                //     })
                //     // 添加文本到地图中
                //     map.addOverlay(label);
                // })

            } else {
                alert('您选择的地址没有解析到结果！');
            }
        }, label)
        // 给地图绑定事件
        map.addEventListener('movestart', () => {
            if (this.state.isShowList) {
                this.setState({
                    isShowList: false
                })
            }
        })
    }
    renderHousesList() {
        return this.state.housesList.map(item => (
            <div className={styles.house} key={item.houseCode}>
                <div className={styles.imgWrap}>
                    <img
                        className={styles.img}
                        src={`http://localhost:8080${item.houseImg}`}
                        alt=""
                    />
                </div>
                <div className={styles.content}>
                    <h3 className={styles.title}>{item.title}</h3>
                    <div className={styles.desc}>{item.desc}</div>
                    <div>
                        {item.tags.map((tag, index) => {
                            const tagClass = 'tag' + (index + 1)
                            return (
                                <span
                                    className={[styles.tag, styles[tagClass]].join(' ')}
                                    key={tag}
                                >
                                    {tag}
                                </span>
                            )
                        })}
                    </div>
                    <div className={styles.price}>
                        <span className={styles.priceNum}>{item.price}</span> 元/月
  </div>
                </div>
            </div>
        ))
    }
    render() {
        return (
            <div className={styles.map}>
                <NavHeader >
                    地图找房
                </NavHeader>
                <div id="container" className={styles.container}></div>
                {/* 房源列表 */}
                {/* 添加 styles.show 展示房屋列表 */}
                <div
                    className={[
                        styles.houseList,
                        this.state.isShowList ? styles.show : ''
                    ].join(' ')}
                >
                    <div className={styles.titleWrap}>
                        <h1 className={styles.listTitle}>房屋列表</h1>
                        <Link className={styles.titleMore} to="/home/list">
                            更多房源
                        </Link>
                    </div>

                    <div className={styles.houseItems}>
                        {/* 房屋结构 */}
                        {this.renderHousesList()}
                    </div>
                </div>
            </div>
        )
    }
}