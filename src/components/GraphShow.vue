<template>
    <div>
        <el-card id="chart" style="height: 600px;width: 900px;">
        </el-card>
    </div>
</template>

<script>

export default {
    name: "GraphShow",
    props: {
        classifyList: [],
        placeList: [],
        treeInfo: [],
    },
    data() {
        return {
            tree: [],
            chartOptions: {},
            
        }
    },
    watch: {
        treeInfo:{
            handler(){
                this.show()
            }
        }
    },
    methods: {
        show() {
            if(this.treeInfo.length == 0){
                return;
            }
            let myChart = this.$echarts.init(document.getElementById('chart'))
            myChart.showLoading();
            
            const nodes = [];
            const links = [];

            // 添加古树节点
            this.treeInfo.forEach(tree => {
                nodes.push({ name: tree.name, category: '古树', symbolSize: [100, 60], itemStyle: { color: 'rgb(141, 204, 147)' } })
                // 连接古树与地区
                links.push({ source: tree.name, target: tree.place, name: '生长地区' });
                // 连接古树与树种
                for (var i = 0; i < tree.sid.length; i++) {
                    links.push({ source: tree.name, target: tree.species[i], name: '所属树种' });
                }

            });

            // 添加地区节点

            var t = this.treeInfo[0]
            nodes.push({ name: t.place, category: '地区', symbolSize: [60, 40], itemStyle: { color: 'rgb(165, 171, 182)' } });

            // 添加和连接分类信息节点
            var set = new Set()
            this.treeInfo.forEach(tree => {
                for (var i = 0; i < tree.sid.length; i++) {
                    if (!set.has(tree.sid[i])) {
                        set.add(tree.sid[i])
                        nodes.push({ name: tree.species[i], category: '种', symbolSize: [60, 40] })
                        links.push({ source: tree.species[i], target: tree.genus[i], name: '上级属'})
                    }
                    if (!set.has(tree.gid[i])) {
                        set.add(tree.gid[i])
                        nodes.push({ name: tree.genus[i], category: '属', symbolSize: [60, 40] })
                        links.push({ source: tree.genus[i], target: tree.family[i], name: '上级科' })
                    }
                    if (!set.has(tree.fid[i])) {
                        set.add(tree.fid[i])
                        nodes.push({ name: tree.family[i], category: '科', symbolSize: [60, 40] })
                    }
                }
            });


            const chartOptions = {
                // title: {
                //     text: '古树图谱'
                // },

                tooltip: {
                    formatter: function (params) {
                        if (params.dataType === 'edge') {
                            return `${params.data.source} > ${params.data.name} > ${params.data.target}`;
                        }
                        return params.data.name;
                    }
                },
                legend: {
                    data: [
                        {
                            name: '古树',
                            itemStyle: {
                                color: 'rgb(141, 204, 147)'
                            }
                        },
                        {
                            name: '地区',
                            itemStyle: {
                                color: 'rgb(165, 171, 182)'
                            }
                        },
                        {
                            name: '科',
                        },
                        {
                            name: '属',
                        },
                        {
                            name: '种',
                        }
                    ]
                },
                series: [
                    {
                        type: 'graph',
                        layout: 'force',
                        roam: true,
                        draggable: true,
                        label: {
                            show: true,
                            fontSize:15,
                            // fontWeight:'bold'
                        },
                        
                        data: nodes,
                        links: links,
                        categories: [
                            { name: '古树' },
                            { name: '地区' },
                            { name: '科' },
                            { name: '属' },
                            { name: '种' }
                        ],
                        force: {
                            repulsion: 800,
                            edgeLength: [70, 200],
                        },
                        lineStyle: {
                            opacity: 0.7,
                            width: 1,
                            curveness: 0,
                        },
                        edgeSymbol: ['circle', 'arrow'],
                        edgeSymbolSize: [0, 10],
                        edgeLabel: {
                            show: true,
                            formatter: function (params) {
                                return params.data.name;
                            },
                            fontSize: 9,
                            color: 'black',
                        }
                    }
                ]
            };
            // console.log("nodes", nodes)
            // console.log("links", links)
            myChart.hideLoading()
            myChart.setOption(chartOptions)
        }
    },
    created() {

    },
    mounted() {
        this.show()
        console.log("showtreeinfo", this.treeInfo)
    },
}
</script>

<style scoped></style>