/**
 * Created by jiachenpan on 16/11/18.
 */

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    if (time && typeof time === 'string' && !time.includes('Z')) time = time.replace(new RegExp(/-/gm), '/')
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  // time = +time * 1000
  if (time && !time.includes('Z')) time = time.replace(new RegExp(/-/gm), '/')
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

export function printUrl(name, ticketno) {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    return 'http://nb.csjscm.com:9999/WebReport/ReportServer?reportlet=/HALL_TEST/' + name + '.cpt&ticketno=' + ticketno
  } else if (process.env.NODE_ENV === 'production') {
    return 'http://nb.csjscm.com:9999/WebReport/ReportServer?reportlet=/HALL/' + name + '.cpt&ticketno=' + ticketno
  }
}

export function reportCenterUrl(name) {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    return 'http://nb.csjscm.com:9999/WebReport/ReportServer?reportlet=/HALL_TEST/' + name + '.cpt'
  } else if (process.env.NODE_ENV === 'production') {
    return 'http://nb.csjscm.com:9999/WebReport/ReportServer?reportlet=/HALL/' + name + '.cpt'
  }
}

// export const LoginPath = process.env.NODE_ENV === 'development' ? 'http://192.168.1.224:8080' : 'http://sso.csjscm.com'
export const LoginPath = 'http://sso.csjscm.com'

export const Fundnature = [
  {
    name: '货款',
    value: 1
  },
  {
    name: '服务费',
    value: 2
  },
  {
    name: '投标保证金',
    value: 3
  }
]
export const SettlementMethod = [
  {
    name: '现金',
    value: 1
  },
  {
    name: '银行转账',
    value: 2
  },
  {
    name: '银行承兑',
    value: 3
  },
  {
    name: '商业承兑',
    value: 4
  },
  {
    name: '支票',
    value: 5
  }
]

// 发票类型1增值税专用发票 2增值税普通发票 3普通发票 4无票收入

export const InvoiceType = [
  {
    name: '增值税专用发票',
    value: '1'
  },
  {
    name: '增值税普通发票',
    value: '2'
  },
  {
    name: '普通发票',
    value: '3'
  },
  {
    name: '无票收入',
    value: '4'
  }
]

export const Status = [
  {
    name: '草稿', value: '-1'
  },
  {
    name: '待审核', value: '0'
  },
  {
    name: '确认通过', value: '1'
  },
  {
    name: '驳回', value: '-2'
  }
]

export function downloadFile(file) {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    return 'http://testscm.csjmro.com/file' + file
  } else if (process.env.NODE_ENV === 'production') {
    return 'http://scm.csjmro.com/file' + file
  }
}
