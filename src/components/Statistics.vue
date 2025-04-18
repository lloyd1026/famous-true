<template>
    <div>
        <el-card id="statistics" style="height: 600px;width: 900px;"></el-card>
    </div>
</template>


<script>
export default {
    name: 'Statistics',
    components: {},
    data() {
        return {
            statistics: {},
        }
    },
    methods: {
        getStatistics() {
            this.$axios.get(this.$httpUrl + '/getStatistics').then(res => res.data).then(res => {
                // console.log(res)
                console.log(res.data)
                this.statistics = res.data
                this.buildOptions()


            })
        },
        buildOptions() {
            let myChart = this.$echarts.init(document.getElementById('statistics'))
            var option;

            var data = this.statistics
            option = {
                title: {
                    text: '名木古树统计信息',
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: ['古树数量', '科数量', '属数量', '种数量', '地区数量'],
                    axisTick: {
                        alignWithLabel: true
                    }
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: [data.treeCount, data.familyCount, data.genusCount, data.speciesCount, data.placeCount],
                        type: 'bar',
                        barWidth: '60%',
                    }
                ]
            };
            myChart.setOption(option);
        }
    },
    created() {

    },
    mounted() {
        this.getStatistics()
    },
}
</script>

<style scoped>
.login-page {
    /* margin: 0;
    padding: 0;
    background: url("../assets/bg2.webp");
    height: 90vh;
    width: 100vh; */
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>