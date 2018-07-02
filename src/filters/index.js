export function statusFilter(val) {
  switch (parseInt(val)) {
    case -1: return '草稿'
    case 0: return '待审核'
    case 1: return '确认通过'
    case -2: return '驳回'
    case 2: return '作废'
    default: return ''
  }
}
export function invoicetypeFilter(val) {
  switch (parseInt(val)) {
    case 1: return '增值税专用发票'
    case 2: return '增值税普通发票'
    case 3: return '普通发票'
    case 4: return '无票收入'
    default: return ''
  }
}
export function fundnatureFilter(val) {
  switch (parseInt(val)) {
    case 1: return '货款'
    case 2: return '服务费'
    case 3: return '投标保证金'
    default: return ''
  }
}
export function settlementmethodFilter(val) {
  switch (parseInt(val)) {
    case 1: return '现金'
    case 2: return '银行转账'
    case 3: return '银行承兑'
    case 4: return '商业承兑'
    case 5: return '支票'
    default: return ''
  }
}
