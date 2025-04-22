<template>
    <div>
        <div style="display: flex;">
            <el-form style="margin: 10px; display: flex;">
                <el-button type="primary" style="margin-right: 10px; height: 40px;" @click="addPlace">
                    添加地区
                    <i class="el-icon-circle-plus-outline el-icon--right"></i>
                </el-button>
                <el-button type="danger" style="margin-right: 10px; height: 40px;" @click="batchDelete">
                    批量删除
                    <i class="el-icon-delete el-icon--right"></i>
                </el-button>
            </el-form>
        </div>
        <el-checkbox-group v-model="checkList">
            <el-checkbox v-for="(item, index) in placeList" :label="item.id" :key="index">{{ item.name }}</el-checkbox>
        </el-checkbox-group>
    </div>
</template>


<script>
export default {
    name: 'PlaceInfo',
    components: {},
    data() {
        return {
            address: [],
            placeList: [],
            checkList: [],
        }
    },
    methods: {
        getPlaceInfo() {
            this.$axios.get(this.$httpUrl + '/getPlaceInfo').then(res => res.data).then(res => {
                // console.log(res)
                this.placeList = res.data
                // this.renameValueToId(this.data)
                console.log(this.placeList)
            })
        },

        addPlace() {
            var _this = this;
            // 弹出框让用户输入
            this.$prompt('请输入地区名称', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /\S+/,
                inputErrorMessage: '名称不能为空'
            }).then(({ value }) => {
                // 检查地区是否已经在当前列表中存在
                for (var i = 0; i < _this.placeList.length; i++) {
                    if (_this.placeList[i].name == value) {
                        this.$message.error(value+" 已在系统内");
                        return
                    }
                }
                // 向后端发送 POST 请求，新增地区
                this.$axios.post(this.$httpUrl + '/addPlace', { name: value })
                    .then(response => {
                        const newPlace = response.data.data.name;
                        this.placeList.push(newPlace);
                        this.$message.success('地区添加成功');
                    })
                    .catch(error => {
                        this.$message.error(error.response.data.message || '添加地区失败');
                    });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            });
        },

        batchDelete() {
            if (this.checkList.length === 0) {
                this.$message.error("请选择要删除的地区");
                return;
            }
            // 向后端发送请求，删除选择的地区
            this.$axios.post(this.$httpUrl + '/batchDeletePlace', { ids: this.checkList })
                .then(() => {
                    this.$message.success("地区删除成功");

                    // 删除成功后，更新本地的 placeList
                    this.placeList = this.placeList.filter(place => !this.checkList.includes(place.id));
                    this.checkList = [];  // 清空已选中的删除项
                })
                .catch(error => {
                    this.$message.error(error.response.data.message || '删除地区失败');
                });
        }
    },
    created() {
        this.getPlaceInfo()
    }
}
</script>

<style></style>