import $axios from './index'

/**
 * addDatabase 添加新的数据库实例
 * @param {*} params 数据库实例信息
 * @returns 
 */
export function addDatabase(params) {
    const url = '/getPageData1'
    return $axios.get(url, params)
}

/**
 * 获取全部数据库实例的列表
 * @returns 
 */
export function getAllDatabaseList() {
    const url = '/database/list'
    return $axios.get(url)
}

/**
 * 创建数据库实例
 * @param {*} data 
 * @returns 
 */
export function createDatabaseInstance(data) {
    const url = "/database/create"
    data.port = Number(data.port)
    return $axios.post(url, data)
}
