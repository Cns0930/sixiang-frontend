import {listHighlighterScopes} from "@/api/ANew/index";
let result = [];
export async function getListHighlighterScopes() {
    let res = await listHighlighterScopes({});
    if(res.code == 200){
        result = res.data;
    }
    return result
 }
export default {getListHighlighterScopes};
// ["饲料添加剂、添加剂预混合饲料生产",
// "人工繁育国家重点保护水生野生动物",
// "国家重点保护陆生野生动物驯养繁殖",
// "出售、收购国家二级保护野生植物",
// "转基因农作物种子生产",
// "生猪定点屠宰",
// "种畜禽生产",
// "种畜禽经营",
// "畜禽养殖",
// "畜禽屠宰",
// "动物无害化处理",
// "动物隔离",
// "动物诊疗",
// "煤炭开采",
// "废弃电器电子产品处理",
// "兽药生产",
// "农业机械维修",
// "机动车维修",
// "包装装潢印刷",
// "其他印刷品印刷",
// "打印复印",
// "化妆品生产",
// "食品生产",
// "假肢和矫形器（辅助器具）生产装配",
// "民用核安全设备设计、制造、安装",
// "质检技术服务（无损）",
// "消毒产品生产（除一次性使用医疗用品）",
// "特种设备生产",
// "第一类非药品类易制毒化学品生产、经营",
// "农药生产",
// "食盐生产",
// "碘盐加工",
// "公章刻制",
// "制造计量器具",
// "修理计量器具",
// "药品生产",
// "出版物印刷",
// "民用航空器、发动机、螺旋桨的生产及销售",
// "饮用水供水",
// "燃气经营",
// "供电",
// "兽药经营",
// "成品油经营",
// "烟花爆竹批发",
// "烟花爆竹零售",
// "食品销售",
// "餐饮服务",
// "粮食收购",
// "各类商品拍卖（不包括国家法律法规另有规定的商品）",
// "药品批发",
// "药品零售",
// "国际船舶运输",
// "国际海运辅助业务",
// "港澳台船舶运输",
// "船员服务",
// "国内水路运输",
// "国内船舶管理业务",
// "港口经营",
// "港口理货",
// "国际道路运输",
// "道路运输站（场）经营",
// "机动车驾驶员培训",
// "拖拉机驾驶培训",
// "邮政通信",
// "船舶引航服务",
// "船舶检验",
// "出租汽车经营",
// "道路旅客运输",
// "道路货物运输",
// "公共航空运输业务",
// "民用航空器等维修",
// "旅馆",
// "经营性互联网文化信息服务",
// "互联网上网服务",
// "药品、医疗器械互联网信息服务",
// "电信业务",
// "装帧流通人民币",
// "外汇业务",
// "证券投资咨询",
// "商品期货经纪",
// "公募基金管理",
// "证券融资业务",
// "证券鉴证",
// "证券期货相关评估业务",
// "保险资产管理",
// "保险公估",
// "保险专业代理",
// "保险经纪",
// "典当",
// "旅行社业务",
// "资产评估",
// "审计验资等注册会计师法定业务",
// "代理记账",
// "人才中介",
// "专利代理",
// "因私出入境中介活动",
// "电子认证服务",
// "职业中介",
// "进出口商品检验鉴定",
// "认证服务",
// "质检技术服务",
// "测绘服务",
// "危险废物收集、贮存、处置经营活动",
// "拆船",
// "城市生活垃圾服务",
// "从事承装、承修、承试电力设施活动",
// "养老服务业务",
// "保安培训",
// "职业技能培训",
// "营利性医疗机构",
// "演出经纪",
// "演出场所",
// "娱乐场所（歌舞娱乐场所、游艺娱乐场所）",
// "电影制片",
// "电影发行",
// "电影放映",
// "文艺创作与表演",
// "出版物经营",
// "音像制品制作",
// "音像制品复制",
// "电子出版物制作",
// "电子出版物复制",
// "广播电视节目制作",
// "文物拍卖",
// "文物经营",
// "健身气功",
// "高危险性体育项目",]