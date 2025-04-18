<template>
    <div style="height: 90vh; width: 1200px;">
        <div style="display: flex;">
            <el-form style="margin: 10px; display: flex;">
                <el-button type="success" style="margin-right: 10px; height: 40px;"
                    @click="addTreeDialogVisible = true">
                    添加古树
                    <i class="el-icon-circle-plus-outline el-icon--right"></i>
                </el-button>
                <el-button type="danger" style="margin-right: 10px; height: 40px;" @click="batchDelete">
                    批量删除
                    <i class="el-icon-delete el-icon--right"></i>
                </el-button>

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
            <el-table ref="multipleTable" :data="groupedTreeInfo" tooltip-effect="dark" max-height="450"
                style="width: 100%;" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="45">
                </el-table-column>
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
                            <el-image v-if="scope.row.treeImg.length != 0"
                                style="width: 100px; height: 100px; flex-shrink: 0;" :src="scope.row.treeImg[0]"
                                fit="fill" lazy>
                            </el-image>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="历史传说/文化故事" width="200" show-overflow-tooltip>
                    <template slot-scope="scope">{{ scope.row.description }}</template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
                        <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
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
                        <el-input v-model="curTree.name" autocomplete="off" style="width: 250px;"></el-input>
                    </el-form-item>

                    <el-form-item label="学名" :label-width="formLabelWidth">
                        <el-input v-model="curTree.scientificName" autocomplete="off" style="width: 250px;"></el-input>
                    </el-form-item>
                    <el-form-item label="树高" :label-width="formLabelWidth">
                        <el-input v-model="curTree.height" autocomplete="off" style="width: 250px;"></el-input>
                    </el-form-item>
                    <el-form-item label="胸径" :label-width="formLabelWidth">
                        <el-input v-model="curTree.diameter" autocomplete="off" style="width: 250px;"></el-input>
                    </el-form-item>
                    <el-form-item label="地区" :label-width="formLabelWidth">
                        <el-input v-model="curTree.place" autocomplete="off" style="width: 250px;"></el-input>
                    </el-form-item>
                    <el-form-item label="位置" :label-width="formLabelWidth">
                        <el-input v-model="curTree.detailedLocation" autocomplete="off"
                            style="width: 250px;"></el-input>
                    </el-form-item>

                    <el-form-item label="生物学分类" :label-width="formLabelWidth">
                        <el-cascader placeholder="生物学分类" :options="classifyInfo" v-model="curTreeClassifyInfo[0]"
                            style="width: 250px; margin-right: 10px;" clearable></el-cascader>
                        <el-cascader v-if="curTreeClassifyInfo.length > 1" placeholder="生物学分类" :options="classifyInfo"
                            v-model="curTreeClassifyInfo[1]" style="width: 250px; margin-right: 10px;"
                            clearable></el-cascader>
                    </el-form-item>

                    <el-form-item label="历史传说/文化故事" :label-width="formLabelWidth">
                        <el-input type="textarea" :autosize="{ minRows: 2 }" placeholder="请输入内容"
                            v-model="curTree.description">
                        </el-input>
                    </el-form-item>

                    <el-form-item label="古树生长位置图片" :label-width="formLabelWidth">
                        <el-button type="text" @click="dialogPlaceImgVisible = true">更新图片</el-button>
                    </el-form-item>

                    <el-form-item label="古树图片" :label-width="formLabelWidth">
                        <el-button type="text" @click="dialogTreeImgVisible = true">更新图片</el-button>
                    </el-form-item>
                </el-form>
                <div class="demo-drawer__footer" style="text-align: center;">
                    <el-button @click="cancelForm">取 消</el-button>
                    <el-button type="primary" @click="save()" :loading="loading">
                        {{ loading ? '提交中...' : '保 存' }}
                    </el-button>
                </div>
            </div>
        </el-drawer>



        <el-dialog title="古树图片" :visible.sync="dialogTreeImgVisible" append-to-body>
            <el-upload action="#" list-type="picture-card" :auto-upload="false" :on-change="handleChangeImg"
                :file-list="treeImg">
                <i slot="default" class="el-icon-plus"></i>
                <div slot="file" slot-scope="{file}">
                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                    <span class="el-upload-list__item-actions">
                        <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                            <i class="el-icon-zoom-in"></i>
                        </span>

                        <span class="el-upload-list__item-delete" @click="handleDownload(file)">
                            <i class="el-icon-download"></i>
                        </span>

                        <span class="el-upload-list__item-delete" @click="handleRemoveTreeImg(file)">
                            <i class="el-icon-delete"></i>
                        </span>
                    </span>
                </div>
            </el-upload>

            <!-- 图片预览框 -->
            <el-dialog :visible.sync="dialogPreviewVisible" append-to-body>
                <img width="100%" :src="previewImageUrl" alt="" />
            </el-dialog>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogTreeImgVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveTreeImg">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="古树生长位置图片" :visible.sync="dialogPlaceImgVisible" append-to-body>
            <el-upload action="#" list-type="picture-card" :auto-upload="false" :on-change="handleChangeImg"
                :file-list="placeImg">
                <i slot="default" class="el-icon-plus"></i>
                <div slot="file" slot-scope="{file}">
                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                    <span class="el-upload-list__item-actions">
                        <span class="el-upload-list__item-preview" @click="handlePlacePictureCardPreview(file)">
                            <i class="el-icon-zoom-in"></i>
                        </span>

                        <span class="el-upload-list__item-delete" @click="handleDownload(file)">
                            <i class="el-icon-download"></i>
                        </span>

                        <span class="el-upload-list__item-delete" @click="handleRemovePlaceImg(file)">
                            <i class="el-icon-delete"></i>
                        </span>

                    </span>
                </div>
            </el-upload>

            <!-- 图片预览框 -->
            <el-dialog :visible.sync="dialogPlaceVisible" append-to-body>
                <img width="100%" :src="placepreviewImageUrl" alt="" />
            </el-dialog>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogPlaceImgVisible = false">取 消</el-button>
                <el-button type="primary" @click="savePlaceImg">确 定</el-button>
            </div>
        </el-dialog>


        <el-dialog title="添加古树" :visible.sync="addTreeDialogVisible" append-to-body>
            <el-form :model="addTreeForm">
                <el-form-item label="古树名" :label-width="formLabelWidth">
                    <el-input v-model="addTreeForm.name" autocomplete="off" style="width: 250px;"></el-input>
                </el-form-item>

                <el-form-item label="学名" :label-width="formLabelWidth">
                    <el-input v-model="addTreeForm.scientificName" autocomplete="off" style="width: 250px;"></el-input>
                </el-form-item>
                <el-form-item label="树高" :label-width="formLabelWidth">
                    <el-input v-model="addTreeForm.height" autocomplete="off" style="width: 250px;"></el-input>
                </el-form-item>
                <el-form-item label="胸径" :label-width="formLabelWidth">
                    <el-input v-model="addTreeForm.diameter" autocomplete="off" style="width: 250px;"></el-input>
                </el-form-item>
                <el-form-item label="地区" :label-width="formLabelWidth">
                    <el-select v-model="addTreeForm.place" clearable placeholder="地区" style="width: 250px;">
                        <el-option v-for="item in placeList" :key="item" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="位置" :label-width="formLabelWidth">
                    <el-input v-model="addTreeForm.detailedLocation" autocomplete="off" style="width: 250px;"></el-input>
                </el-form-item>

                <el-form-item label="生物学分类" :label-width="formLabelWidth">
                    <el-cascader placeholder="生物学分类" :options="classifyInfo" v-model="addTreeForm.curTreeClassifyInfo"
                        style="width: 250px; margin-right: 10px;" clearable></el-cascader>
                </el-form-item>

                <el-form-item label="历史传说/文化故事" :label-width="formLabelWidth">
                    <el-input type="textarea" :autosize="{ minRows: 2 }" placeholder="请输入内容"
                        v-model="addTreeForm.description">
                    </el-input>
                </el-form-item>

                <el-form-item label="古树生长位置图片" :label-width="formLabelWidth">
                    <el-button type="text" @click="dialogPlaceImgVisible = true">添加图片</el-button>
                </el-form-item>

                <el-form-item label="古树图片" :label-width="formLabelWidth">
                    <el-button type="text" @click="dialogTreeImgVisible = true">添加图片</el-button>
                </el-form-item>
            </el-form>
            <div class="demo-drawer__footer" style="text-align: center;">
                <el-button @click="cancelAddTree()">取 消</el-button>
                <el-button type="primary" @click="saveTree()" :loading="loading">
                    保存
                </el-button>
            </div>
        </el-dialog>

    </div>
</template>


<script>

export default {
    name: 'TreeInfo',
    components: {},
    data() {
        return {
            disabled: true,
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


            dialogPlaceImgVisible: false,    //编辑古树生长位置图片
            dialogTreeImgVisible: false,    //编辑古树图片
            dialogPreviewVisible: false,    //预览古树图片
            dialogPlaceVisible: false,       //预览生长地区图片

            previewImageUrl: '',             //预览古树图片的URL
            placepreviewImageUrl: '',       //预览生长位置图片的URL
            treeImg: [],                     //古树图片
            placeImg: [],                    //生长位置图片
            IMGdisabled: true,

            addTreeDialogVisible: false,
            addTreeForm: {
                name: '',
                scientificName: '',
                height: '',
                diameter: '',
                place: '',
                detailedLocation: '',
                curTreeClassifyInfo: [],
                description: '',

            }
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
                if (this.curTree != null && Object.keys(newValue).length != 0 && this.curTree != {}) {
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
                var treeImg = []
                var len1 = this.curTree.treeImg.length
                // console.log("111img",this.curTree.treeImg)
                for (var index = 0; index < len1; index++) {
                    treeImg.push({ name: index, url: this.curTree.treeImg[index] })
                }
                // console.log("treeImg",treeImg)
                this.treeImg = treeImg

                var placeImg = []
                var len2 = this.curTree.placeImg.length
                for (var index2 = 0; index2 < len2; index2++) {
                    placeImg.push({ name: index2, url: this.curTree.placeImg[index2] })
                }
                // console.log("placeImg",placeImg)
                this.placeImg = placeImg


                // console.log(this.curtreeImg)
            }

        }
    },
    computed: {
        // curTreeClassifyInfo() {
        //     if(this.curTree != null){
        //         var res = [];
        //         var len = this.curTree.fid.length
        //         for(var i=0;i<len;i++){
        //             res.push([this.curTree.fid[i],this.curTree.gid[i],this.curTree.sid[i]]);
        //         }
        //         return res;
        //     } else{
        //         return []
        //     }
        // }
    },
    methods: {
        save(){
            this.dialog = false
            this.$message.success("修改成功")
        },
        getClassifyInfo() {
            this.$axios.get(this.$httpUrl + '/getClassifyInfo').then(res => res.data).then(res => {
                this.classifyInfo = res.data
                console.log("classifyInfo", res.data)
            })
        },
        getAllTree() {
            this.$axios.get(this.$httpUrl + '/getAllTree').then(res => res.data).then(res => {
                // console.log("res.data", res.data)
                this.treeInfo = res.data
                // console.log("treeInfo", this.treeInfo)
                this.total = this.treeInfo.length
                this.groupedTreeInfo = this.treeInfo.slice((this.pageNum - 1) * this.pageSize, this.pageNum * this.pageSize)
                // console.log("this.groupedTreeInfo",this.groupedTreeInfo)
            })
        },
        getTreeByName() {
            this.$axios.post(this.$httpUrl + '/getTreeByName', { name: this.name }).then(res => res.data).then(res => {
                console.log(res)
            })
        },
        load() {
            this.groupedTreeInfo = this.treeInfo.slice((this.pageNum - 1) * this.pageSize, this.pageNum * this.pageSize)

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
        //删除古树信息
        handleDelete(row) {  //参数为古树Id
            if (row.species.length > 0 || row.place.length > 0) {
                this.$message.error('请先删除名木古树的生物分类和名木古树的生长地区');
                return;
            }

            this.$axios.post(this.$httpUrl + '/deleteTree', {
                "tid": row.id
            }).then(res => res.data).then(res => {
                console.log(res)
                // if (res.data.length == 0) {
                //     this.$message({
                //         showClose: true,
                //         message: '未找到符合条件的古树'
                //     });
                //     return;
                // } else {
                //     this.treeInfo = res.data
                //     // console.log("treeinfo",this.treeInfo)
                // }
            })
        },
        //批量删除的多选项发生变化
        handleSelectionChange(selection) {
            this.selectedRows = selection;
        },
        //批量删除
        batchDelete() {

        },
        //添加古树
        addTree() {
            this.addTreeDialogVisible = true
        },
        cancelAddTree() {
            this.addTreeDialogVisible = false
            var addTreeForm = {
                name: '',
                scientificName: '',
                height: '',
                diameter: '',
                place: '',
                detailedLocation: '',
                curTreeClassifyInfo: [],
                description: '',
                treeImg:[],
                placeImg:[],
            }
            this.addTreeForm = addTreeForm
        },
        saveTree(){
            if(this.addTreeForm.name.trim() == "" || this.addTreeForm.scientificName.trim() == "" ||this.addTreeForm.diameter.trim() == "" ||this.addTreeForm.height.trim() == "" || this.addTreeForm.description.trim() == "" || this.addTreeForm.place.trim() == ""){
                this.$message.error("古树信息未填写完整")
                return
            }
            console.log(this.addTreeForm)
            this.$message.success("添加成功")
            this.addTreeDialogVisible = false
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
        savePlaceImg() {
            this.dialogPlaceImgVisible = false
        },
        saveTreeImg() {

        },
        // 预览古树图片
        handlePictureCardPreview(file) {
            console.log("prefile.url", file.url)
            this.previewImageUrl = file.url;
            this.dialogPreviewVisible = true;
        },
        // 预览生长位置图片
        handlePlacePictureCardPreview(file) {
            // console.log("prefile.url",file.url)
            this.placepreviewImageUrl = file.url;
            this.dialogPlaceVisible = true;
        },

        handleRemoveTreeImg(file) {
            console.log("remove", file)
            this.treeImg = this.treeImg.filter(item => {
                return item.url != file.url
            })
            // this.curtreeImg = this.curtreeImg.filter(item => item != file)
        },
        handleRemovePlaceImg(file) {
            this.placeImg = this.placeImg.filter(item => {
                return item.url != file.url
            })
            console.log("remove", file)

            // this.curtreeImg = this.curtreeImg.filter(item => item != file)
        },
        handleDownload(file) {
            console.log(file)
        },
        
    },
    created() {
        this.getAllTree()
        this.getClassifyInfo()
    }
}
</script>

<style></style>