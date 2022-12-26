<template>
  <div>
    <div class="charts" id="charts"></div>
    <cop-table :tableColumns="tableColumns" :httpRequest="httpRequest">

      <template #one4Header>998</template>
      <template #one4="scope">
            {{scope.row.id}}
            <el-button @click="handleClick(scope.row,scope.$index)">tabel-set</el-button>
      </template>
    </cop-table>
  </div>
</template>

<script>
import copTable from '@/components/appTable'
import { tableColumns } from './config'
import {playlist} from '@/api'
// import {Chart, DataSet} from '@antv/g2'
// import DataSet from '@antv/data-set'

export default {
  components: { copTable },
  data () {
    return {
      // tableData: [{name: 'lijia1'}, {name: 'lijia2'}, {name: 'lijia3'}, {name: 'lijia4'}, {name: 'lijia5'}, {name: 'lijia6'}, {name: 'lijia6'}, {name: 'lijia7'}, {name: 'lijia8'}, {name: 'lijia9'}, {name: 'lijia10'}, {name: 'lijia'}, {name: 'lijia'}, {name: 'lijia'}, {name: 'lijia'}, {name: 'lijia'}, {name: 'lijia'}, {name: 'lijia'}, {name: 'lijia'}, {name: 'lijia'}]
    }
  },
  computed: {
    tableColumns
  },
  mounted () {
    // this.setChart()

  },
  methods: {
    handleClick (row, index) {
      console.log(row)
      console.log(index)
    },
    async httpRequest (size, num) {
      const params = {
        id: 24381616,
        total: true,
        limit: size,
        offset: num
      }
      console.log(size)
      console.log(num)
      const {songs} = await playlist(params)
      console.log('songs', songs)
      return {
        total: 999999,
        data: songs
      }
    }
    // setChart () {
    //   console.log(data)
    //   const ds = new DataSet()
    //   const dv = ds
    //     .createView('test')
    //     .source(data)
    //     .transform({
    //       as: ['count'],
    //       groupBy: ['release'],
    //       operations: ['count'],
    //       type: 'aggregate'
    //     })
    //     .transform({
    //       type: 'sort-by',
    //       fields: ['release'],
    //       order: 'ASC'
    //     })

    //   const chart = new Chart({
    //     container: 'container',
    //     autoFit: true,
    //     height: 500
    //   })
    //   chart.data(dv.rows)
    //   chart.scale({
    //     count: {
    //       alias: 'top2000 唱片总量',
    //       nice: true
    //     },
    //     release: {
    //       tickInterval: 5,
    //       alias: '唱片发行年份'
    //     }
    //   })
    //   chart.interval().position('release*count')

    //   chart.option('scrollbar', {
    //     type: 'horizontal'
    //   })
    //   chart.interaction('element-visible-filter')
    //   chart.interaction('plot-mousewheel-scroll', {
    //     start: [
    //       { trigger: 'plot:mousewheel', action: 'mousewheel-scroll:scroll', arg: { wheelDelta: 5 } }
    //     ]
    //   })
    //   chart.render()
    //   // })
    // }
  }
}
</script>

<style lang="css" scoped></style>
