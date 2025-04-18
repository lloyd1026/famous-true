<template>
  <div>
    <el-menu style="height: 100vh;" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b"
      default-active="/HomePage/Index" router>

      <div style="height: 50px;"> </div>
      <el-menu-item index="/HomePage/Index">
        <i class="el-icon-s-home"></i>
        <span slot="title" style="font-size: medium;">&nbsp;&nbsp;首&nbsp;&nbsp;&nbsp;页&nbsp;&nbsp;</span>
      </el-menu-item>
      <!-- <el-menu-item index="/HomePage/TreeSearch" v-if="isVisitor">
        <i class="el-icon-message"></i>
        <span slot="title" style="font-size: medium;">古树图谱查询</span>
      </el-menu-item> -->
      <el-menu-item index="/HomePage/GraphSearch" v-if="isVisitor">
        <i class="el-icon-message"></i>
        <span slot="title" style="font-size: medium;">古树图谱查询</span>
      </el-menu-item>

      <el-menu-item index="/HomePage/TreeInfo" v-if="!isVisitor">
            <i class="el-icon-message"></i>
            <span slot="title" style="font-size: medium;">古树信息维护</span>
        </el-menu-item>
        <el-menu-item index="/HomePage/ClassifyInfo" v-if="!isVisitor">
            <i class="el-icon-message"></i>
            <span slot="title" style="font-size: medium;">分类信息维护</span>
        </el-menu-item>
        <el-menu-item index="/HomePage/PlaceInfo" v-if="!isVisitor">
            <i class="el-icon-message"></i>
            <span slot="title" style="font-size: medium;">地区信息维护</span>
        </el-menu-item>
      <el-menu-item index="/HomePage/Statistics">
        <i class="el-icon-message"></i>
        <span slot="title" style="font-size: medium;">统计数据</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "Aside",
  data() {
    return {
      currentUser: {},
      isVisitor: true,
    }
  },
  created() {
    var user = sessionStorage.getItem('CurUser')
    if (user != null && user != undefined) {
      this.isVisitor = false;
    }
  },
  mounted() {
    

  },
  methods: {

  },
  beforeMount() {

  },
  props: {

  }
}
</script>

<style scoped></style>