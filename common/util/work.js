/**
 * 常用服务
 * useful server
 */
const  icon_prefix="/static/home/128/"

export const us = {
  data:[
    {
      title:"日报",
      icon:icon_prefix+"richang.png",
      description:"记录每天的工作经验和心得",
      useCount:1000,
	  page:'helloWorld'
    },{
      title:"周报",
      icon:icon_prefix+"zhoubao.png",
      description:"总结每周的工作情况和下周计划",
      useCount:10000,
	  page:'helloWorld'
    },{
      title:"考勤",
      icon:icon_prefix+"kaoqin.png",
      description:"工作考勤",
      useCount:10000,
	  page:'helloWorld'
    },{
      title:"日程",
      icon:icon_prefix+"richeng.png",
      description:"建立和查看个人工作安排",
      useCount:10000,
	  page:'helloWorld'
    },{
      title:"请假申请",
      icon:icon_prefix+"wendang.png",
      description:"请假申请",
      useCount:10000,
	  page:'helloWorld'
    },{
	  title:"出差申请",
	  icon:icon_prefix+"chuchai.png",
	  description:"出差申请",
	  useCount:10000,
	  page:'helloWorld'
    },{
	  title:"公文发文",
	  icon:icon_prefix+"gongwen.png",
	  description:"公文发文",
	  useCount:10000,
	  page:'helloWorld'
    },{
	  title:"通知公告",
	  icon:icon_prefix+"tongzhi.png",
	  description:"查看企业对员工下发的通知公告",
	  useCount:10000,
	  page:'annotationList'
    },{
	  title:"内部邮件",
	  icon:icon_prefix+"youjian.png",
	  description:"查看内部消息",
	  useCount:10000,
	  dot:false,
	  page:'helloWorld'
    },{
	  title:"通讯录",
	  icon:icon_prefix+"tongxun.png",
	  description:"查看部门，组员",
	  useCount:10000,
	  page:'levelAddressBook'
    }
  ]
}


/**
 * other server 其他服务
 */
export const os = {
  data:[
    {
      title:"新闻中心",
      icon:icon_prefix+"xinwen.png",
      description:"新闻中心",
      useCount:10000,
	  page:'helloWorld'
    },{
      title:"投票中心",
      icon:icon_prefix+"toupiao.png",
      description:"投票中心",
      useCount:10000,
	  page:'helloWorld'
    },{
      title:"任务中心",
      icon:icon_prefix+"renwu.png",
      description:"任务中心",
      useCount:10000,
	  page:'helloWorld'
    },{
      title:"文档中心",
      icon:icon_prefix+"wendang.png",
      description:"文档中心",
      useCount:10000,
	  page:'helloWorld'
    },{
      title:"合同",
      icon:icon_prefix+"hetong.png",
      description:"合同",
      useCount:10000,
	  page:'helloWorld'
    },{
      title:"会议",
      icon:icon_prefix+"huiyi.png",
      description:"会议",
      useCount:10000,
	  page:'helloWorld'
    },{
      title:"客户关系",
      icon:icon_prefix+"tongzhi.png",
      description:"客户关系",
      useCount:10000,
	  page:'helloWorld'
    }
  ]
}

/**
 * 开单
 */
export const openorder = {
	
 data:[
     {
       title:"零售出库",
       icon:icon_prefix+"renwu.png",
       description:"零售出库",
       useCount:1000,
 	  page:'retailOut'
     },{
       title:"零售退货",
       icon:icon_prefix+"renwu.png",
       description:"零售退货",
       useCount:10000,
 	  page:'retailBackOut'
     },{
       title:"采购订单",
       icon:icon_prefix+"renwu.png",
       description:"采购订单",
       useCount:10000,
 	  page:'purchaseOrder'
     },{
       title:"采购入库",
       icon:icon_prefix+"renwu.png",
       description:"采购入库",
       useCount:10000,
 	  page:'purchaseIn'
     },{
       title:"采购退货",
       icon:icon_prefix+"renwu.png",
       description:"采购退货",
       useCount:10000,
 	  page:'purchaseInBack'
     },{
 	  title:"销售订单",
 	  icon:icon_prefix+"renwu.png",
 	  description:"销售订单",
 	  useCount:10000,
 	  page:'saleOrder'
     },{
 	  title:"销售出库",
 	  icon:icon_prefix+"renwu.png",
 	  description:"销售出库",
 	  useCount:10000,
 	  page:'saleOut'
     },{
 	  title:"销售退货",
 	  icon:icon_prefix+"renwu.png",
 	  description:"销售退货",
 	  useCount:10000,
 	  page:'saleBack'
     },{
 	  title:"其它入库",
 	  icon:icon_prefix+"renwu.png",
 	  description:"其它入库",
 	  useCount:10000,
 	  page:'otherIn'
     },{
 	  title:"其它出库",
 	  icon:icon_prefix+"renwu.png",
 	  description:"其它出库",
 	  useCount:10000,
 	  page:'otherOut'
     },{
 	  title:"调拨出库",
 	  icon:icon_prefix+"renwu.png",
 	  description:"调拨出库",
 	  useCount:10000,
 	  page:'allocationOut'
     },
 	// {
 	//   title:"组装单",
 	//   icon:icon_prefix+"renwu.png",
 	//   description:"组装单",
 	//   useCount:10000,
 	//   page:'levelAddressBook'
  //    },{
 	//   title:"拆卸单",
 	//   icon:icon_prefix+"renwu.png",
 	//   description:"拆卸单",
 	//   useCount:10000,
 	//   page:'levelAddressBook'
  //    },
 	{
 	  title:"收入单",
 	  icon:icon_prefix+"renwu.png",
 	  description:"收入单",
 	  useCount:10000,
 	  page:'itemIn'
     },{
 	  title:"支出单",
 	  icon:icon_prefix+"renwu.png",
 	  description:"支出单",
 	  useCount:10000,
 	  page:'itemOut'
     },{
 	  title:"收款单",
 	  icon:icon_prefix+"renwu.png",
 	  description:"收款单",
 	  useCount:10000,
 	  page:'moneyIn'
     },{
 	  title:"付款单",
 	  icon:icon_prefix+"renwu.png",
 	  description:"付款单",
 	  useCount:10000,
 	  page:'moneyOut'
     },{
 	  title:"转账单",
 	  icon:icon_prefix+"renwu.png",
 	  description:"转账单",
 	  useCount:10000,
 	  page:'giro'
     },{
 	  title:"收预付款",
 	  icon:icon_prefix+"renwu.png",
 	  description:"收预付款",
 	  useCount:10000,
 	  page:'advanceIn'
     }
   ]
}

/**
 * 基础资料
 */
export const material = {
  data:[
    {
      title:"商品管理",
      icon:icon_prefix+"wendang.png",
      description:"商品管理",
      useCount:1000,
	  page:'goods'
    },{
      title:"商品类别",
      icon:icon_prefix+"wendang.png",
      description:"商品类别",
      useCount:10000,
	  page:'categorys'
    },{
      title:"计量单位",
      icon:icon_prefix+"wendang.png",
      description:"计量单位",
      useCount:10000,
	  page:'unites'
    },{
      title:"多属性",
      icon:icon_prefix+"wendang.png",
      description:"多属性",
      useCount:10000,
	  page:'multiAttribute'
    },{
      title:"供应商管理",
      icon:icon_prefix+"wendang.png",
      description:"供应商管理",
      useCount:10000,
	  page:'vendors'
    },{
	  title:"客户管理",
	  icon:icon_prefix+"wendang.png",
	  description:"客户管理",
	  useCount:10000,
	  page:'customers'
    },{
	  title:"会员管理",
	  icon:icon_prefix+"wendang.png",
	  description:"会员管理",
	  useCount:10000,
	  page:'members'
    },{
	  title:"仓库管理",
	  icon:icon_prefix+"wendang.png",
	  description:"仓库管理",
	  useCount:10000,
	  page:'depot'
    },{
	  title:"收支项目",
	  icon:icon_prefix+"wendang.png",
	  description:"收支项目",
	  useCount:10000,
	  page:'inOutItemList'
    },{
	  title:"账户管理",
	  icon:icon_prefix+"wendang.png",
	  description:"账户管理",
	  useCount:10000,
	  page:'accounts'
    },{
	  title:"经手人管理",
	  icon:icon_prefix+"wendang.png",
	  description:"经手人管理",
	  useCount:10000,
	  page:'person'
    },{
	  title:"角色管理",
	  icon:icon_prefix+"wendang.png",
	  description:"角色管理",
	  useCount:10000,
	  page:'role'
    } 
  ]
}

/**
 * 报表
 */
export const report = {
  data:[
    {
      title:"商品库存",
      icon:icon_prefix+"wendang.png",
      description:"商品库存",
      useCount:1000,
	  page:'stock'
    },{
      title:"账户统计",
      icon:icon_prefix+"wendang.png",
      description:"账户统计",
      useCount:10000,
	  page:'account'
    },{
      title:"采购统计",
      icon:icon_prefix+"wendang.png",
      description:"采购统计",
      useCount:10000,
	  page:'buyin'
    },{
      title:"销售统计",
      icon:icon_prefix+"wendang.png",
      description:"销售统计",
      useCount:10000,
	  page:'saleout'
    },{
      title:"入库明细",
      icon:icon_prefix+"wendang.png",
      description:"入库明细",
      useCount:10000,
	  page:'indetail'
    },{
	  title:"出库明细",
	  icon:icon_prefix+"wendang.png",
	  description:"出库明细",
	  useCount:10000,
	  page:'outdetail'
    },{
	  title:"调拨明细",
	  icon:icon_prefix+"wendang.png",
	  description:"调拨明细",
	  useCount:10000,
	  page:'allocationdetail'
    },{
	  title:"入库汇总",
	  icon:icon_prefix+"wendang.png",
	  description:"入库汇总",
	  useCount:10000,
	  page:'inmaterialcount'
    },{
	  title:"出库汇总",
	  icon:icon_prefix+"wendang.png",
	  description:"出库汇总",
	  useCount:10000,
	  page:'outmaterialcount'
    },{
	  title:"进销存统计",
	  icon:icon_prefix+"wendang.png",
	  description:"进销存统计",
	  useCount:10000,
	  page:'inoutstockreport'
    },{
	  title:"客户对账",
	  icon:icon_prefix+"wendang.png",
	  description:"客户对账",
	  useCount:10000,
	  page:'customeraccount'
    },{
	  title:"供应商对账",
	  icon:icon_prefix+"wendang.png",
	  description:"供应商对账",
	  useCount:10000,
	  page:'vendoraccount'
    },{
	  title:"库存预警",
	  icon:icon_prefix+"wendang.png",
	  description:"库存预警",
	  useCount:10000,
	  page:'stockwarningreport'
    }
  ]
}

function kd(){
	let winBtnStrList=uni.getStorageSync("winBtnStrList");
	let data=[]
	let kdMap =  new Map()
	kdMap.set("/bill/retail_out	","retailOut");
	kdMap.set("/bill/retail_back","retailBackOut");
	kdMap.set("/bill/purchase_order","purchaseOrder");
	kdMap.set("/bill/purchase_in","purchaseIn");
	kdMap.set("/bill/purchase_back","purchaseInBack");
	kdMap.set("/bill/sale_order","saleOrder");
	kdMap.set("/bill/sale_out","saleOut");
	kdMap.set("/bill/sale_back","saleBack");
	
	kdMap.set("/bill/other_in","otherIn");
	kdMap.set("/bill/other_out","otherOut");
	kdMap.set("/bill/allocation_out","allocationOut");
	kdMap.set("/financial/item_in","itemIn");
	kdMap.set("/financial/item_out","itemOut");
	kdMap.set("	/financial/money_in","moneyIn");
	kdMap.set("/financial/money_out","moneyOut");
	
	kdMap.set("	/financial/giro","giro");
	kdMap.set("	/financial/advance_in","advanceIn");
	return data;
}