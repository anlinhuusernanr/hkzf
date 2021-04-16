import axios from 'axios';

export const getCurrentCity = () => {
    const loaclCity = localStorage.getItem('hkzf_city')
    if (!loaclCity) {
        return new Promise((resolve, reject) => {
            // 根据IP获取当前城市
            const myCity = new window.BMapGL.LocalCity();
            myCity.get(async res => {
                try {
                    const result = await axios.get('http://localhost:8080/area/info', {
                        params: {
                            name: res.name
                        }
                    })
                    localStorage.setItem('hkzf_city', JSON.stringify(result.data.body))
                    resolve(result.data.body)
                } catch (error) {
                    // 获取城市定位失败
                    reject(error)
                }
            })
        })
    }
    // 如果成功返回成功的Promise
    return Promise.resolve(loaclCity)
}