<template>
    <div style="margin: 0; padding: 0; height: 100vh; ">

        <el-card style="width: 1000px; height: 255px; margin-top: 20px; margin-bottom: 10px;">
            <!-- <el-cascader placeholder="请选择" :options="classifyList" :props="{ checkStrictly: true }"
                v-model="selectedClassifyOptions" style="width: 200px; margin-right: 10px;" clearable></el-cascader>
            <el-select v-model="place" clearable placeholder="请选择" style="margin-right: 10px; width: 200px;">
                <el-option v-for="item in placeList" :key="item.id" :label="item.name" :value="item.name">
                </el-option>
            </el-select>
            <el-input v-model="treeName" placeholder="古树名" style="width: 200px;"></el-input>
            <el-button type="primary" @click="searchTree()">查询</el-button>
            <el-button type="primary" @click="reset()">重置</el-button> -->
            <el-form label-width="100px">
                <el-form-item label="生物学分类">
                    <el-cascader placeholder="请选择" :options="classifyList" :props="{ checkStrictly: true }"
                        v-model="selectedClassifyOptions" style="width: 200px; margin-right: 10px;"
                        clearable></el-cascader>
                </el-form-item>
                <el-form-item label="生长地区">
                    <el-select v-model="place" clearable placeholder="请选择" style="margin-right: 10px; width: 200px;">
                        <el-option v-for="item in placeList" :key="item.id" :label="item.name" :value="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="古树名">
                    <el-input v-model="treeName" placeholder="古树名" style="width: 200px;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchTree()">查询</el-button>
                    <el-button type="primary" @click="reset()">重置</el-button>
                </el-form-item>

            </el-form>
        </el-card>

        <div style="width: 1000px; margin-bottom: 10px;">
            <el-table ref="multipleTable" :data="treeInfo" tooltip-effect="dark" max-height="400" style="width: 100%;">
                <el-table-column label="古树名" width="120" show-overflow-tooltip>
                    <template slot-scope="scope">{{ scope.row.name }}</template>
                </el-table-column>
                <el-table-column label="学名" width="120" show-overflow-tooltip>
                    <template slot-scope="scope">{{ scope.row.scientificName }}</template>
                </el-table-column>
                <el-table-column label="树高" width="100">
                    <template slot-scope="scope">{{ scope.row.height }}</template>
                </el-table-column>
                <el-table-column label="胸径" width="100">
                    <template slot-scope="scope">{{ scope.row.diameter }}</template>
                </el-table-column>
                <el-table-column label="位置" width="180" show-overflow-tooltip>
                    <template slot-scope="scope">{{ scope.row.place }}-{{ scope.row.detailedLocation }}</template>
                </el-table-column>
                <el-table-column label="生物分类" width="200">
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
                <!-- <el-table-column label="图片" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div style="display: flex; align-items: center;">
                            <el-image v-if="scope.row.treeImg.length != 0"
                                style="width: 100px; height: 100px; flex-shrink: 0;" :src="scope.row.treeImg[0]"
                                fit="fill" lazy>
                            </el-image>
                        </div>
                    </template>
                </el-table-column> -->
                <!-- <el-table-column label="历史传说/文化故事" width="200" show-overflow-tooltip>
                    <template slot-scope="scope">{{ scope.row.description }}</template>
                </el-table-column> -->
                <el-table-column fixed="right" label="" width="150">
                    <template slot-scope="scope">
                        <el-button @click="searchDetail(scope.row)" type="text" size="small">详细信息</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>


        <el-card style="width: 1000px; height: 600px;">
            <div slot="header" class="clearfix">
                <span style="font-size: large; font-weight: bold;">古树图谱</span>
            </div>
            <GraphShow :placeList="placeList" :treeInfo="treeInfo" :classifyList="classifyList"
                style="width: 100%; height: 100%;"></GraphShow>
        </el-card>


        <el-dialog :title="detailTree.name" :visible.sync="dialogFormVisible">
            <el-descriptions>
                <el-descriptions-item label="树名">{{ detailTree.name }}</el-descriptions-item>
                <el-descriptions-item label="学名">{{ detailTree.scientificName }}</el-descriptions-item>
                <el-descriptions-item label="树高">{{ detailTree.height }}</el-descriptions-item>
                <el-descriptions-item label="胸径">
                    {{ detailTree.diameter }}
                </el-descriptions-item>
                <el-descriptions-item label="树龄">{{ detailTree.age }}</el-descriptions-item>
                <el-descriptions-item label="生长位置">{{ detailTree.place }}- {{ detailTree.detailedLocation
                    }}</el-descriptions-item>
                <!-- <el-descriptions-item label="生物分类">{{ detailTree.classification }}</el-descriptions-item>
                <el-descriptions-item label="历史文化">{{ detailTree.description }}</el-descriptions-item> -->
            </el-descriptions>

            <el-descriptions>
                <el-descriptions-item label="生物分类">{{ detailTree.classification }}</el-descriptions-item>
            </el-descriptions>
            <el-descriptions>
                <el-descriptions-item label="历史文化">{{ detailTree.description }}</el-descriptions-item>
            </el-descriptions>
            <el-carousel :interval="4000" type="card" height="300px">
                <el-carousel-item v-for="(img,index) in detailTree.img" :key="index">
                    <el-image  :src="img"></el-image>
                </el-carousel-item>
            </el-carousel>
            
        </el-dialog>
    </div>
</template>


<script>
import GraphShow from './GraphShow.vue'
export default {
    name: "GraphSearch",
    components: { GraphShow },
    data() {
        return {
            classifyList: [],
            placeList: [],
            place: '',
            selectedClassifyOptions: [],
            treeInfo: [],
            treeName: '',
            dialogFormVisible: false,
            detailTree: {},
            formLabelWidth: '80px',
            spanWidth: '100px',
        }
    },
    methods: {

        getClassifyInfo() {
            var _this = this
            this.$axios.get(this.$httpUrl + '/getClassifyInfo').then(res => res.data).then(res => {
                _this.classifyList = res.data
                console.log("classifyList", this.classifyList)
            })
        },
        getPlaceInfo() {
            var _this = this
            this.$axios.get(this.$httpUrl + '/getPlaceInfo').then(res => res.data).then(res => {
                _this.placeList = res.data
                console.log("placeList", this.placeList)
            })
        },

        searchTree() {
            // console.log("place",this.place)
            // console.log("selectedClassifyOptions",this.selectedClassifyOptions)
            var len = this.selectedClassifyOptions.length
            if (len == 0 || this.place.trim() == '') {
                this.$message.error('未选择古树分类或者古树地区');
                return;
            }

            var parameter = {
                "placeName": this.place,
                "id": (len == 3 ? 'species ' : len == 2 ? 'genus ' : 'family ') + this.selectedClassifyOptions[len - 1],
                "name": this.treeName.trim()
            }
            console.log(parameter)
            this.$axios.post(this.$httpUrl + '/searchTreeByClassifyAndPlace', parameter).then(res => res.data).then(res => {
                if (res.data.length == 0) {
                    this.$message({
                        showClose: true,
                        message: '未找到符合条件的古树'
                    });
                    return;
                } else {
                    this.treeInfo = res.data
                    // console.log("treeinfo",this.treeInfo)
                }
            })
        },
        reset() {
            this.place = '',
                this.selectedClassifyOptions = []
        },
        searchDetail(tree) {
            console.log("detailTree", tree)
            this.detailTree = tree
            console.log(tree.family.length)
            if (tree.family.length == 1) {
                let combinedStr = `${tree.species[0]}-${tree.genus[0]}-${tree.family[0]}`
                console.log(combinedStr)
                this.detailTree.classification = combinedStr
            } else {
                let combinedStr = `${tree.species[0]}-${tree.genus[0]}-${tree.family[0]}、${tree.species[1]}-${tree.genus[1]}-${tree.family[1]}`
                console.log(combinedStr)
                this.detailTree.classification = combinedStr
            }

            this.detailTree.img = this.detailTree.treeImg.concat(this.detailTree.placeImg)
            // this.detailTree.classification = classification
            this.dialogFormVisible = true
            // console.log("de",this.detailTree)
        },
    },
    created() {
        this.getClassifyInfo()
        this.getPlaceInfo()
    },
    mounted() {


    },
}
</script>

<style scoped></style>