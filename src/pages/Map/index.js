import React, { Component } from 'react';

import './index.scss';


export default class Map extends Component {
    componentDidMount() {
        // 在react脚手架中全局对象需要使用window来访问,否则会造成ESLink校验错误
        const map = new window.BMapGL.Map("container");
        // 设置中心点坐标
        var point = new window.BMapGL.Point(116.404, 39.915);
        //初始化地图同时设置展示级别
        map.centerAndZoom(point, 15);
    }
    render() {
        return (
            <div className="map">
                <div id="container"></div>
            </div>
        )
    }
}