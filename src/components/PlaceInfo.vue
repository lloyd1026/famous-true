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
            this.$prompt('请输入地区名称', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /\S+/,
                inputErrorMessage: '名称不能为空'
            }).then(({ value }) => {
                for (var i = 0; i < _this.placeList.length; i++) {
                    if (_this.placeList[i].name == value) {
                        this.$message.error(value+" 已在系统内");
                        return
                    }
                }
                this.placeList.push({ id: -256, name: value, });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            });
        },
        batchDelete() {
            this.$message.error("该地区存在古树，不可删除")
            return ;
            // console.log(this.checkList)
            // this.placeList = this.placeList.filter(obj => !this.checkList.includes(obj.id));
        }
    },
    created() {
        this.getPlaceInfo()
    }
}
</script>

<style></style>