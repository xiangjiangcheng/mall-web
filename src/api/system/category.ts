import request from "@/utils/request";

const CATEGORY_BASE_URL = "/api/v1/categorys";

const CategoryAPI = {
    /** 获取分类分页数据 */
    getPage(queryParams?: CategoryPageQuery) {
        return request<any, PageResult<CategoryPageVO[]>>({
            url: `${CATEGORY_BASE_URL}/page`,
            method: "get",
            params: queryParams,
        });
    },
     /** 获取分类下拉数据 */
     getCategoryOptions() {
        return request<any, OptionType[]>({
            url: `${CATEGORY_BASE_URL}/page`,
            method: "get",
        });
    },
    /**
     * 获取分类表单数据
     *
     * @param id 分类ID
     * @returns 分类表单数据
     */
    getFormData(id: number) {
        return request<any, CategoryForm>({
            url: `${CATEGORY_BASE_URL}/${id}/form`,
            method: "get",
        });
    },

    /** 添加分类*/
    add(data: CategoryForm) {
        return request({
            url: `${CATEGORY_BASE_URL}`,
            method: "post",
            data: data,
        });
    },

    /**
     * 更新分类
     *
     * @param id 分类ID
     * @param data 分类表单数据
     */
     update(id: number, data: CategoryForm) {
        return request({
            url: `${CATEGORY_BASE_URL}/${id}`,
            method: "put",
            data: data,
        });
    },

    /**
     * 批量删除分类，多个以英文逗号(,)分割
     *
     * @param ids 分类ID字符串，多个以英文逗号(,)分割
     */
     deleteByIds(ids: string) {
        return request({
            url: `${CATEGORY_BASE_URL}/${ids}`,
            method: "delete",
        });
    }
}

export default CategoryAPI;

/** 分类分页查询参数 */
export interface CategoryPageQuery extends PageQuery {
}

/** 分类表单对象 */
export interface CategoryForm {
    id?:  number;
    shopId?:  number;
    name?:  string;
    sort?:  number;
    /** 1-显示 0-隐藏 */
    status?:  number;
}

/** 分类分页对象 */
export interface CategoryPageVO {
    id?: number;
    shopId?: number;
    name?: string;
    sort?: number;
    /** 1-显示 0-隐藏 */
    status?: number;
    /** 创建时间 */
    createTime?: Date;
}
