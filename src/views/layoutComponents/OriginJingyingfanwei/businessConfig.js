import {listScopes} from "@/api/ANew/index";
export async function getClassifyScopes() {
    let result = await listScopes();
    try{
        if(result.code == 200) {
            return result.data;
        } else {
            throw '经营范围scopes获取失败'
        }
    } catch(e) {
        console.warn(e)
    }
}

export default { getClassifyScopes }