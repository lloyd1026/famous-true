<template>
    <div>
        <div style="display: flex;">
            <el-form style="margin: 10px; display: flex;">
                <el-form-item>
                    <el-input placeholder="古树名" v-model.trim="treeName"
                        style="width: 200px; margin-right: 10px;"></el-input>
                </el-form-item>
                <el-cascader placeholder="生物学分类" :options="classifyInfo" :props="{ checkStrictly: true }"
                    v-model="selectedClassifyOptions" style="width: 200px; margin-right: 10px;" clearable></el-cascader>
                <el-select v-model="place" clearable placeholder="地区">
                    <el-option v-for="item in placeList" :key="item" :label="item" :value="item">
                    </el-option>
                </el-select>
            </el-form>
        </div>

        <div>
            <el-table ref="multipleTable" :data="groupedTreeInfo" tooltip-effect="dark" max-height="400"
                style="width: 100%;" @selection-change="handleSelectionChange">
                <el-table-column label="古树名" width="120" show-overflow-tooltip>
                    <template slot-scope="scope">{{ scope.row.name }}</template>
                </el-table-column>
                <el-table-column label="科属种" width="150">
                    <template slot-scope="scope">
                        <div v-if="scope.row.family.length == 1">
                            {{ scope.row.family[0] }}-{{ scope.row.genus[0] }}-{{ scope.row.species[0] }}
                        </div>
                        <div v-if="scope.row.family.length == 2">
                            <p>{{ scope.row.family[0] }}-{{ scope.row.genus[0] }}-{{ scope.row.species[0] }}</p>
                            <p>{{ scope.row.family[1] }}-{{ scope.row.genus[1] }}-{{ scope.row.species[1] }}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="学名" width="100" show-overflow-tooltip>
                    <template slot-scope="scope">{{ scope.row.scientificName }}</template>
                </el-table-column>
                <el-table-column label="树高" width="70">
                    <template slot-scope="scope">{{ scope.row.height }}</template>
                </el-table-column>
                <el-table-column label="胸径" width="70">
                    <template slot-scope="scope">{{ scope.row.diameter }}</template>
                </el-table-column>
                <el-table-column label="位置" width="100" show-overflow-tooltip>
                    <template slot-scope="scope">{{ scope.row.place }}-{{ scope.row.detailedLocation }}</template>
                </el-table-column>
                <el-table-column label="图片" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div style="display: flex; align-items: center;">
                            <el-image v-if="scope.row.treeSmallImg.length != 0"
                                style="width: 100px; height: 100px; flex-shrink: 0;" :src="scope.row.treeSmallImg[0]"
                                fit="fill" lazy>
                            </el-image>
                            <el-image v-else style="width: 100px; height: 100px; flex-shrink: 0;"
                                :src="scope.row.treeBigImg[0]" fit="fill" lazy>
                            </el-image>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="历史传说/文化故事" width="200" show-overflow-tooltip>
                    <template slot-scope="scope">{{ scope.row.description }}</template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button @click="handleEdit(scope.row)" type="text" size="small">查看详细信息</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block" style="margin-top: 10px;">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="pageNum" :page-sizes="[5, 8, 10]" :page-size="pageSize" :total="total"
                    layout="total, sizes, prev, pager, next, jumper">
                </el-pagination>
            </div>
        </div>

        <el-drawer :title="curTree.name" :before-close="handleClose" :visible.sync="dialog" custom-class="demo-drawer"
            :size="700" ref="drawer">
            <div class="demo-drawer__content">
                <el-form :model="curTree">
                    <el-form-item label="古树名" :label-width="formLabelWidth">
                        <el-input v-model="curTree.name" autocomplete="off" style="width: 250px;" :disabled="disabled"></el-input>
                    </el-form-item>

                    <el-form-item label="学名" :label-width="formLabelWidth">
                        <el-input v-model="curTree.scientificName" autocomplete="off" style="width: 250px;" :disabled="disabled"></el-input>
                    </el-form-item>
                    <el-form-item label="树高" :label-width="formLabelWidth">
                        <el-input v-model="curTree.height" autocomplete="off" style="width: 250px;" :disabled="disabled"></el-input>
                    </el-form-item>
                    <el-form-item label="胸径" :label-width="formLabelWidth">
                        <el-input v-model="curTree.diameter" autocomplete="off" style="width: 250px;" :disabled="disabled"></el-input>
                    </el-form-item>
                    <el-form-item label="地区" :label-width="formLabelWidth">
                        <el-input v-model="curTree.place" autocomplete="off" style="width: 250px;" :disabled="disabled"></el-input>
                    </el-form-item>
                    <el-form-item label="位置" :label-width="formLabelWidth">
                        <el-input v-model="curTree.detailedLocation" autocomplete="off" :disabled="disabled"
                            style="width: 250px;"></el-input>
                    </el-form-item>

                    <el-form-item label="生物学分类" :label-width="formLabelWidth">
                        <el-cascader placeholder="生物学分类" :options="classifyInfo" v-model="curTreeClassifyInfo[0]"
                            style="width: 250px; margin-right: 10px;" clearable :disabled="disabled"></el-cascader>
                        <el-cascader v-if="curTreeClassifyInfo.length > 1" placeholder="生物学分类" :options="classifyInfo"
                            v-model="curTreeClassifyInfo[1]" style="width: 200px; margin-right: 10px;"
                            clearable></el-cascader>
                    </el-form-item>

                    <el-form-item label="历史传说/文化故事" :label-width="formLabelWidth" >
                        <el-input type="textarea" :autosize="{ minRows: 2 }" placeholder="请输入内容" :disabled="disabled"
                            v-model="curTree.description">
                        </el-input>
                    </el-form-item>
                    
                    <el-form-item label="古树生长位置图片" :label-width="formLabelWidth">
                        <el-button type="text" @click="dialogFormVisible = true">更新图片</el-button>
                    </el-form-item>

                    <el-form-item label="古树图片" :label-width="formLabelWidth">
                        <el-button type="text" @click="dialogTreeImgVisible = true">更新图片</el-button>
                    </el-form-item>
                    <!-- <el-form-item label="古树图片" :label-width="formLabelWidth">
                        <el-button type="text" @click="dialogTreeImgVisible = true">查看图片</el-button>
                    </el-form-item>  -->
                </el-form>
                <div class="demo-drawer__footer" style="text-align: center;">
                    <el-button @click="cancelForm">取 消</el-button>
                    <el-button type="primary" @click="$refs.drawer.closeDrawer()" :loading="loading">
                        {{ loading ? '提交中...' : '保 存' }}
                    </el-button>
                </div>
            </div>
        </el-drawer>

        <el-dialog title="古树图片" :visible.sync="dialogTreeImgVisible" append-to-body>
            <el-upload action="http://localhost:5000/saveImg" list-type="picture-card" :auto-upload="false"
                :on-change="handleChangeImg" :file-list="curTree.placeImg">
                <i slot="default" class="el-icon-plus"></i>
                <div slot="file" slot-scope="{file}">
                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                    <span class="el-upload-list__item-actions">
                        <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                            <i class="el-icon-zoom-in"></i>
                        </span>

                        <!-- <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
                            <i class="el-icon-download"></i>
                        </span> -->

                        <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                            <i class="el-icon-delete"></i>
                        </span>
                    </span>
                </div>
            </el-upload>
            <!-- 图片预览框 -->
            <el-dialog :visible.sync="dialogPreviewVisible" append-to-body>
                <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveImg">确 定</el-button>
            </div>
        </el-dialog>


    </div>
</template>


<script>

export default {
    name: 'TreeSearch',
    components: {},
    data() {
        return {
            disabled:true,
            treeName: '',
            treeInfo: [],
            groupedTreeInfo: [],
            total: 5,
            pageNum: 1,//当前页
            pageSize: 8,//页面大小
            selectedRows: [],
            classifyInfo: [],
            selectedClassifyOptions: [],
            placeList: ["北京市", "天津市", "河北省"],
            place: '',
            dialog: false,
            formLabelWidth: '150px',
            curTree: {},
            curTreeClassifyInfo: [],
            curtreeImg: [],
            loading: false,

            dialogTreeImgVisible: false,
            dialogPreviewVisible: false,
            dialogImageUrl: '',
            previewImageUrl:'',

            dialogPlaceVisible:false, //生长地区
            

        }
    },
    watch: {
        selectedClassifyOptions: {
            immediate: true,
            handler(newValue, oldValue) {
                console.log(newValue, oldValue)
            }
        },
        curTree: {
            // immediate: true,
            handler(newValue, oldValue) {
                console.log(newValue, oldValue)
                if (this.curTree != null && Object.keys(newValue).length != 0 && this.curTree != {} ) {
                    var res = [];
                    var len = 0;
                    if (Array.isArray(this.curTree.fid)) {
                        len = this.curTree.fid.length
                    }
                    if (len == 0) {
                        this.curTreeClassifyInfo = [];
                    } else {
                        for (var i = 0; i < len; i++) {
                            res.push([this.curTree.fid[i], this.curTree.gid[i], this.curTree.sid[i]]);
                        }
                        this.curTreeClassifyInfo = res;
                    }
                } else {
                    this.curTreeClassifyInfo = [];
                }
                // this.curtreeImg = [...this.curTree.treeBigImg,...this.curTree.treeSmallImg]
                this.curtreeImg = this.curTree.treeBigImg.concat(this.curTree.treeSmallImg)
                console.log(this.curtreeImg)
            }
            
        }
    },
    computed: {

    },
    methods: {
        getClassifyInfo() {
            this.$axios.get(this.$httpUrl + '/getClassifyInfo').then(res => res.data).then(res => {
                this.classifyInfo = res.data
                // console.log(res.data)
            })
        },
        getAllTree() {  
            this.$axios.get(this.$httpUrl + '/getAllTree').then(res => res.data).then(res => {
                // console.log(res)
                this.treeInfo = res.data
                // console.log("treeInfo", this.treeInfo)
                this.total = this.treeInfo.length
                this.groupedTreeInfo = this.treeInfo.slice((this.pageNum - 1) * this.pageSize, this.pageNum * this.pageSize - 1)
            })
        },
        getTreeByName() {
            this.$axios.post(this.$httpUrl + '/getTreeByName', { name: this.name }).then(res => res.data).then(res => {
                console.log(res)
            })
        },
        load() {
            this.groupedTreeInfo = this.treeInfo.slice((this.pageNum - 1) * this.pageSize, this.pageNum * this.pageSize - 1)
        },
        //每页数量发生变化
        handleSizeChange(pageSize) {
            // console.log("pageSize=", pageSize)
            this.pageSize = pageSize;
            this.pageNum = 1
            this.load()
        },
        //当前页发生变化
        handleCurrentChange(pageNum) {
            this.pageNum = pageNum
            this.load()
        },
        //编辑古树信息
        handleEdit(row) {
            // console.log(row)
            this.dialog = true;
            this.curTree = row;
            console.log("this.curTree", this.curTree)
            // this.curRow = row;
            // this.radio = row.publishStatus;
        },
        //
        cancelForm(done) {
            this.$confirm('确认取消修改？')
                .then(() => {
                    done();
                })
                .catch(() => { })
                .then(() => {
                    this.dialog = false
                })

        },
        //关闭修改对话框
        handleClose(done) {
            done();
        },
        //更新古树图片
        updateImg() {

        },
        handleChangeImg() {

        },
        saveImg() {

        },
        handlePictureCardPreview(file) {
            this.previewImageUrl = file;
            this.dialogPreviewVisible = true;
        },
        handleRemove(file) {
            this.curtreeImg = this.curtreeImg.filter(item => item != file)
        },
    },
    created() {
        this.getAllTree()
        this.getClassifyInfo()
    }
}
</script>

<style></style>