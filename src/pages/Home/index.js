import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import { TabBar } from 'antd-mobile';

import './index.css';

import News from '../News/index';
import HouseList from '../HouseList/index';
import Index from '../Index/index';
import Profile from '../profile/index';



const tabItems = [
    {
        title: '首页',
        icon: 'icon-ind',
        path: '/home'
    },
    {
        title: '找房',
        icon: 'icon-findHouse',
        path: '/home/list'
    },
    {
        title: '资讯',
        icon: 'icon-infom',
        path: '/home/news'
    },
    {
        title: '我的',
        icon: 'icon-my',
        path: '/home/profile'
    },

]
/**
 * 问题:点击首页导航菜单，导航到找房列表页面时，找房菜单没有高亮
 * 原因：在实现该功能时候，只考虑了第一次Home组件的情况，但是我们没有考虑不重新加载Home组件时候的路由切换 
 * 思路：监听路由切换，执行菜单逻辑，添加componentDidUpdate，在该函数中判断路由切换 
 */
export default class Home extends Component {

    state = {
        //默认选中菜单项
        selectedTab: this.props.location.pathname,
    };

    componentDidUpdate(prevProps) {
        console.log(prevProps)
        console.log(this.props)
        if (prevProps.location.pathname !== this.props.location.pathname) {
            this.setState(() => ({ selectedTab: this.props.location.pathname }))
        }
    }
    //渲染每个tabbarItem的内容
    renderTabBarItem() {
        return tabItems.map(item => <TabBar.Item
            icon={<i className={`iconfont ${item.icon}`}></i>}
            selectedIcon={<i className={`iconfont ${item.icon}`}></i>}
            title={item.title}
            key={item.title}
            selected={this.state.selectedTab === item.path}
            onPress={() => {
                this.setState({
                    selectedTab: item.path,
                });
                this.props.history.push(item.path)
            }}
        >
        </TabBar.Item>)
    }

    render() {
        return (
            <div className="home">
                <Route path="/home/news" component={News}></Route>
                <Route exact path="/home" component={Index}></Route>
                <Route path="/home/list" component={HouseList}></Route>
                <Route path="/home/profile" component={Profile}></Route>
                {/* Tabbar */}
                <TabBar
                    tintColor="#21b97a"
                    barTintColor="white"
                    noRenderContent={true}
                >
                    {this.renderTabBarItem()}
                </TabBar>
            </div>
        )
    }
}