<template>
    <div style="height: 90vh; width:1200px; opacity: 0.9;">
        <div style="height: 90vh; overflow:auto;  scrollbar-width:thin; margin-bottom: 10px;">
            <el-tree :data="data" show-checkbox node-key="value" default-expand-all :expand-on-click-node="false">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ node.label }}</span>
                    <span>
                        <el-button type="text" size="mini" @click="append(node)" :disabled="isProhibit(node)">
                            Append
                        </el-button>
                        <el-button type="text" size="mini" @click="() => remove(node, data)">
                            Delete
                        </el-button>
                    </span>
                </span>
            </el-tree>
        </div>
        <el-dialog title="添加分类" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="节点名" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="活动区域" :label-width="formLabelWidth">
                    <el-select v-model="form.region" placeholder="请选择活动区域">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>


    </div>
</template>


<script>
export default {
    name: 'ClassifyInfo',
    components: {},
    data() {
        return {
            data: [],
            dialogFormVisible: false,
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },
            formLabelWidth: '120px'

        }
    },
    methods: {
        renameValueToId(obj) {
            // 如果传入的参数是一个数组，则遍历数组中的每个元素
            if (Array.isArray(obj)) {
                obj.forEach(item => {
                    this.renameValueToId(item); // 递归调用自身处理数组元素
                });
            } else if (typeof obj === 'object') {
                // 如果传入的参数是一个对象，则遍历对象的每个属性
                for (let key in obj) {
                    if (key === 'value') {
                        obj.id = obj[key]; // 将 value 属性重命名为 id 属性
                        delete obj[key]; // 删除原来的 value 属性
                    } else {
                        this.renameValueToId(obj[key]); // 递归调用自身处理对象的其他属性值
                    }
                }
            }
        },
        
        
        getClassifyInfo() {
            this.$axios.get(this.$httpUrl + '/getClassifyInfo').then(res => res.data).then(res => {
                this.data = res.data
                // this.renameValueToId(this.data)
                console.log(this.data)
            })
        },

        append(node) {
            this.$prompt('请输入名称', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /\S+/,
                inputErrorMessage: '名称不正确'
            }).then(({ value }) => {
                this.$message({
                    type: 'success',
                    message: '分类添加成功'
                });
                var name = value
                var newChild = { value: -256, label: name, children: [] };
                // 调用后端 API 添加分类
                this.$axios.post(this.$httpUrl + '/addCategory', {
                    name: value,
                    parentId: node.data.value,  
                })
                .then(res => {
                    if (res.data.success) {
                        // 后端添加成功后，更新前端树形结构
                        node.data.children.push(newChild);  // 将新分类添加到当前父节点的 children 数组中
                        this.$message.success('分类添加成功');
                    } else {
                        this.$message.error('添加失败');
                    }
                })
                .catch(error => {
                    this.$message.error('网络错误');
                    console.error(error);
                });
                // node.data.children.push(newChild);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            });


        },
        remove(node) {
            const id = node.data.value;
            const label = node.label;
            let type = '';

            if (label.endsWith('科')) type = 'Family';
            else if (label.endsWith('属')) type = 'Genus';
            else type = 'Species';

            this.$confirm('确定删除该分类吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.post(this.$httpUrl + '/deleteCategory', {
                    id: id,
                    type: type
                }).then(res => {
                    if (res.data.success) {
                        // 从 data 中移除节点
                        const parent = node.parent;
                        const children = parent.data.children || parent.childNodes;
                        const index = children.findIndex(child => child.value === id);
                        if (index > -1) {
                            children.splice(index, 1);
                        }
                        this.$message.success('删除成功');
                    } else {
                        this.$message.error(res.data.msg || '删除失败');
                    }
                }).catch(err => {
                    this.$message.error('网络错误');
                    console.error(err);
                });
            }).catch(() => {
                this.$message.info('已取消删除');
            });
        },
        isProhibit(node) {
            const regex = /[\u4e00-\u9fa5]$/; // 匹配字符串中的最后一个汉字
            const lastChineseChar = node.label.match(regex)[0]; // 获取匹配到的汉字
            // console.log(lastChineseChar); // 输出字符串中的最后一个汉字

            if (lastChineseChar !== "科" && lastChineseChar !== "属") {
                return true
            }
            return false
        },

    },
    created() {
        this.getClassifyInfo()
    },
}
</script>


<style scoped>
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}
</style>