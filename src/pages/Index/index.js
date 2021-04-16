import React, { Component } from 'react';

import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile';
import axios from 'axios';
import { getCurrentCity } from '../../utils/index'

import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'

import './index.scss'

const navs = [
    {
        id: 1,
        img: Nav1,
        title: '整租',
        path: '/home/list'
    },
    {
        id: 2,
        img: Nav2,
        title: '合租',
        path: '/home/list'
    },
    {
        id: 3,
        img: Nav3,
        title: '地图找房',
        path: '/map'
    },
    {
        id: 4,
        img: Nav4,
        title: '去出租',
        path: '/rent'
    }
]
export default class Index extends Component {
    state = {
        swipers: [],
        isSwiperLoaded: false,
        groups: [],
        news: [],
        curCityName: ''
    }

    // 获取租房小组数据
    async getGroups() {
        const res = await axios.get(`http://localhost:8080/home/groups`, {
            params: {
                area: 'AREA%7C88cff55c-aaa4-e2e0'
            }
        })
        this.setState(() => {
            return {
                groups: res.data.body
            }
        })
    }
    // 获取轮播图数据
    async getSwiper() {
        const res = await axios.get("http://localhost:8080/home/swiper")
        this.setState(() => {
            return {
                swipers: res.data.body,
                isSwiperLoaded: true
            }
        })
    }
    // 获取最新资讯
    async getNews() {
        const res = await axios.get(
            'http://localhost:8080/home/news?area=AREA%7C88cff55c-aaa4-e2e0'
        )

        this.setState({
            news: res.data.body
        })
    }
    async componentDidMount() {
        this.getSwiper()
        this.getGroups()
        this.getNews()
        const curCity = await getCurrentCity()
        this.setState({
            curCityName: JSON.parse(curCity).label
        })
    }
    //获取当前城市
    // 渲染轮播图数据
    renderSwipers() {
        return this.state.swipers.map(item => (
            <a
                key={item.id}
                href="#"
                style={{ display: 'inline-block', width: '100%', height: 212 }}
            >
                <img
                    src={`http://localhost:8080${item.imgSrc}`}
                    alt=""
                    style={{ width: '100%', verticalAlign: 'top' }}
                />
            </a>
        ))
    }
    // 渲染导航栏
    renderNavs() {
        return navs.map(item =>
            <Flex.Item
                key={item.id}
                onClick={() => this.props.history.push(item.path)}
            >
                <img src={item.img} alt=""></img>
                <h2>{item.title}</h2>
            </Flex.Item>
        )
    }
    // 渲染最新资讯
    renderNews() {
        return this.state.news.map(item => (
            <div className="news-item" key={item.id}>
                <div className="imgwrap">
                    <img
                        className="img"
                        src={`http://localhost:8080${item.imgSrc}`}
                        alt=""
                    />
                </div>
                <Flex className="content" direction="column" justify="between">
                    <h3 className="title">{item.title}</h3>
                    <Flex className="info" justify="between">
                        <span>{item.from}</span>
                        <span>{item.date}</span>
                    </Flex>
                </Flex>
            </div>
        ))
    }
    render() {
        return (
            <div className="index">
                {/* 轮播图 */}
                <div className="swiper">
                    {
                        this.state.isSwiperLoaded ? <Carousel
                            autoplay={true}
                            infinite
                            autoplayInterval={5000}
                        >
                            {this.renderSwipers()}
                        </Carousel> : ''
                    }
                    {/* 搜索框 */}
                    <Flex className="search-box">
                        {/* 左侧白色区域 */}
                        <Flex className="search">
                            {/* 位置 */}
                            <div
                                className="location"
                                onClick={() => this.props.history.push('/citylist')}
                            >
                                <span className="name">{this.state.curCityName}</span>
                                <i className="iconfont icon-arrow" />
                            </div>

                            {/* 搜索表单 */}
                            <div
                                className="form"
                                onClick={() => this.props.history.push('/search')}
                            >
                                <i className="iconfont icon-seach" />
                                <span className="text">请输入小区或地址</span>
                            </div>
                        </Flex>
                        {/* 右侧地图图标 */}
                        <i
                            className="iconfont icon-map"
                            onClick={() => this.props.history.push('/map')}
                        />
                    </Flex>
                </div>
                {/* 导航 */}
                <Flex className="nav">
                    {this.renderNavs()}
                </Flex>
                {/* 租房小组 */}
                <div className="group">
                    <h3 className="group-title">
                        租房小组<span className='more'>更多</span>
                    </h3>
                    {/* 宫格组件 */}
                    <Grid data={this.state.groups}
                        columnNum={2}
                        square={false}
                        hasLine={false}
                        renderItem={(item) => (
                            <Flex className="group-item" justify="around" key={item.id}>
                                <div className="desc">
                                    <p className="title">{item.title}</p>
                                    <span className="info">{item.desc}</span>
                                </div>
                                <img
                                    src={`http://localhost:8080${item.imgSrc}`}
                                ></img>
                            </Flex>
                        )} />
                </div>
                {/* 最新资讯 */}
                <div className="news">
                    <h3 className="group-title">最新资讯</h3>
                    <WingBlank size="md">
                        {this.renderNews()}
                    </WingBlank>
                </div>
            </div>
        );
    }
}